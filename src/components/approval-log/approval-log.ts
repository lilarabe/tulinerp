import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MsgService } from '../../serves/msg.service';
import { ApprovalProvider } from '../../providers/approval/approval';
import { AjaxService } from '../../serves/ajax.service';
import { ApprovalDataType, DEFAULT_APPROVAL_DATA } from '../../interface/approval.interface';
import { NavController, NavParams } from 'ionic-angular';
import { AppGlobalType } from '../../interface/global.interface';
import { DetailChildrenDataType, DetailMoreDataType } from '../../interface/detail.interface';
import { DataInformService } from '../../providers/multifile/dataInform.service';
// import { DetailFormulaProvider } from '../../providers/detail/detail-formula';
import { EditFormulaItemData } from 'providers/edit/edit-formula';
declare let app_global: AppGlobalType;



@Component({
  selector: 'approval-log',
  templateUrl: 'approval-log.html',
  host: {
    'class': 'approval-log',
  },
})
export class ApprovalLogComponent {

  @ViewChild('textarea') textarea;

  /** 审批数据 */
  @Input() approvalData: ApprovalDataType = DEFAULT_APPROVAL_DATA;

  /** 审批数据 */
  @Input() moreData: Array<DetailMoreDataType> = [];

  /** 子表数据 */
  @Input() chilerenData: Array<DetailChildrenDataType> = [];

  /** 计算公式数据 */
  @Input() formulaData: Array<EditFormulaItemData> = [];

  /** 提交数据 */
  @Output() postSuccessEvent = new EventEmitter();

  /** 获取焦点事件 */
  @Output() textareaFocusEvent = new EventEmitter();

  /** 点击同意，存在必填字段则跳转审批编辑 */
  @Output() postShowItem = new EventEmitter();



  /** 审批提交数据 */
  private _postData: ApprovalPostDataType = DEFAULT_APPROVAL_POST_DATA;

  /** 是否在提交ing */
  public isPosting: boolean = false;

  public message: string = '';

  public fields: Set<String> = new Set();

  public have: boolean = false;

  public subscription: any;

  constructor(
    private _msg: MsgService,
    private _approvalProvider: ApprovalProvider,
    private _ajax: AjaxService,
    private _navCtrl: NavController,
    // private _detailFormulaProvider: DetailFormulaProvider,
    public navParams: NavParams,
    private _dataInform: DataInformService,
  ) {
    if (!this.have && !this._dataInform.isHaveA) {
      this._dataInform.init();
      this.subscription = this._dataInform.isApprove$.subscribe(async (res) => {
        if (res) {
          this.have = true;
          console.log("审批同意，执行")
          await this.consent();
          this._dataInform.setIsApproveFalse();
        }
      });
    }


  }
  ngOnDestroy() {
    this._dataInform.destroy();
  }


  /** textarea 获取焦点事件 */
  public focusTextarea = (): void => {
    this.textareaFocusEvent.emit();
  }

  /** app-textarea组件输出信息 */
  public textareaValueChange = (val: string) => {
    this.message = val;
  }

  /**
   * @description 同意
   * @memberof ApprovalLogComponent
   */
  public doOk = async () => {
    if (this.isPosting) {
      return;
    }


    this._postData.isAgree = true;
    this.fields.clear();
    /** 验证主表字段是否必填 */
    // const testResult = this._approvalProvider.testRequiredFields(this.approvalData.baseOpenFiled, this.moreData);
    // if(testResult.result === false){
    //   this._msg.toast(`${testResult.fieldName}，必填`);
    //   return;
    // }

    // const testResult =this._approvalProvider.testRequiredNotFields(this.approvalData.baseOpenFiled, this.moreData);
    // if(!testResult.result){
    //   testResult.fieldName.map(v=>{
    //     this.fields.add(v)
    //   })
    //   this._navCtrl.push(EditPage,
    //     {
    //       moduleName: this.navParams.get('moduleName'),
    //       id: this.navParams.get('id'),
    //       showItem:this.fields
    //     }
    //   );
    //   return;
    // }

    if (Array.isArray(this.approvalData.baseOpenFiled) && this.approvalData.baseOpenFiled.length > 0) {
      // this.approvalData.baseOpenFiled.map((v: EditFieldsType) => {
      //   this.fields.add(v.key);
      // });
      // this.postShowItem.emit(this.fields);
      this.postShowItem.emit(this.approvalData.baseOpenFiled);
      // this._navCtrl.push(EditPage,
      //   {
      //     moduleName: this.navParams.get('moduleName'),
      //     id: this.navParams.get('id'),
      //     showItem: this.fields
      //   },{
      //     animate:true,
      //     animation:"md-transition",
      //     direction:"forward",
      //     duration:1000,
      //     easing:"ease-in"
      //   }
      // );
      return;
    }

    if (Array.isArray(this.approvalData.chilerenOpenFiled) && this.approvalData.chilerenOpenFiled.length > 0) {
      this.postShowItem.emit(this.fields);
      return;
    }
    await this.consent();

  }

