import { Component, Input } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MsgService } from "../../serves/msg.service";
import { ListProvider } from "../../providers/list/list";
import { DisplayItemsComponent } from "../display-items/display-items";
import { SelectedDataType, SheetlinkFetchData, SheetlinkGetData, SheetlinkPostData } from "../../interface/components/sheetlink.interface";
import { EditProvider } from '../../providers/edit/edit';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'select-items',
  templateUrl: 'select-items.html'
})
export class SelectItemsComponent extends DisplayItemsComponent {

  @Input() public workFlowId: string = '';

  @Input() public currentData: any = {};
  /** 主表表单 */
  @Input() public mainForm: FormGroup;
  /** 标记 主表还是子表 */
  @Input() public action: string = '';
  /** 防抖 */
  private _isLoading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public msg: MsgService,
    public listProvider: ListProvider,
    public viewCtrl: ViewController,
    private _editProvider: EditProvider,
  ) {
    super(navCtrl, navParams, msg, listProvider);
  }

  /** 选择 item */
  public doSelect = async (data: any = {}) => {
    /** 防抖 */
    if (this._isLoading) return;

    this._isLoading = true;
    const Type: string = this.moduleName;
    // const workFlowId: string = this.workFlowId;
    const DoWorkflow: string = this.workFlowId;
    /** 主表数据 */
    let main: any = this.currentData;
    /** 子表数据 */
    let sub: any = {};
    if (this.action === 'child') {
      main = this.mainForm.value;
      sub = this.currentData;
    } else {
      main = this.currentData;
      sub = {};
    }
    const choseData: any = data.choseData;
    let currentData: any = { main, sub };

    /** get 数据 */
    const getData: SheetlinkGetData = { Type, DoWorkflow, };
    /** post 数据 */
    const postData: SheetlinkPostData = { currentData, choseData };

    let selectData: Array<SelectedDataType> = [];
    
    /** sheetlink 返回数据 */
    const sheetlinkData: SheetlinkFetchData = await this._editProvider.getSheetLinkData(getData, postData);

    if (sheetlinkData && sheetlinkData.Main) {
      selectData = [];
      for (let key in sheetlinkData.Main) {
        const item: SelectedDataType = { key, value: sheetlinkData.Main[key].value, displayValue: sheetlinkData.Main[key].displayValue };
        selectData.push(item);
      }
    }
    this._isLoading = false;
    this.viewCtrl.dismiss({ selectData, sheetlinkData });

  }

}

