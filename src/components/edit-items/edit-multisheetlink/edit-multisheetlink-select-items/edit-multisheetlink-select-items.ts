import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MsgService } from "../../../../serves/msg.service";
import { ListProvider } from "../../../../providers/list/list";
import { DisplayItemsComponent } from "../../../display-items/display-items";
import { MultisheetlinkSendDataType } from "../../../../interface/components/multisheetlink.interface";

/**
 * 没有任何页面或组件使用到此组件
 * 备注人：戴江凯
 */
@Component({
  selector: 'edit-multisheetlink-select-items',
  templateUrl: 'edit-multisheetlink-select-items.html'
})
export class EditMultisheetlinkSelectItemsComponent extends DisplayItemsComponent {

  /** 发送选择的数据 */
  @Output() sendSelectDataEvent: EventEmitter<MultisheetlinkSendDataType> = new EventEmitter();
  /** 要选择的key */
  @Input() selectKey: string = '';

  /** 选中的数据 */
  private selectedData: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public msg: MsgService,
    public listProvider: ListProvider,
  ) {
    super(navCtrl, navParams, msg, listProvider);
  }

  /**
   * @description 选择 item
   */
  public doSelect = (selectedItems: any = {}): void => {
    selectedItems.isSelected = !selectedItems.isSelected;
    this.selectedData = [];
    if (Array.isArray(this.listData)) {
      for (const items of this.listData) {
        if (items['isSelected']) {
          if (Array.isArray(items.itemData) && items.itemData.length > 0) {
            for (const item of items.itemData) {
              if (item['colName'] === this.selectKey) {
                this.selectedData = [...this.selectedData, item.value]
              }
            }
          } else {
            console.log(`无法找到items.itemData`);
          }
        }
      }
    }
    const strSelectedData: string = this.selectedData.join(',');
    const sendData: MultisheetlinkSendDataType = { strSelectedData, arrSelectedData: this.selectedData };
    this.sendSelectDataEvent.emit(sendData);
  }

}

