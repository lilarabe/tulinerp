import { NavController, NavParams, Content, Navbar } from 'ionic-angular';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { EditProvider } from "../../providers/edit/edit";
import { MsgService } from "../../serves/msg.service";
import {
  GroupDataType,
  PostEditDataType,
  EditDataType,
  EditChildTabType,
  ChildDelEventParams,
  DeleteChildrenDataType,
  StepsData,
  EditSaveQueryParams,
  RelevantionData,
  AddDefaultTrigger,
} from "../../interface/edit.interface";
import { ApprovalDataType, ApprovalSubmitParams, EditFieldsType } from '../../interface/approval.interface';
import { ApprovalProvider } from '../../providers/approval/approval';
import { ListProvider } from '../../providers/list/list';
import { EditFormulaProvider } from '../../providers/edit/edit-formula';
import { EditRulesProvider } from '../../providers/edit/edit-rules';
import { EditRulesType } from '../../interface/rules.interface';
import { EditFieldsDisplayProvider } from '../../providers/edit/edit-fields-display';
import { EditorTabsLabel } from '../../components/editor/editor-tabs/editor-tabs';
import { SheetlinkFetchData } from '../../interface/components/sheetlink.interface';
import { DataInformService } from '../../providers/multifile/dataInform.service';
import { c } from '@angular/core/src/render3';





