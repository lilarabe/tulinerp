import { Component, Input, OnChanges } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListItemsType } from "../../interface/list.interface";
import { MsgService } from "../../serves/msg.service";
import { ListProvider } from "../../providers/list/list";
import { DetailPage } from "../../pages/detail/detail";
import { EditPage } from "../../pages/edit/edit";


@Component({
  selector: 'display-items',
  templateUrl: 'display-items.html',
})
export class DisplayItemsComponent implements OnChanges {

  /** 列表数据 */
  @Input() public listData: Array<ListItemsType> = [];

  /** 模块名称 */
  @Input() public moduleName: string = '';

  /** 父模块名称 */
  @Input() public parentModuleName: string = "";

  /** 是否运行列表滑动 */
  @Input() public isDrag: boolean = false;

  /** 点击动作 */
  @Input() public clickAction: 'toEditPage' | 'toAddPage' | 'toDetailPage' | 'toEditViewPage' | 'toDetailPageMessage' | '' = '';

  /** 详情页 */
  private detailPage = DetailPage;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public msg: MsgService,
    public listProvider: ListProvider,
  ) {
  }

  ngOnChanges() {
    if (this.moduleName) {
      /** 列表数据存储到服务中 */
      this.listProvider.setListData(this.moduleName, this.listData);
    }
  }



  /**
   * @description 删除
   * @memberof DisplayItemsComponent
   */
  public del = async (itemId: string, idx: number, items: ListItemsType) => {
    const childItemId: string = items.chileren_id;
    const childTableName: string = this.moduleName;

    const confirm = await this.msg.confirmAsync('您确定要删除吗');

    if (childItemId && childTableName) { // 子表删除 
      if (confirm) {
        this.listProvider.delChildItem(childTableName, childItemId).subscribe(res => {
          if (res.status === 1) {
            // this.listData = this.listProvider.delListData(childTableName, childItemId);
            this.listData.splice(idx, 1);
            this.listProvider.setListData(this.moduleName, this.listData);
          }
        });
      }
    } else if (itemId && this.moduleName) { // 主表删除
      if (confirm) {
        this.listProvider.delItem(itemId, this.moduleName).subscribe(res => {
          if (res.status === 1) {
            this.listData = this.listProvider.delListData(this.moduleName, itemId);
            // this.listData.splice(idx, 1);
          }
        });
      }
    } else {
      this.msg.toast(`参数错误无法删除数据`);
    }

  }


  /**
   * @description push 详情页
   * @memberof DisplayItemsComponent
   */
  private _pushDetailPage = (items: ListItemsType): void => {
    const id: string = items.id;
    const moduleName: string = items.Goto_Module || this.moduleName;
    this.navCtrl.push(this.detailPage, { moduleName, id });
  }

  /**
   * @description push 编辑页
   * @memberof DisplayItemsComponent
   */
  public pushEditPage = (items: ListItemsType, action: 'add' | 'edit' | 'view' = 'edit'): void => {
    const id: string = items.id;
    const moduleName: string = items.Goto_Module || this.moduleName;
    const showFieldsSet: Set<string> = items.showFieldsSet ? items.showFieldsSet : new Set();
    if (this.parentModuleName) {
      this.navCtrl.push(EditPage, {
        moduleName: this.parentModuleName,
        childModuleName: this.moduleName,
        id,
        chileren_id: items.chileren_id,
        showFieldsSet,
        action,
      });
    } else {
      this.navCtrl.push(EditPage, { moduleName, id, showFieldsSet });
    }
  }


  /**
   * @description push 编辑页预览页
   * @memberof DisplayItemsComponent
   */
  private _pushEditViewPage = (items: ListItemsType): void => {
    if (this.parentModuleName) {
      this.navCtrl.push(EditPage, { moduleName: this.parentModuleName, childModuleName: this.moduleName, id: items.id, chileren_id: items.chileren_id, action: 'view' });
    } else {
      this.navCtrl.push(EditPage, { moduleName: this.moduleName, id: items.id, action: 'view' });
    }
  }

  /**
   * @description push 详情页 定位到 相关模块
   * @memberof DisplayItemsComponent
   */
  private _pushDetailPageMessage = (items: ListItemsType): void => {
    const id: string = items.id;
    const moduleName: string = items.Goto_Module || this.moduleName;
    const position: string = 'otherModules';
    this.navCtrl.push(this.detailPage, { moduleName, id, position });
  }


  /**
   * @description 点击 Item
   * @memberof DisplayItemsComponent
   */
  public clickItem = (items: ListItemsType): void => {

    if(items.isTempSave){
      this.pushEditPage(items, 'edit');
      return;
    }

    if (this.clickAction === 'toAddPage') {
      this.pushEditPage(items, 'add');
    } else if (this.clickAction === 'toEditPage') {
      this.pushEditPage(items, 'edit');
    } else if (this.clickAction === 'toDetailPage') {
      this._pushDetailPage(items);
    } else if (this.clickAction === 'toEditViewPage') {
      this._pushEditViewPage(items);
    } else if (this.clickAction === 'toDetailPageMessage') {
      this._pushDetailPageMessage(items);
    }
  }

}
