import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { AjaxService } from '../../../../serves/ajax.service';
import { ToolsProvider } from '../../../../serves/tools.service';
import { ActionSheetController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MsgService } from "../../../../serves/msg.service";
import { ListPage } from '../../../../pages/list/list';
import { ListProvider } from "../../../../providers/list/list";
import { MultisheetlinkSendDataType } from "../../../../interface/components/multisheetlink.interface";
import { DataInformService } from '../../../../providers/multifile/dataInform.service';


/**
 * 没有任何页面或组件使用到此组件
 * 备注人：戴江凯
 */
@Component({
  selector: 'edit-multisheetlink-select',
  templateUrl: 'edit-multisheetlink-select.html'
})
export class EditMultisheetlinkSelectComponent extends ListPage {

  public strSelectedData: string = '';

  public selectKey: string = ''

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
    super(navCtrl, navParams, ajax, tools, msg, _modalCtrl, _listProvider,_events, _changeDetectorRef,_dataInform);
  }

  ionViewDidLoad() {
    this.moduleName = this.navParams.get('moduleName') || '';
    this.headerData.Type = this.moduleName;
    this.headerData.workFlowId = this.navParams.get('workFlowId') || '';
    this.listData = [];
    this.filterData = [];
    this.totalPages = 1;
    this.headerData.page = 1;
    this.postData.searchData = this.postSearchData;
    this.selectKey = this.navParams.get('selectKey');
  }



  /**
   * @description 接收选择数据
   * @memberof EditMultisheetlinkSelectComponent
   */
  public getSelectData = (event:MultisheetlinkSendDataType): void => {
    this.strSelectedData = event.strSelectedData;
  }


  /**
   * @description 取消
   * @memberof SelectPage
   */
  public dismiss = (): void => {
    this.viewCtrl.dismiss('cancel');
  }



  /**
   * @description 确定
   * @memberof EditMultisheetlinkSelectComponent
   */
  public ok = (): void => {
    this.viewCtrl.dismiss(this.strSelectedData);
  }

}
