import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AjaxService } from '../../serves/ajax.service';
import { WorkflowCategoryType } from '../../interface/workflow.interface';
import { WorkflowListPage } from './workflow-list/workflow-list';
import { DetailPage } from '../detail/detail';
import { IonicStorageService } from '../../serves/ionic-storage.service';
import { ToggleCompanyProvider, ToggleCompany } from '../../providers/toggle-company/toggle-company';
import { MessageListPage } from '../message-list/message-list';
import { ToolsProvider } from '../../serves/tools.service';


// @IonicPage({
//   name: 'workflow',
//   segment: 'workflow',
//   defaultHistory: ['home']
// })
@Component({
  selector: 'page-workflow',
  templateUrl: 'workflow.html',
})
export class WorkflowPage {

  /** 工作流类别数据 */
  private _workFlowCategoryData: WorkflowCategoryType[] = [];
  public workFlowCategoryData: WorkflowCategoryType[] = [];
  public isShowMoreWorkFlowData: boolean = false;
  /** 审批流数据 */
  private _approvalData: WorkflowCategoryType[] = [];
  public approvalData: WorkflowCategoryType[] = [];
  public isShowMoreApprovalData: boolean = false;

  public title: string = '任务';

  /** 其他公司列表 */
  public otherCompanys: Array<ToggleCompany> = [];
  /** 留言数量 */
  public messageBadge: number = 0;
  /** url 参数 */
  public urlParams: any = {};
  /** url 参数:site */
  public site: string = '';

  constructor(
    private _navCtrl: NavController,
    private _ajax: AjaxService,
    private _ionicStorageService: IonicStorageService,
    private _toggleCompanyProvider: ToggleCompanyProvider,
    private _tools: ToolsProvider,
  ) {
  }

  ionViewDidLoad() {
    this.urlParams = this._tools.urlToObj(window.location.href).query;
    this.site = this.urlParams.site || '';
  }

  ionViewWillEnter() {
    this._init();
  }

  private _init = (): void => {
    
    this._setTitle();
    this._getWorkFlowCategoryData();
    this._getCompanys();
    // this._getMessageBadge();
  }

  /** 设置 title */
  private _setTitle = (): void => {
    this._ionicStorageService.get('company').then(res => {
      this.title = res ? `${res}-任务` : `任务`;
    });
  }

  /** 获取其他公司列表 */
  private _getCompanys = (): void => {
    this.otherCompanys = [];
    let currCompanyId: string = '';
    this._ionicStorageService.get('Now_SAAS_DB_AUTH').then(res => {
      currCompanyId = res;
      
      this._toggleCompanyProvider.getCompanys().subscribe(res => {
        if (res.status === 1) {
          if (Array.isArray(res.payload.company)) {
            res.payload.company.forEach((v: ToggleCompany) => {
              if (v.SAAS_DB_AUTH !== currCompanyId) {
                // console.log(`公司:${v.name},ID:${v.SAAS_DB_AUTH}`);
                this.otherCompanys.push(v);
              }
            });
          }
        }
      });
    });

  }

  /**
   * @description 获取工作流类别数据
   * @private
   * @memberof WorkflowPage
   */
  private _getWorkFlowCategoryData = (): void => {
    this._ajax.loadData({
      title: '获取工作流类别数据',
      method: 'get',
      // url: 'assets/data/workflow.index.data.json',
      uri: 'notification.php',
      // isLoading: true,
      timeout: 40000,
      params: {
        todo: 'num_list',
      }
    }).subscribe((res) => {
      if (res.status === 1) {
        this._workFlowCategoryData = res.payload.workflowCategoryData || [];
        this._approvalData = res.payload.approvalData || [];
        this._setAttrColor(this._workFlowCategoryData);
        this._setAttrColor(this._approvalData);
        // console.log(this._approvalData);
        if (this._workFlowCategoryData.length > 30) {
          this.workFlowCategoryData = this._workFlowCategoryData.slice(0, 3);
          this.isShowMoreWorkFlowData = true;
        } else {
          this.workFlowCategoryData = this._workFlowCategoryData;
          this.isShowMoreWorkFlowData = false;
        }
        if (this._approvalData.length > 30) {
          this.approvalData = this._approvalData.slice(0, 3);
          this.isShowMoreApprovalData = true;
        } else {
          this.approvalData = this._approvalData;
          this.isShowMoreApprovalData = false;
        }
      }
    });
  }

  /** 待办中的 已办 已归档 数字改成灰色，
   * 当 待办 和 被驳回 有数字的时候显示红色 */
  private _setAttrColor = (categorys: WorkflowCategoryType[]): void => {
    categorys.map((category) => {
      /** (待办 或 驳回) 并且 有数字 变红色 */
      const reg = /.*(待办事宜|被驳回).*/;
      
      if (reg.test(category.categoryName) && +category.badge) {
        category.badgeColor = 'red';
      } else {
        category.badgeColor = 'gray';
      }
      
    });
  }

  /** 获取信息数量 */
  // private _getMessageBadge = (): void => {
  //   this._ajax.loadData({
  //     title: '获取信息数量',
  //     method: 'get',
  //     uri: 'User_message.php',
  //     params: {
  //       Type: 'SumUnread',
  //     }
  //   }).subscribe(res => {
  //     if (res.status === 1 && res.payload.Message_Sum != undefined) {
  //       this.messageBadge = res.payload.Message_Sum;
  //     }
  //   });
  // }

  /**
   * @description 显示更多 待办事项 数据
   * @memberof WorkflowPage
   */
  public showMoreWorkFlowData = (): void => {
    this.workFlowCategoryData = this._workFlowCategoryData;
    this.isShowMoreWorkFlowData = false;
  }

  /**
   * @description 显示更多 审批流 数据
   * @memberof WorkflowPage
   */
  public showMoreApprovalData = (): void => {
    this.approvalData = this._approvalData;
    this.isShowMoreApprovalData = false;
  }

  /**
   * @description push 列表页
   * @memberof WorkflowPage
   */
  public pushListPage = (moduleName: string): void => {
    this._navCtrl.push(WorkflowListPage, { moduleName });
  }

  /**
   * @description push 详情页
   * @memberof WorkflowPage
   */
  public pushDetailPage = (moduleName: string, id: string): void => {
    this._navCtrl.push(DetailPage, { moduleName, id });
  }

  /** push 留言列表页
   * @param messageType: number : 1.未读 2.已读
   */
  public pushMessageListPage = (messageType: number): void => {
    this._navCtrl.push(MessageListPage, {messageType});
  }

  /** 切换到其他企业 */
  public toggleOtherCompany = (company: ToggleCompany): void => {
    this._toggleCompanyProvider.toggleOtherCompany(company).then(() => {
      this._init();
    });
  }

}