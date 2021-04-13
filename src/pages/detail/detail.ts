import { Component, ViewChild, ElementRef, ContentChild } from '@angular/core';
import { NavController, NavParams, Content, Events, ModalController } from 'ionic-angular';
import { DetailProvider } from "../../providers/detail/detail";
import { EditPage } from "../edit/edit";
import { DetailMoreDataType, DetailRelevantModuleDataType, TopMenuExtraBtns, DetailChildrenDataType } from "../../interface/detail.interface";
import { ApprovalDataType, DEFAULT_APPROVAL_DATA, EditFieldsType } from '../../interface/approval.interface';
import { ApprovalProvider } from '../../providers/approval/approval';
import { MsgService } from '../../serves/msg.service';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu';
import { DetailRulesProvider } from '../../providers/detail/detail-rules';
import { EditFormulaItemData } from '../../providers/edit/edit-formula';
import { DetailFormulaProvider } from '../../providers/detail/detail-formula';
import { EditRulesType } from '../../interface/rules.interface';
import { ChatComponent } from '../../components/chat/chat';
import { DetailFieldsDisplayProvider } from '../../providers/detail/detail-fields-display';
import { DataInformService } from '../../providers/multifile/dataInform.service';
import { EditorTabsLabel } from '../../components/editor/editor-tabs/editor-tabs';
// import { IonicStorageService } from '../../serves/ionic-storage.service';

