import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { AjaxService } from '../../serves/ajax.service';
import { ToolsProvider } from '../../serves/tools.service';
import { ActionSheetController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MsgService } from "../../serves/msg.service";
import { ListPage } from '../../pages/list/list';
import { ListProvider } from "../../providers/list/list";
import { DataInformService } from '../../providers/multifile/dataInform.service';
import { FormGroup } from '@angular/forms';



// @IonicPage({
//   name: 'select',
//   segment: 'select/:moduleName'
// })
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage extends ListPage {

  /** views 数量 */
  public viewsLength: number = 0;
  /** 主表表单 */
  public mainForm: FormGroup;
  /** 标记 主表还是子表 */
  public action: string = '';


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
    super(navCtrl, navParams, ajax, tools, msg, _modalCtrl, _listProvider, _events, _changeDetectorRef, _dataInform);
  }

  ionViewDidLoad() {
    this.moduleName = this.navParams.get('moduleName') || '';
    this.headerData.Type = this.moduleName;
    this.headerData.workFlowId = this.navParams.get('workFlowId') || '';
    this.headerData.Edition = 1;
    this.headerData.back = this.navParams.get('editModuleName') || '';
    this.listData = [];
    this.filterData = [];
    this.totalPages = 1;
    this.headerData.page = 1;
    this.postData.searchData = this.postSearchData;
    this.mainForm = this.navParams.get('mainForm');
    this.action = this.navParams.get('action');
    // this.postData.currentData = this.navParams.get('editData') || {};
    if (this.action === 'child') {
      this.postData.currentData = {
        main: this.mainForm.value,
        sub: this.navParams.get('editData'),
      }
    } else {
      this.postData.currentData = {
        main: this.navParams.get('editData'),
        sub: {}
      }
    }
    this._iniData();
    this._catchListDataUpdataEvent();
    this.viewsLength = this.navCtrl.length();
  }

  ionViewWillEnter() { };

  /** 取消 */
  public dismiss = (): void => {
    this.viewCtrl.dismiss({ selectData: [] });
  }


}