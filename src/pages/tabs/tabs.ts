import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { ChartPage } from '../chart/chart';
import { Tabs, NavController, Tab, Events, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { TpProvider } from '../../providers/tp/tp';
import { UserPage } from "../user/user";
import { DemoPage } from '../demo/demo';
import { WorkflowPage } from '../workflow/workflow';
import { AjaxService } from '../../serves/ajax.service';
import { WorkflowTabsInfoType } from '../../interface/workflow.interface';
import { ConfigPage } from '../config/config';
import { MenuPage } from '../menu/menu';
import { InformPage } from '../inform/inform';
import { MenuProvider } from '../../providers/menu/menu';
import { AppGlobalType } from '../../interface/global.interface';
import { ToolsProvider } from '../../serves/tools.service';
import { DetailPage } from '../../pages/detail/detail';
import { ListPage } from '../list/list';
import { DataInformService } from '../../providers/multifile/dataInform.service';

declare const app_global: AppGlobalType;

// @IonicPage({
//   name: 'tabs',
//   segment: 'tabs-page',
// })
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabs') tabRef: Tabs;

  public isLogin: boolean = false;

  public homePage = HomePage;

  public menuPage = MenuPage;

  public chartPage = ChartPage;

  public userPage = UserPage;

  public demoPage = DemoPage;

  public configPage = ConfigPage;

  public workflowPage = WorkflowPage;

  public informPage = InformPage;

  public listPage = ListPage;

  /** 详情页 */
  private detailPage = DetailPage;

  public unreadMsgCount: number = 0;

  public isGoBacklog:boolean=false;

  /** 工作流数据 */
  public workFlowTabsInfo: WorkflowTabsInfoType = {
    badge: 0,
  };


  constructor(
    private _navCtrl: NavController,
    private tp: TpProvider,
    private loginProvider: LoginProvider,
    private _ajax: AjaxService,
    private _events: Events,
    public platform: Platform,
    private _menuProvider: MenuProvider,
    private _tools: ToolsProvider,
    protected _dataInform:DataInformService,
    // private _wxJsSdkService: WxJsSdkService,
  ) {

    /** 获取工作流数据 */
    this._getWorkFlowInfo();

  }

  async ngOnInit() {
    const isLogin: boolean = await this.loginProvider.asyncIsLogin();
    if (isLogin) {
      this._pushPage();
    }
  }

  async ionViewDidEnter() {
    if(this._dataInform.getIsApprove()){
      return;
    }

    /** 监控审批流数据变化 */
    this._events.subscribe('approvalUpdata', () => {
      /** 重新获取工作流数据 改变 badge 代办tab角标  */
      this._getWorkFlowInfo();
      this._menuProvider.getMenuData();
    });

    /** 切换企业，跳转首页，并且重新请求首页数据 */
    this._events.subscribe('gohome', () => {
      this._menuProvider.menuData = {};
      this.tabRef.select(0);
      this._navCtrl.popToRoot();
      this._menuProvider.getMenuData();
    });

    /** 登录，退出会用到 */
    this.loginProvider.isLogin$.subscribe(async (res: boolean) => {
      this.isLogin = res;
      if (!this.isLogin) {
        this.tp.toLoginPage();
      } else {
        this.tabRef.select(0);
        this._navCtrl.popToRoot();
        await this._menuProvider.getMenuData();
        
        /** 获取工作流数据 */
        this._getWorkFlowInfo();
      }
    });
    /** token 存在 默认登录 */
    const isLogin: boolean = await this.loginProvider.asyncIsLogin();
    if (isLogin) {
      await this._menuProvider.getMenuData();
    } else {
      this.loginProvider.logout();
    }

    if (app_global.isWxWorkMobile) {
      // await this._wxJsSdkService.onHistoryBack();
    }
    if(!this.isGoBacklog){
      this.isGoBacklog=false;
      this.tabRef.select(0);
    }
    
  }

  ionViewWillLeave() {
  }



  /**
   * @description 获取工作流信息
   * @private
   * @memberof TabsPage
   */
  private _getWorkFlowInfo = (): void => {
    this._ajax.loadData({
      title: 'tabs获取工作流信息',
      method: 'get',
      uri: 'notification.php',
      params: {
        todo: 'num_list',
      }
    })
      .subscribe((res) => {
        if (res.status === 1) {
          this.workFlowTabsInfo = res.payload;
          this.workFlowTabsInfo.badge = res.payload.badge;
        }
      });
  }


  /** 返回当前tab的root页 */
  public goToRoot = (tab: Tab): void => {
    tab.goToRoot({});
  }

  /** push 指定页面 */
  private _pushPage = (): void => {
    /** url 参数 */
    const urlParams: any = this._tools.urlToObj(window.location.href).query;
    /** 模块名 */
    let module: string = urlParams.module || '';
    module = module.replace(/\.xml/ig,'');
    /** 模块 id */
    const actionid: string = urlParams.actionid || '';
    /** push 页面名称 */
    const topage: string = urlParams.topage || '';
    const gotoPageHandlers: Map<string,Function> = new Map([
      /** push 到 detail 页面 */
      ['detail',()=>{
        if(module && actionid){
          this._navCtrl.push(this.detailPage, { moduleName:module, id:actionid });
        }
      }],
      ['backlog',()=>{ this.isGoBacklog=true; this.tabRef.select(1);}],
      ['list',()=>{
        if(module){
          this._navCtrl.push(this.listPage, { moduleName:module });
        }
      }],
    ]);

    if(gotoPageHandlers.get(topage)) {
      gotoPageHandlers.get(topage)();
    }
  }

}