// @IonicPage({
//   name: 'detail',
//   segment: 'detail/:moduleName/:id',
//   defaultHistory: ['home']
// })
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  @ViewChild(Content) content: Content;

  /** 审批日志 */
  @ViewChild('approvalLog') approvalLogElementRef: ElementRef;

  /** 相关模块 */
  @ViewChild('otherModules') otherModulesElementRef: ElementRef;

  /** 下拉菜单 */
  @ContentChild(NavMenuComponent) navMenuComponent: NavMenuComponent;

  /** 下拉菜单按钮 */
  public navMenuBtns: Array<{ type: string; name: string; btn?: TopMenuExtraBtns; data?: any }> = [];

  /*title*/
  public title: string = "";

  /** 主表数据 */
  public baseData: Array<any> = [];

  /** 详细数据 */
  public moreData: Array<DetailMoreDataType> = [];

  /** 子表数据 */
  public chilerenData: Array<DetailChildrenDataType> = [];

  /** 相关模块数据 */
  public relevantModuleData: Array<DetailRelevantModuleDataType> = [];

  /** 展开 or 收起 更多信息 */
  public isShowMore: boolean = true;

  /** 默认icon图标 */
  public defaultIconImage: string = "assets/icon/info.svg";

  /** 子表是否可编辑 */
  public isEdit: boolean = false;

  /** 子表是否可新增 */
  public isAdd: boolean = false;

  /** 错误信息 */
  public errorMsg: string = '';

  /** 是否是审批流 */
  public isApprovalFlow: boolean = false;

  /** 审批流数据 */
  public approvalData: ApprovalDataType = DEFAULT_APPROVAL_DATA;

  /** 头部更多按钮下拉 */
  public topMenuShow: boolean = false;

  /** 头部更多按钮下拉扩展内容 */
  public topMenuExtraBtns: Array<TopMenuExtraBtns> = [];

  /** 计算公式数据 */
  public formulaData: Array<EditFormulaItemData> = [];

  /** 是否读取数据完毕 */
  public isDidLoadData: boolean = false;

  /** 留言版条数 */
  public DiscussSum: number = 0;

  public labelShow: boolean = false;

  /** 主表可编辑字段:这个数组表示
   * 1.包含字段在详情页显示,不包含字段value为空不显示.
   * 2.可通过开关显示所有字段.
   * 3.在编辑页显示包含字段,如果选择器为hidden,不处理.
   * 4.所有操作无视hidden
   */
  public masterFieldsSet: Set<string> = new Set();
  /** 主表被改变的字段 */
  public changedMasterFields: Set<string> = new Set();

  /** 子表可编辑字段  */
  public chilerenFieldsMap: Map<string, Array<EditFieldsType>> = new Map();

  public activeIndex = 0;

  /** 是否请求完成 */
  public isLoaded: boolean = false;

  public approvalSubmits: boolean = false;

  /** 审批时主表显示的字段 */
  public showItem:  Array<EditFieldsType> = [];

  /** 开启审批弹窗的动画 */
  public addAnimation: boolean = false;

  /** 关闭审批弹窗的动画 */
  public pageOutAni: boolean = false;

  /** tabs */
  public headerTabs: EditorTabsLabel[] = [];

  /** 主子表切换时当前显示的id */
  public activeStepId: string = 'master';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private detailProvider: DetailProvider,
    protected _approvalProvider: ApprovalProvider,
    protected _msg: MsgService,
    protected _events: Events,
    protected _detailRulesProvider: DetailRulesProvider,
    protected _detailFormulaProvider: DetailFormulaProvider,
    protected _modalCtrl: ModalController,
    protected _detailFieldsDisplayProvider: DetailFieldsDisplayProvider,
    // protected _ionicStorageService: IonicStorageService,
    protected _dataInform: DataInformService,
  ) {

  }

  ionViewDidEnter() {
    // console.log(this.navCtrl.getViews());
    /** 如果上个页面是新增页，移处新增页 */
    if (this.navCtrl.getPrevious() && this.navCtrl.getPrevious().name === "EditPage") {
      this.navCtrl.removeView(this.navCtrl.getPrevious());
    }
  }

  ionViewWillEnter() {
    this.labelShow = false;
    this.activeIndex = 0;
    this.getDetailData();
  }


  /**
   * @description 获取详情数据
   * @private
   * @memberof DetailPage
   */
  private getDetailData = (): Promise<any> => {
    return new Promise((resolve) => {
      const params: any = this.getParams();
      this.detailProvider.getDetailData(params).subscribe(async (detailData) => {

        if (detailData.status === 1) {
          /* 显示错误信息 */
          if (detailData.payload.errorMsg) {
            this.errorMsg = detailData.payload.errorMsg;
            return void 0;
          }

          /** 头部更多按钮下拉扩展内容 */
          if (Array.isArray(detailData.payload.Extra)) {
            this.topMenuExtraBtns = Array.isArray(detailData.payload.Extra) ? detailData.payload.Extra : [];
          }

          this.baseData[0] = detailData.payload.baseData;
          this.moreData = Array.isArray(detailData.payload.moreData) ? detailData.payload.moreData : [];
          this.chilerenData = Array.isArray(detailData.payload.chilerenData) ? detailData.payload.chilerenData : [];
          this.relevantModuleData = Array.isArray(detailData.payload.relevantModuleData) ? detailData.payload.relevantModuleData : [];
          this.title = detailData.payload.title + '详情';


          /** 是否存在子表数据 或者 相关模块数据 */
          // const hasData1: boolean = (this.chilerenData.length + this.relevantModuleData.length) > 0;
          /** 是否存在基础数据 */
          // const hasData2: boolean = detailData.payload.baseData.itemData.length > 0;
          // this.isShowMore = !hasData1 || !hasData2;

          /** 是否可编辑 */
          this.isEdit = !!detailData.payload.isEdit;
          /** 是否是审批流 */
          this.isApprovalFlow = !!detailData.payload.isApprovalFlow;

          this.approvalData = { ...this.approvalData, ...detailData.payload.approvalData };
          this.approvalData.moduleName = this.getParams().Type;
          this.approvalData.moduleId = this.getParams().ActionID;
          this.approvalData.Next_node = detailData.payload.approvalData.next_node;

          /** 主表可编辑字段 */
          if (Array.isArray(this.approvalData.baseOpenFiled) && this.approvalData.approvalStatus === 1) {
            this.approvalData.baseOpenFiled.map((v: EditFieldsType) => {
              this.masterFieldsSet.add(v.key);
            });
            this.changedMasterFields = await this._detailFieldsDisplayProvider.hideMasterFields(this.moreData, this.masterFieldsSet);
            // this._msg.toast(`已经隐藏不重要的字段`);
          }
          /** 子表可编辑字段  */
          if (this.approvalData.chilerenOpenFiled) {
            for (let item in this.approvalData.chilerenOpenFiled) {
              this.chilerenFieldsMap.set(item, this.approvalData.chilerenOpenFiled[item]);
            }
            this._detailFieldsDisplayProvider.setChildrenFields(this.chilerenData, this.chilerenFieldsMap);
          }

          /** 添加菜单按钮 */
          this.setNavMenuBtns();
          /** 计算公式设置 */
          this.formulaData = Array.isArray(detailData.payload.Calculation) ? detailData.payload.Calculation : [];
          this._detailFormulaProvider.setEditFormula(this.moreData, this.formulaData, this.chilerenData);
          /** 动态表单 */
          const rulesData: EditRulesType[] = Array.isArray(detailData.payload.Dynamic_Form) ? detailData.payload.Dynamic_Form : [];
          this._detailRulesProvider.setDetailRules(this.moreData, rulesData, this.chilerenData);

          /** 生成主子表切换 */
          this.headerTabs = this._setHeaderTabs(this.chilerenData);

          /** 定位 锚记 */
          const position: string = this.navParams.get('position');
          if (position) {
            setTimeout(() => {
              this._toPosition(position);
            }, 500);
          }

          /** 读取数据完毕 */
          this.isDidLoadData = true;
          /** 留言版条数 */
          if (detailData.payload.DiscussSum) {
            this.DiscussSum = detailData.payload.DiscussSum;
          }

          if (params.approvalSubmit === true && this.approvalSubmits === false) {
            params.approvalSubmit = true;
            this.approvalSubmits = true;
            this.approvalSubmit();
          }

        }
        if (this.approvalData.logData.length > 0 || this.relevantModuleData.length > 0) {
          this.labelShow = true;
        }

        /** 请求完成 */
        this.isLoaded = true;
        resolve(true);
      });
    })
  }

  /** 设置子表tabs */
  private _setHeaderTabs = (chilerenData: Array<DetailChildrenDataType>): EditorTabsLabel[] => {
    const result: EditorTabsLabel[] = [{ label: '基本信息', id: `master` }];
    chilerenData.forEach((child, idx) => {
      if (child.isHide === undefined || child.isHide === false) {
        result.push({ label: `${child.name}(${child.listData.length})`, id: `child-${idx}` });
      }
    });
    return result;
  }

  /** 主子表切换 */
  public onActiveLabelChange = (activeTab: EditorTabsLabel) => {
    this.activeStepId = activeTab.id;
    this.content.resize();
    this.content.scrollToTop(0);
  }

  /** 设置菜单按钮 */
  private setNavMenuBtns = (): void => {
    this.navMenuBtns = [];
    /** 是否可编辑:1.后台给出是否可编辑. 2.审批流状态是否是1 */
    if (this.isEdit) {
      this.navMenuBtns.push({ type: 'edit', name: '编辑' });
    }
    /** 定位到审批流日志 */
    if (this.isApprovalFlow && this.approvalData.logData.length > 0) {
      // this.navMenuBtns.push({ type: 'toApprovalLog', name: '审批流' });
    }
    /** 审批流提交 */
    if (this.approvalData.isShowSubmitBtn) {
      this.navMenuBtns.push({ type: 'approvalSubmit', name: '提交' });
    }
    /** 扩展按钮 */
    if (this.topMenuExtraBtns.length > 0) {
      this.topMenuExtraBtns.forEach((v) => {
        this.navMenuBtns.push({ type: 'extra', name: v.name, btn: v });
      });
    }
    /** 发送数据到PC */
    // this.navMenuBtns.push({ type: 'sendDataToPC', name: '发到电脑' });
    /** 显示/隐藏 字段 */
    if (this.changedMasterFields.size > 0) {
      // this.navMenuBtns.push({ type: 'displayFields', name: '显示字段', data: true });
    }
  }

  /** 菜单按钮点击事件 */
  public onNavMenuBtnsClick = async (btn: any) => {
    const type: string = btn.type;
    switch (type) {
      /** 编辑 */
      case 'edit':
        this._pushEditPage();
        break;
      /** 定位到审批流日志 */
      case 'toApprovalLog':
        this._toPosition('approvalLog');
        break;
      /** 审批流提交 */
      case 'approvalSubmit':
        const isOk: boolean = this._detailFormulaProvider.setEditApprovalFormula(
          this.moreData, this.formulaData, this.chilerenData, this.approvalData
        );
        if (isOk) {
          this.approvalSubmit();
        }
        // this.approvalSubmit();
        break;
      /** 扩展按钮 */
      case 'extra':
        this.topMenuExtraBtnsOnClick(btn.btn);
        break;
      /** 发送数据到PC */
      case 'sendDataToPC':
        const Type: string = this.getParams().Type;
        const ActionID: string = this.getParams().ActionID;
        this.detailProvider.sendDataToPC(Type, ActionID);
        break;
      /** 显示/隐藏 字段 */
      case 'displayFields':
        this.navMenuBtns.map(v => {
          if (v.type === 'displayFields') {
            if (v.data) {
              this._detailFieldsDisplayProvider.showMasterFields(this.moreData);
              v.name = `隐藏字段`;
            } else {
              this._detailFieldsDisplayProvider.hideMasterFields(this.moreData, this.masterFieldsSet);
              v.name = `显示字段`;
            }
            v.data = !v.data;
          }
        });
        break;
      default:
        console.log('菜单按钮类型未定义');
        break;
    }
  }

  /**
   * @description 获取 详情信息 get 参数
   * @private
   * @memberof DetailPage
   */
  private getParams = (): any => {
    const params: any = {};
    /** 模块名称赋值 */
    params.Type = this.navParams.get('moduleName');
    /** 详情id赋值 */
    params.ActionID = this.navParams.get('id');
    params.approvalSubmit = this.navParams.get('approvalSubmit') || false;
    return params;
  }

  /**
   * @description push 到编辑页
   * @memberof DetailPage
   */
  private _pushEditPage = (): void => {
    // console.log(this.masterFieldsSet)
    this.navCtrl.push(EditPage,
      {
        moduleName: this.navParams.get('moduleName'),
        id: this.navParams.get('id'),
        showFieldsSet: this.masterFieldsSet,
      }
    );
  }

  /**
   * @description push 相关模块页面
   * @memberof DetailPage
   */
  public pushOtherPage = (relevantModuleData: DetailRelevantModuleDataType): void => {
    this.detailProvider.pushOtherPage(relevantModuleData);
  }

  /** 定位 锚记 滚动到制定位置 */
  private _toPosition = (position: string): void => {
    let offsetTop: number = 0;
    switch (position) {
      /** 定位到相关模块 */
      case 'otherModules':
        offsetTop = this.otherModulesElementRef.nativeElement.offsetTop;
        break;
      /** 定位到审批日志 */
      case 'approvalLog':
        offsetTop = this.approvalLogElementRef.nativeElement.offsetTop;
        break;
      default:
        offsetTop = 0;
        break;
    }
    this.content.scrollTo(0, offsetTop, 0);
  }

  /**
   * @description 接收成功提交审批数据
   * @memberof DetailPage
   */
  public getPostSuccessEvent = (): void => {
    console.log('获取详情数据');
    this.getDetailData();
    this._events.publish('approvalUpdata');
  }

  /**
   * @description 头部下拉菜单
   * @memberof DetailPage
   */
  public toggleMenu = (): void => {
    this.topMenuShow = !this.topMenuShow;
  }

  /**
   * @description 审批流提交
   * @memberof DetailPage
   */
  public approvalSubmit = async (): Promise<void> => {
    const approvalerId: string = await this._approvalProvider.selectApprovaler(this.approvalData.approvalerData, 'yes');
    const ActionID: string = this.getParams().ActionID;
    const Type: string = this.getParams().Type;
    const params = { approvalerId, ActionID, Type };
    if (approvalerId) {
      this.detailProvider.approvalSubmit(params).subscribe(res => {
        if (res.status === 1) {
          this.getDetailData();
        }
      });
    }
  }

  /**
   * @description 头部更多按钮下拉扩展内容点击事件
   * @memberof DetailPage
   */
  public topMenuExtraBtnsOnClick = (btn: TopMenuExtraBtns): void => {
    const action: string = btn.action;
    switch (action) {
      case 'ajax':/** 执行 ajax 请求 */
        this.detailProvider.topMenuExtraBtnSubmit(btn.url).subscribe(
          (res) => {
            if (res.httpStatus === 200) {
              this._msg.toast(`${btn.name} 执行成功`);
            } else {
              this._msg.toast(`${btn.name} 执行失败`);
            }
          }
        );
        break;
      case 'detail':/** push到detail页 */
        const moduleName: string = btn.params.moduleName;
        const id: string = btn.params.id;
        this.navCtrl.push(DetailPage, { moduleName, id });
        break;
      default:
        console.log(`头部更多按钮下拉扩展内容点击事件：type属性不匹配`);
        break;
    }
  }

  /** 审批流 textarea 获取焦点事件 */
  public onTextareaFocusEvent = (): void => {
    this._toPosition('approvalLog');
  }

  /** 开启聊天界面 */
  public toModalChat = (): void => {
    const moduleName: string = this.getParams().Type;
    const ActionID: string = this.getParams().ActionID;
    const modal = this._modalCtrl.create(ChatComponent, { moduleName, ActionID });
    modal.present();
    /** 关闭 modal 赋值 */
    modal.onDidDismiss((val: any) => {
      if (val === 'chat-dismiss') {
        this.DiscussSum = 0;
        this._events.publish('approvalUpdata');
      }
    });
  }

  /** 开启审批弹窗 */
  getPostShowItem(e) {
    this.showItem = e;
    this.addAnimation = true;
    setTimeout(() => {
      this.addAnimation = false;
    }, 2000);
  }

  /** 关闭审批弹窗 */
  async editOut() {
    this.pageOutAni = true;
    setTimeout(() => {
      this.showItem=[];
      this.pageOutAni = false;
    }, 300);
    //告诉审批页同意审批
    if (this._dataInform.getEditSave() || this._dataInform.getIsApprove()) {
      this._dataInform.setEditSave(false);
      await this.getDetailData();
    }
    if (this._dataInform.getIsApprove()) {
      this._dataInform.setIsApprove(false);
      this._dataInform.setIsApproveTrue();
    }

  }
}
