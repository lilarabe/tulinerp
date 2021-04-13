import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { AjaxService } from '../../../serves/ajax.service';
import { ToolsProvider } from '../../../serves/tools.service';
import { ActionSheetController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MsgService } from "../../../serves/msg.service";
import { ListPage } from '../../../pages/list/list';
import { ListProvider } from "../../../providers/list/list";
import { Observable } from 'rxjs/Observable';
import { DataInformService } from '../../../providers/multifile/dataInform.service';

// @IonicPage({
//   name: 'workflow-list',
//   segment: 'workflow-list/:moduleName'
// })
@Component({
  selector: 'page-workflow-list',
  templateUrl: 'workflow-list.html',
})
export class WorkflowListPage extends ListPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    protected ajax: AjaxService,
    protected tools: ToolsProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public msg: MsgService,
    public viewCtrl: ViewController,
    protected _modalCtrl: ModalController,
    protected _listProvider: ListProvider,
    protected _events: Events,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _dataInform: DataInformService,
  ) {
    super(navCtrl, navParams, ajax, tools, msg, _modalCtrl, _listProvider, _events, _changeDetectorRef,_dataInform);
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.moduleName = this.navParams.get('moduleName') || '';
    this.headerData.Type = this.moduleName;
    this.listData = [];
    this.filterData = [];
    this.headerData.page = 1;
    this.searchDataValue = '';
    this._iniData();
  }

  /** 搜索取消 */
  public searchClear = (): void => {
    this.searchDataValue = '';
    this.headerData.Query = '';
    this.headerData.page = 1;
    this._iniData();
  }

  /** 点击搜索 */
  public searchInput = (keyword: string): void => {
    this.searchDataValue = keyword;
    if (this.searchDataValue === '') {
      return void 0;
    }
    this.headerData.Query = this.searchDataValue;
    this.headerData.page = 1;
    this.getSearchData$().delay(0).subscribe(res => {
      this.isLoading = false;
      if (res.status === 1) {
        this.title = res.payload.title;
        this.listData = res.payload.listData;
        const listLength: number = this.listData.length;
        this.canFlippingPage = listLength < res.payload.num ? false : true;
        this.totalNum = +res.payload.total;
        /** 权限 */
        this.isAdd = !!res.payload.isAdd;
        this.content.scrollToTop(0);
        this.searchOptions = [];
      }
    });
  }

  /*请求列表数据流*/
  private getSearchData$ = (): Observable<any> => {
    
    this.isLoading = true;
    /** 真实数据 */
    return this.ajax.loadData({
      title: '请求搜索列表数据',
      method: "post",
      uri: 'list_approve.php',
      params: this.headerData,
      data: {
        data: this.postData
      },
    });

  }

  /*请求列表数据流*/
  protected getListData$ = (): Observable<any> => {

    this.isLoading = true;
    /** 真实数据 */
    return this.ajax.loadData({
      title: '请求列表数据',
      method: "post",
      uri: 'list_approve.php',
      params: this.headerData,
      data: {
        data: this.postData,
      },
    });

    /** mock 数据 */
    // return this.ajax.loadData({
    //   title: '请求列表数据',
    //   method: "get",
    //   url: 'assets/data/list.data.json',
    //   params: this.headerData,
    // });

  }

}