// @IonicPage({
//   name: 'edit',
//   segment: 'edit/:moduleName/:id',
//   defaultHistory: ['home']
// })
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  /*title*/
  public title: string = "";

  /*模块名称*/
  public moduleName: string = '';

  /**id */
  public id: string = '';

  /*主表表单数据*/
  public editGroupData: Array<GroupDataType>;

  /*表单*/
  public editForm: FormGroup = this._fb.group({});

  /*数据请求 params*/
  public params: any = {};

  /*数据请求 data*/
  private _postData: PostEditDataType = { data: [], childrenData: [] };

  /** 展示方式 */
  public displayStyle: string = "default";

  /** 子表数据 */
  public chilerenData: Array<EditChildTabType> = [];

  /** 是否是审批流 */
  public isApprovalFlow: boolean = false;

  /** 是否全部只读 */
  public isAllReadOnly: boolean = false;

  /** 图片子表是否可编辑 **/
  public isEditGallery: boolean = true;

  /** 审批数据 */
  public approvalData: ApprovalDataType = { approvalerData: [], approvalStatus: -1, Next_node: '' };
  /** 原始审批数据 */
  public approvalMeta: ApprovalDataType = null;

  /** 表单是否保存 */
  public isSaved: boolean = false;

  /** 计算公式数据 */
  private _formulaData: Array<any> = [];

  /** 动态表单数据 */
  private _rulesData: EditRulesType[] = [];

  /** 显示字段 */
  public showFieldsSet: Set<string> = new Set();

  /** 审批页传入 显示字段 */
  @Input() showItem: Array<EditFieldsType> = [];
  @Input() childrenItem: any = [];

  /** 当前页面 */
  public currentPage: 'add' | 'edit' | 'view' = 'edit';

  @ViewChild(Content) content: Content;

  /** 是否请求完成 */
  public isLoaded: boolean = false;

  /** 是否提交中 */
  public isSubmitting: boolean = false;

  /** 判断是否是从审批页进来的 */
  public isEditBtn: boolean = false;

  /** chilerenForm */
  public chilerenForm: FormArray = this._fb.array([]);

  /** 删除的子表数据 */
  private _deletedChildrenData: Array<DeleteChildrenDataType> = [];

  /** 步骤数据 */
  public stepsData: Array<StepsData> = [];
  public activeStepId: string = '';

  /** tabs */
  public headerTabs: EditorTabsLabel[] = [];

  /**告诉审批页关闭弹框 */
  @Output() inform: EventEmitter<void> = new EventEmitter();

  /** 导航栏 */
  @ViewChild(Navbar) navBar: Navbar;

  /** 页面初始化的 sheetlink */
  private _addDefaultTrigger: AddDefaultTrigger = { main: [] };

  /** 打开编辑页的时间 */
  private openTime: any;

  /** 定时器 */
  private timer: any;

  constructor(
    public navParams: NavParams,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _editService: EditProvider,
    private _msg: MsgService,
    private _approvalProvider: ApprovalProvider,
    private _listProvider: ListProvider,
    private _editFormulaProvider: EditFormulaProvider,
    private _editRulesProvider: EditRulesProvider,
    private _editFieldsDisplayProvider: EditFieldsDisplayProvider,
    // private _changeDetectorRef: ChangeDetectorRef,
    private _dataInform: DataInformService,
  ) {
    this._editService.content = this.content;
  }

  ngOnInit(): void {
    if (this.showItem.length > 0 || this.childrenItem.length > 0) {
      this.isEditBtn = true;
      this.ionViewDidLoad()
    }
  }

  async ionViewDidLoad() {
    /** 
     * 绑定返回事件 
     * 详情页弹出，没有 this.navBar
    */
    if (this.navBar) {
      this.navBar.backButtonClick = this._backButtonClick;
    }
    this.isLoaded = false;
    this.setParams();
    this.initData();
    await this.getData();

    /** 预览页 只读 */
    if (this.currentPage === 'view') {
      /** 设置所有选择器只读 **/
      this.isAllReadOnly = true;
      /** 设置图片子表不可编辑 **/
      this.isEditGallery = false;
    }
    /** 设置分组验证 */
    if (this.currentPage === 'add') {
      //初始化，设置分组属性
      this._editService.setGroupsAttr(this.editGroupData);
      this.stepsData = this._editService.setStepsData(this.editGroupData, this.chilerenData);
      if (this.stepsData.length > 0) {
        this.activeStepId = this.stepsData[0].id;
      }
      this.editForm.valueChanges.debounceTime(500).subscribe(() => {
        /** 改变 分组数据 */
        this._editService.setGroupsAttr(this.editGroupData);
        /** 改变 stepsData */
        this.stepsData = this._editService.setStepsData(this.editGroupData, this.chilerenData);
      });
    }
    /** 子表 tabs */
    if (this.currentPage === 'edit') {
      this.editForm.valueChanges.debounceTime(500).subscribe(() => {
        this.headerTabs = this._editService.setHeaderTabs(this.chilerenData);
      });
    }
    /** ion-content重新计算 */
    this.content.resize();
    // console.log(`ionViewDidLoad`);
  }

  ionViewDidEnter() {
    // console.log(`ionViewDidEnter`);
  }

  ionViewWillEnter() {
    // console.log(`ionViewWillEnter`);
    // this._viewCtrl.showBackButton(false);
  }

  ionViewDidLeave() {
    // console.log(`ionViewDidLeave`);
    clearTimeout(this.timer)
  }

  ionViewWillLeave() {
    // console.log(`ionViewWillLeave`);
  }


  /** 是否可以离开页面 */
  async ionViewCanLeave() {

  }

  /** 主子表切换 */
  public onActiveLabelChange = (activeTab: EditorTabsLabel) => {
    this.activeStepId = activeTab.id;
    this.content.resize();
    this.content.scrollToTop(0);
  }

  /**
   * @description 设定提交参数
   * @protected
   * @memberof EditPage
   */
  protected setParams = (): void => {
    this.moduleName = this.navParams.get('moduleName');
    this.id = this.navParams.get('id');
    this.currentPage = this.navParams.get('action') || 'edit';
    this.params.Type = this.moduleName;
    this.params.ActionID = this.id;
    /** 将所有传入的参数合并，作为请求的params参数 */
    this.params = { ...this.params, ...this.navParams.data };
    /** 显示字段 */
    if (this.navParams.get('showFieldsSet')) {
      this.showFieldsSet = this.navParams.get('showFieldsSet');
    }
    // delete 不必要的参数
    delete this.params.page;
    delete this.params.Edition;
    delete this.params.workFlowId;
  }

  /*初始化数据*/
  protected initData = (): void => {
    this.editGroupData = [];
    this.chilerenData = [];
    this.setIsEditGallery();
  }

  /** 设置图片子表是否可编辑 */
  protected setIsEditGallery = (): void => {
    if (this.currentPage === 'edit') {
      this.isEditGallery = true;
    } else if (this.currentPage === 'add') {
      this.isEditGallery = this.isSaved;
    }
  }

  /*获取数据*/
  protected getData = async (): Promise<any> => {
    return new Promise((resolve) => {
      this._editService.getData(this.params).subscribe(async (res) => {

        if (res.status === 1) {
          if (this.currentPage === 'edit') {
            this.title = (res.payload.title || '') + '编辑';
            this.openTime = res.payload.openTime;
            clearTimeout(this.timer);
            this._getConflictData();
          } else if (this.currentPage === 'add') {
            this.title = (res.payload.title || '') + '新增';
          }

          this.editGroupData = res.payload.editGroup || [];
          this.displayStyle = res.payload.displayStyle;
          this.chilerenData = res.payload.chilerenData || [];

          /** 设置子表 */
          this._editService.setChildrenData(this.chilerenData);

          /** 生成主子表切换 */
          this.headerTabs = this._editService.setHeaderTabs(this.chilerenData);

          /** 生成子表表单 */
          this.chilerenForm = this._editService.formatChildrenForm(this.chilerenData);

          /*设置响应式表单EditForm*/
          this.editForm = this._editService.formatEditForm(this.editGroupData);

          /*设置默认数据结构*/
          this._editService.setEditGroupDefaultData(this.editGroupData);

          //初始化，设置分组属性
          this._editService.setGroupsAttr(this.editGroupData);

          /** 设置原始数据 */
          this.editGroupData = this._editService.setMetaData(this.editGroupData);

          /** 设置关联数据 */
          if (this.currentPage === 'add' && res.payload.relevantion) {
            const relevantionData: RelevantionData = res.payload.relevantion;
            this._editService.setMasterRelevantion(
              relevantionData.key,
              relevantionData.value,
              this.editGroupData,
              this.editForm,
              this.chilerenData,
              this.chilerenForm
            );
          }


          /** 设置所有选择器只读 **/
          if (this.isAllReadOnly) {
            this.editGroupData.map((v: GroupDataType) => {
              v.fieldArray.map((field: EditDataType) => {
                field.readonly = true
              });
            });
          }

          /** 编辑默认主表显示 */
          if (this.currentPage === 'edit') {
            this.activeStepId = `master`;
          }
          // if (this.currentPage === 'add') {
          // this.stepsData = this._editService.setStepsData(this.editGroupData, this.chilerenData);
          // if (this.stepsData.length > 0) {
          //   this.activeStepId = this.stepsData[0].id;
          // }
          // }

          /** 设置隐藏字段 */
          if (this.showFieldsSet.size > 0) {
            this._editFieldsDisplayProvider.hideMasterFields(
              this.editForm,
              this.editGroupData,
              this.showFieldsSet,
            );
          }

          /** 页面初始化的 sheetlink */
          this._addDefaultTrigger = res.payload.addDefaultTrigger;
          if (Array.isArray(this._addDefaultTrigger.main)) {
            await this._editService.setSheetLinkByInitData(this._addDefaultTrigger, this.editGroupData, this.editForm, this.chilerenData, this.chilerenForm);
          }

          /** 计算公式设置 */
          this._formulaData = Array.isArray(res.payload.Calculation) ? res.payload.Calculation : [];
          // if (!this.isEditBtn) {
          //   this._editFormulaProvider.setEditFormula(
          //     this.editForm,
          //     this._formulaData,
          //     this.editGroupData,
          //     this.chilerenData,
          //     this.chilerenForm,
          //   );
          // }
          this._editFormulaProvider.setEditFormula(
            this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm,
          );


          /** 动态表单 */
          /**王林说的 */
          if (!this.isEditBtn) {
            /**在审批页时不运行动态表单 */
            this._rulesData = Array.isArray(res.payload.Dynamic_Form) ? res.payload.Dynamic_Form : [];
            this._editRulesProvider.setEditRules(
              this.editForm,
              this._rulesData,
              this.editGroupData,
              this.chilerenData,
              this.chilerenForm,
            );
          }

          this.approvalMeta = res.payload.approvalData;

          // 审批流
          this.isApprovalFlow = !!res.payload.isApprovalFlow;
          // 如果是审批流
          if (this.isApprovalFlow) {
            this.approvalData.approvalStatus = res.payload.approvalData.approvalStatus;
            this.approvalData.approvalerData = res.payload.approvalData.approvalerData;
            this.approvalData.Next_node = res.payload.approvalData.next_node;
          }

          this.content.resize();

          //使用setTimeout的原因是因为设置隐藏时，被计算公式的值给重置了，因为数据太深，没有办法做异步处理，暂时性的使用setTimeout来控制
          //使得数据是经过隐藏处理的
          setTimeout(() => {
            /** 设置隐藏字段 */
            if (this.isEditBtn) {
              this.ApprovalFlowEvent();
            }
            /** 设置隐藏分组 */
            this._editFieldsDisplayProvider.hideGroup(this.editGroupData);
            /** 请求完成 */
            this.isLoaded = true;
            resolve(true);

          }, 1000);
        }
      });
    });

  }

  /**当前为审批弹窗的情况下执行的事件 */
  ApprovalFlowEvent() {
    /**设置主表字段隐藏 */
    this._editFieldsDisplayProvider.hideFields(
      // this._editFieldsDisplayProvider.hideMasterFields(
      this.editForm,
      this.editGroupData,
      this.showItem,
    );
    if (this.childrenItem) {
      /**设置子表字段隐藏 */
      this._editFieldsDisplayProvider.hideChildrenFields(
        this.childrenItem,
        this.chilerenData
      );

      /** 再次生成主子表切换 */
      this.headerTabs = this._editService.setHeaderTabs(this.chilerenData);
    }
  }

  /** 更新列表数据 */
  private _updataListData = (): void => {
    if (this.currentPage === 'add') {
      this._listProvider.addListData(this.moduleName);
    } else if (this.currentPage === 'edit') {
      this._listProvider.editListData(this.moduleName, this.id, this._postData.data);
    }
  }

  /**
   *确定
   *（提交后跳转到审批，进行同意操作）
   * @memberof EditPage
   */
  public detailApprovalConfirm() {
    /** 提交计算公式是否验证通过 call_type == 5 or call_type == 6 */
    const isFormulaOk: boolean = this._editFormulaProvider.setEditApprovalFormulaOK(
      this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm, this.approvalMeta,
    );
    if (isFormulaOk === false) return;
    this.save('back');
  }

  /**
   * 通过分组id获取主表分组数据
   */
  public getMasterGroupData = (groupId: string): GroupDataType => {
    const result: GroupDataType[] = this.editGroupData.filter(v => v.groupId === groupId);
    return result.length > 0 ? result[0] : null;
  }

  /** 新增页面, 下一步 */
  public next = () => {
    if (this.currentPage === 'add') {
      const currStepIndex: number = this.stepsData.findIndex((step) => step.id === this.activeStepId);
      if (currStepIndex >= this.stepsData.length - 1) {
        return;
      }
      this.activeStepId = this.stepsData[currStepIndex + 1].id;
    }
  }

  /** 新增页面, 验证未通过的下一步 */
  public nextInvalid = () => {
    console.log(`当前主表分组数据：`);
    const masterGroupData = this.getMasterGroupData(this.activeStepId);
    console.log(masterGroupData);
    console.log(`分组验证结果：`);
    this._editService.setGroupsAttr(this.editGroupData, true);
  }

  /** 子表添加 */
  public onChildAddEvent = async (childTableName: string) => {
    await this._editService.addChild1(this.editForm, childTableName, this.chilerenData, this.chilerenForm);
    await this.content.scrollToBottom(0);
  }

  /** 子表删除 */
  public onChildDelEvent = async (childDelParams: ChildDelEventParams) => {
    const confirm = await this._msg.confirmAsync('您确定要删除吗?');
    if (confirm) {
      const delData: DeleteChildrenDataType = await this._editService.delChild1(
        childDelParams.tableName,
        childDelParams.delIndex,
        this.chilerenData,
        this.chilerenForm,
      );
      this._deletedChildrenData.push(delData);
    }
  }

  /** sheetlink 子表增加事件 */
  public onSheetlinkChildAddEvent = async (sheetlinkData: SheetlinkFetchData) => {
    /** 删除的子表数据 */
    const delChildData: DeleteChildrenDataType[] =
      (await this._editService.sheetlinkChildAdd(this.editForm, sheetlinkData, this.chilerenData, this.chilerenForm)).delChildData;
    this._deletedChildrenData = this._deletedChildrenData.concat(delChildData);
  }

  /** 获取提交参数 */
  private _getPostQueryParams = (): EditSaveQueryParams => {
    const Type = this.params.Type;
    const ActionID = this.params.ActionID;
    const SystemAction = 'DoInput';
    const saveAcrion = 'submit';
    const params: EditSaveQueryParams = { Type, ActionID, SystemAction, saveAcrion };
    return params;
  }

  /**
   * @description 保存提交
   */
  private _save = (params: EditSaveQueryParams, postData: any): Promise<any> => {
    return new Promise((resolve) => {
      params.openTime = this.openTime;
      this._editService.postData(params, postData).subscribe(async(res) => {
        if (res.status === 1) {
          if (res.payload.id && this.currentPage === 'add') {
            this.params.ActionID = res.payload.id;
          }
          this._updataListData();
          this.isSaved = true;
          this._editService.resetPostChildrenData(this.chilerenForm, this._deletedChildrenData);
          this._deletedChildrenData = [];
          resolve(true);
        } else if(res.status === 2){
          //数据在提交前已经发生变化，需要重新更新数据
          let isConfirm: boolean = await this._msg.confirmAsync(res.payload.msg);
          //判断用户是否同意更新数据
          if (isConfirm) {
            this.getData();
          }
          resolve(false);
        }else {
          resolve(false);
        }
      });
    });
  }

  /** 保存
   * @param action 'only' 暂存
   * @param action 'save' 保存
   * @param action 'submit' 提交审批流
   */
  public save = (action: 'only' | 'save' | 'submit' | 'back'): Promise<any> => {
    this.isSubmitting = true;
    return new Promise(async (resolve) => {
      const params: EditSaveQueryParams = this._getPostQueryParams();
      /** 处理必填字段,并且无法更改.导致表单无法提交字段. */
      await this._editService.setRequiredFields(this.editGroupData);
      /** 处理 post 子表数据 */
      const postChildrenData = this._editService.editPostChildrenData(this.chilerenForm, this._deletedChildrenData);
      /** 主表数据 */
      const postMasterData = this.editForm.value;
      /** post 提交数据 */
      const postData: any = { data: postMasterData, childrenData: postChildrenData, };
      /** 结果 */
      let result: boolean = false;

      switch (action) {
        case 'only':
          result = await this._saveOnly(params, postData);
          break;
        case 'save':
          result = await this._saveSave(params, postData);
          break;
        case 'submit':
          result = await this._saveSubmit(params, postData);
          break;
        case 'back':
          result = await this._saveBack(params, postData);
          break;
        default:
          result = false;
          break;
      }
      this.isSubmitting = false;
      resolve(result);
    });
  }

  /** 暂存 */
  private _saveOnly = (params: EditSaveQueryParams, postData: any): Promise<any> => {
    return new Promise(async (resolve) => {
      /** 结果 */
      let result: boolean = false;
      postData.data.tempsave = '暂存';
      result = await this._save(params, postData);
      if (result) {
        if (this.isEditBtn) {
          this._dataInform.setEditSave(true);
          this._msg.toast('保存成功');
        } else {
          this._msg.toast('暂存成功');
        }
      }
      resolve(result);
    });
  }

  /** 保存 */
  private _saveSave = (params: EditSaveQueryParams, postData: any): Promise<any> => {
    /** 清除暂存 */
    postData.data.tempsave = '';
    return new Promise(async (resolve) => {
      /** 结果 */
      let result: boolean = false;
      /** 表单验证 */
      const valid: boolean = this._editService.testForm(
        this.editForm, this.editGroupData, this.chilerenForm, this.chilerenData
      );
      /** 保存计算公式是否验证通过 call_type == 4 */
      const isFormulaOk: boolean = this._editFormulaProvider.setEditSaveFormula(this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm,);
      if (valid && isFormulaOk) {
        result = await this._save(params, postData);
        if (result) {
          this._msg.toast('保存成功');
        }
      } else {
        result = false;
      }
      resolve(result);
    });
  }

  /** 保存并返回 */
  private _saveBack = (params: EditSaveQueryParams, postData: any): Promise<any> => {
    /** 清除暂存 */
    postData.data.tempsave = '';
    return new Promise(async (resolve) => {
      /** 结果 */
      let result: boolean = false;
      /** 表单验证 */
      const valid: boolean = this._editService.testForm(
        this.editForm, this.editGroupData, this.chilerenForm, this.chilerenData
      );
      if (valid) {
        result = await this._save(params, postData);
      } else {
        result = false;
      }
      if (result) {
        if (this.isEditBtn) {
          this._dataInform.setIsApprove(true);
          this.inform.emit(); //如果是审批页，就关闭弹框
          // this._msg.toast('提交成功');
        } else {
          this._navCtrl.pop();
          this._msg.toast('保存成功');
        }
      }
      resolve(result);
    });
  }

  /** 提交审批流 */
  private _saveSubmit = (params: EditSaveQueryParams, postData: any): Promise<any> => {
    /** 清除暂存 */
    postData.data.tempsave = '';
    return new Promise(async (resolve) => {
      /** 结果 */
      let result: boolean = false;
      /** 验证是否存在审批人 */
      if ((!this.approvalData.approvalerData || this.approvalData.approvalerData.length === 0) && this.currentPage === 'edit') {
        this._msg.toast(`没有审批人可选`);
        result = false;
        resolve(result);
        return;
      }
      /** 表单验证 */
      const valid: boolean = this._editService.testForm(
        this.editForm, this.editGroupData, this.chilerenForm, this.chilerenData
      );
      /** 提交计算公式是否验证通过 call_type == 5 or call_type == 6 */
      const isFormulaOk: boolean = this._editFormulaProvider.setEditApprovalFormula(
        this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm, this.approvalMeta,
      );
      if (valid && isFormulaOk) {
        const confirm: boolean = await this._msg.confirmAsync('您确定要审批提交？<br >提交后无法进行更改?', { ok: '提交审批', cancel: '保存' });
        if (confirm) {
          /** 保存计算公式是否验证通过 call_type == 4 */
          const isFormulaOk: boolean = this._editFormulaProvider.setEditSaveFormula(this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm,);
          if (!isFormulaOk) {
            result = false;
            resolve(result);
            return;
          }
          const saveResult: boolean = await this._save(params, postData);
          if (!saveResult) {
            result = false;
            resolve(result);
            return;
          }
          await this.getData();

          /** 保存重新获取数据后的第二次表单验证 */
          const validSecond: boolean = this._editService.testForm(
            this.editForm, this.editGroupData, this.chilerenForm, this.chilerenData
          );
          /** 保存重新获取数据后的第二次提交计算公式是否验证通过 call_type == 5 or call_type == 6 */
          const isFormulaOkSecond: boolean = this._editFormulaProvider.setEditApprovalFormula(
            this.editForm, this._formulaData, this.editGroupData, this.chilerenData, this.chilerenForm, this.approvalMeta,
          );
          if (!validSecond || !isFormulaOkSecond) {
            console.log("第二次提交验证不通过！");
            result = false;
            resolve(result);
            return false;
          }
          /** 验证是否存在审批人 */
          if ((!this.approvalData.approvalerData || this.approvalData.approvalerData.length === 0) && this.currentPage === 'add') {
            this._msg.toast(`没有审批人可选`);
            result = false;
            resolve(result);
            return;
          }
          const approvalerId: string = await this._approvalProvider.selectApprovaler(this.approvalData.approvalerData, 'yes') || '';
          const ActionID: string = this._getPostQueryParams().ActionID || '';
          const Type: string = this._getPostQueryParams().Type || '';
          const Next_node: string = this.approvalData.Next_node || '';
          /** 验证审批提交参数 */
          if (approvalerId === '' || ActionID === '' || Type === '') {
            this._msg.toast(`审批提交参数错误`);
            result = false;
            resolve(result);
            return;
          }
          const approvalParams: ApprovalSubmitParams = { approvalerId, ActionID, Type, Next_node };
          const approvalResponse = await this._editService.approvalSubmit(approvalParams);
          if (approvalResponse.status === 1) {
            result = true;
          }
          if (result) {
            this._msg.toast('审批提交成功');
            this._navCtrl.pop();
          }
        } else {
          await this._saveSave(params, postData);
        }
      } else {
        result = false;
      }
      resolve(result);
    });
  }

  /** 返回按钮点击事件 */
  private _backButtonClick = async (e: UIEvent) => {
    /** 是否可以离开页面 */
    let isCanLeave: boolean = true;
    /** 是否主表更改 */
    const isMasterDirty: boolean = this.editForm.dirty;
    /** 是否子表更改 */
    const isChildrenDirty: boolean = this.chilerenForm.dirty;
    /** 是否弹出 confirm */
    const isConfirm: boolean = (isMasterDirty || isChildrenDirty) && (this.isSaved === false);
    if (isConfirm) {
      isCanLeave = await this._msg.confirmAsync('当前编辑未保存，是否要离开页面？');
    }
    if (isCanLeave) {
      this._navCtrl.pop();
    }
  }

  /** 每隔15分钟请求一次后台，判断数据是否刷新 */
  private _getConflictData() {
    this.timer = setTimeout(() => {
      let params: EditSaveQueryParams = this._getPostQueryParams();
      params.HasUpdated = this.openTime;
      this._editService.getConflict(params).subscribe(async (res) => {
        if (res.status === 2) { //如果为2，则表示数据已经发生更新，需要重新获取数据
          let isConfirm: boolean = await this._msg.confirmAsync(res.payload.msg);
          //判断用户是否同意更新数据
          if (isConfirm) {
            this.getData();
          } else {
            this._getConflictData();
          }
        } else {
          this._getConflictData();
        }
      })
    }, 900000);//15分钟
  }
}