  async consent() {
    if (this.isPosting) {
      return;
    }
    /** 审批提交时触发 */
    // let isOk: boolean = this._detailFormulaProvider.setEditApprovalFormula(
    //   this.moreData, this.formulaData, this.chilerenData, this.approvalData,
    // );
    // if (isOk === false) {
    //   return;
    // }
    this.isPosting = true;
    this._postData.isAgree = true;
    // console.log("提交中")
    if (this.approvalData.isComplete) {
      this._doPostApprovalData();
    } else {
      const approvalerId: string = await this._approvalProvider.selectApprovaler(this.approvalData.approvalerData, 'yes');
      if (approvalerId) {
        this._postData.approvalerId = approvalerId;
        this._doPostApprovalData();
      }
    }
  }

  /**
   * @description 驳回
   * @memberof ApprovalLogComponent
   */
  public doCancel = async () => {
    if (this.isPosting) {
      return;
    }
    if (this.message === '') {
      this._msg.toast(`驳回请写明原因`);
      // this.textarea.setFocus();
      return;
    }
    this._postData.approvalerId = '';
    this._postData.isAgree = false;
    /** 驳回到指定人 */
    if (this.approvalData.rejectData.length > 0) {
      this._postData.rejectValue = await this._approvalProvider.selectApprovaler(this.approvalData.rejectData, 'no', `驳回到指定人`);
      if (this._postData.rejectValue === '') {
        return;
      }
    }
    this._doPostApprovalData();
  }

  /** 提交审批数据 */
  private _doPostApprovalData = (): void => {
    this.isPosting = true;
    this._postData.Type = this.approvalData.moduleName;
    this._postData.ActionID = this.approvalData.moduleId;
    this._postData.Next_node = this.approvalData.Next_node;
    this._postData.approvalStatus = this.approvalData.approvalStatus;
    this._postData.message = this.message;
    const uri: string = 'Approve.php';
    this._ajax.loadData({
      title: '提交审批数据',
      method: 'post',
      uri: uri,
      isLoading: true,
      timeout: 30000,
      // loadingCss:'loading-delay',
      data: this._postData,
    }).subscribe(async (res) => {
      if (res.payload.status === 1) {
        if (this._postData.withdrawSubmit === 1) {
          delete this._postData.withdrawSubmit;
          this._msg.toast('撤回成功');
          // this._navCtrl.pop();
        } else {
          this._msg.toast('提交成功');
          /** 是否审批后自动关闭单据 */
          if (app_global.isApprovedClose) {
            this._navCtrl.pop();
          }
        }
      } else if (res.status === 1) {
        if (this._postData.withdrawSubmit === 1) {
          this._msg.toast('撤回成功');
          delete this._postData.withdrawSubmit;
          // this._navCtrl.pop();
        }
      }
      if (res.status === 2) {
        this.isPosting = false;
        let isRenewal: boolean = await this._msg.confirmAsync("节点发生变化，请在刷新后重试");
        if (isRenewal) {
          this.postSuccessEvent.emit();
          return;
        } else {
          return;
        }
      } else {
        this.postSuccessEvent.emit();
        this.isPosting = false;
      }
    });
  }
  public withdraw = async () => {
    if (this.isPosting) {
      this._msg.toast('正在撤回中，请稍等');
      return;
    }
    let isWithdraw: boolean = await this._msg.confirmAsync("您确定撤回吗？");
    if (isWithdraw) {
      this.isPosting = true;
      this._postData.withdrawSubmit = 1;
      this._doPostApprovalData();
    }
  }
}



/** 审批流提交数据 */

interface ApprovalPostDataType {
  /** 审批人ID */
  approvalerId: string,
  /** 审批状态 */
  approvalStatus: number,
  /** 是否同意 */
  isAgree: boolean,
  /** 意见 */
  message: string,
  /** 模块名 */
  Type: string,
  /** 模块ID */
  ActionID: string,
  /** 驳回到指定人 */
  rejectValue: string,
  /** 撤销提交 */
  withdrawSubmit?: number,
  /** 下一级审批人节点 */
  Next_node: string,
}

const DEFAULT_APPROVAL_POST_DATA: ApprovalPostDataType = {
  approvalerId: '',
  approvalStatus: 0,
  isAgree: false,
  message: '',
  Type: '',
  ActionID: '',
  rejectValue: '-1',
  Next_node: '',
}