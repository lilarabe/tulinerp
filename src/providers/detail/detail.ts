import { Injectable } from '@angular/core';
import { AjaxService, AjaxServiceLoadDataType, ResponseDataType } from "../../serves/ajax.service";
import { Observable } from 'rxjs';
import { DetailRelevantModuleDataType } from "../../interface/detail.interface";
import { ToolsProvider } from "../../serves/tools.service";
import { App, NavController } from 'ionic-angular';
import { WxV3NativeProvider } from "../../serves/native/wx-v3";
import { WXOpenParamsMiniType } from '../../interface/wx/wx.native.interface';
import { MsgService } from '../../serves/msg.service';
import { IonicStorageService } from '../../serves/ionic-storage.service';
// page
import { ListPage } from "../../pages/list/list";
import { IframePage } from "../../pages/iframe/iframe";
import { DetailPage } from "../../pages/detail/detail";
import { EditPage } from '../../pages/edit/edit';



/**
 * @description 详情页服务
 * @author da
 * @export
 * @class DetailProvider
 */
@Injectable()
export class DetailProvider {

  private readonly _navCtrl: NavController;

  constructor(
    private _ajax: AjaxService,
    private _tools: ToolsProvider,
    private _app: App,
    private _wxNativeProvider: WxV3NativeProvider,
    private _msg: MsgService,
    private _ionicStorageService: IonicStorageService,
  ) {
    this._navCtrl = this._app.getActiveNav();
  }



  /**
   * @description 获取详情页数据
   * @memberof DetailProvider
   */
  public getDetailData = (params: any): Observable<ResponseDataType> => {
    const detailParams: AjaxServiceLoadDataType = {
      title: "获取详情页数据",
      method: "get",
      // url: "assets/data/detail_data_s1.json",
      uri: "detail_data.php",
      params: params,
      // isLoading: true,
      loadingCss:'loading-delay',
    };
    return this._ajax.loadData(detailParams);
  }

  /**
   * @description 相关模块ajax请求
   * @memberof DetailProvider
   */
  public relevantModuleRequest = (url: string, method: string = 'get', data: object = {}): Observable<any> => {
    let ajaxParams: AjaxServiceLoadDataType;
    if (method.toLowerCase() === 'get') {
      ajaxParams = {
        title: "相关模块ajax请求",
        method: "get",
        url: url,
        params: data,
      };
    } else if (method.toLowerCase() === 'post') {
      ajaxParams = {
        title: "相关模块ajax请求",
        method: "post",
        url: url,
        data: data,
      };
    }
    return this._ajax.loadData(ajaxParams);
  }



  /**
   * @description push 相关模块页面
   * @memberof DetailProvider
   */
  public pushOtherPage = (relevantModuleData: DetailRelevantModuleDataType): void => {

    const pushPage: Function = (page): void => {
      let params: any = {};
      params.moduleName = relevantModuleData.moduleName;
      if (!params.moduleName) {
        this._msg.toast(`相关模块页面 moduleName 错误`);
        return void 0;
      }
      if (this._tools.isObject(relevantModuleData.params)) {
        params = this._tools.extend(params, relevantModuleData.params);
      }
      if(page === EditPage){
        params.action = 'add';
      }
      this._navCtrl.push(page, params);
    }

    switch (relevantModuleData.action) {
      case 'list':
        pushPage(ListPage);
        break;
      case 'add':
        pushPage(EditPage);
        break;
      case 'detail':
        pushPage(DetailPage);
        break;
      case 'link':
        this._navCtrl.push(IframePage, { url: relevantModuleData.url, title: relevantModuleData.title });
        break;
      case 'openWeapp':
        const params: WXOpenParamsMiniType = {
          username: relevantModuleData.weapp.appid,
          path: relevantModuleData.weapp.path,
          query: relevantModuleData.weapp.query,
          programType: 0,
        };
        this._wxNativeProvider.openMiniProgram(params).then();
        break;
      case 'ajax':
        const url = relevantModuleData.url;
        const method = relevantModuleData.method;
        const data = relevantModuleData.data;
        this.relevantModuleRequest(url, method, data).subscribe((res) => {
          if (res.status === 1) {
            this._msg.toast(res.payload.msg);
          }
        });
        break;
      default:
        this._msg.toast(`相关模块页面 actin 错误`);
        this._tools.printDebugMsg(`push 相关模块页面 actin 错误`, true);
        break
    }

  }


  /**
   * @description 审批流提交
   * @memberof DetailProvider
   */
  public approvalSubmit = (params): Observable<ResponseDataType> => {
    const approvalParams: AjaxServiceLoadDataType = {
      title: "审批流提交",
      method: "get",
      // url: "assets/data/test.data.json",
      uri: "Approve_submit.php",
      isLoading: true,
      params: params,
    };
    return this._ajax.loadData(approvalParams);
  }


  /**
   * @description 头部更多按钮下拉扩展内容点击提交
   * @memberof DetailProvider
   */
  public topMenuExtraBtnSubmit = (url: string): Observable<any> => {
    return this._ajax.loadData({
      title: '头部更多按钮下拉扩展内容点击提交',
      method: 'get',
      url,
      debug: false,
    });
  }

  /** 发送数据到PC */
  public sendDataToPC = async (moduleName, id) => {
    const Type: string = moduleName;
    const ActionID: string = id;
    const company: string = await this._ionicStorageService.get('company');
    const username: string = await this._ionicStorageService.get('username');
    const msg: string = `单据 [${ActionID}] 已发送至 [${company}] 的 [${username}] 的PC端，请至PC端查看。`;
    const uri: string = `sync_pc.php`;
    this._ajax.loadData({
      title: '发送数据到PC',
      method: 'get',
      uri,
      params: { Type, ActionID },
    }).subscribe((res) => {
      if (res.status === 1) {
        this._msg.toast(msg);
      } else {
        this._msg.toast(`发送失败`);
      }
    });
  }

}
