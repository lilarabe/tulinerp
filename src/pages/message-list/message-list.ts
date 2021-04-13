import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ViewController, ModalController, Events } from 'ionic-angular';
import { ListPage } from '../list/list';
import { AjaxService } from '../../serves/ajax.service';
import { ToolsProvider } from '../../serves/tools.service';
import { MsgService } from '../../serves/msg.service';
import { ListProvider } from '../../providers/list/list';
import { Observable } from 'rxjs/Observable';
import { DataInformService } from '../../providers/multifile/dataInform.service';


// @IonicPage({
//   name: 'message-list',
//   segment: 'message-list'
// })
@Component({
  selector: 'page-message-list',
  templateUrl: 'message-list.html',
})
export class MessageListPage extends ListPage{

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
    /** 1.未读 2.已读 */
    const messageType: number = this.navParams.get('messageType');
    console.log(messageType);
    this.listData = [];
    this.filterData = [];
    this.headerData.page = 1;
    this.headerData.Type = 'GetMessage';
    this.headerData.messageType = messageType;
    this.searchDataValue = '';
    this._iniData();
  }

  ionViewWillEnter() { 
  }

  /*重写消息列表数据流*/
  protected getListData$ = (): Observable<any> => {

    this.isLoading = true;
    /** 真实数据 */
    return this.ajax.loadData({
      title: '请求列表数据',
      method: "get",
      uri: 'User_message.php',
      // url:'assets/data/test.data.json',
      // isLoading: true,
      // delayLoading: 1000,
      // loadingCss: 'loading-top',
      delay: 0,
      params: this.headerData,
    });

  }

}
