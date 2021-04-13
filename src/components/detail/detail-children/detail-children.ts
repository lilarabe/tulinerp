import { Component, Input } from '@angular/core';
import { DetailChildrenDataType, DETAILCHILDDATA } from '../../../interface/detail.interface';
import { ListItemsType } from '../../../interface/list.interface';
import { NavController, NavParams } from 'ionic-angular';
import { MsgService } from '../../../serves/msg.service';
import { ListProvider } from '../../../providers/list/list';
import { EditPage } from '../../../pages/edit/edit';
import { DetailListComponent } from '../detail-list/detail-list';
import { AjaxService } from '../../../serves/ajax.service';


@Component({
  selector: 'detail-children',
  templateUrl: '../detail-list/detail-list.html'
})
export class DetailChildrenComponent extends DetailListComponent {

  /*表数据*/
  @Input('childData') public childData: DetailChildrenDataType = DETAILCHILDDATA;

  /** 父模块名称 */
  @Input() public parentModuleName: string = "";

  /** 主表ID */
  @Input() moduleId: string = "";

  /** 是否可新增 */
  @Input() isAdd: boolean = true;
  /** 判断是否显示添加 */
  @Input() isShowAdd: boolean = true;

  constructor(
    protected _ajax: AjaxService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public msg: MsgService,
    public listProvider: ListProvider,
  ) { 
    super(_ajax, navCtrl, navParams, msg, listProvider);
  }

  async ngOnChanges() {

    this.setCardHeader();

  }
  
  /** 设置头部信息(重写赋空) */
  public setCardHeader = () => {
   
  }

  /**
 * @description 子表添加
 */
  public add = (): void => {
    this.navCtrl.push(EditPage, {
      moduleName: this.parentModuleName,
      childModuleName: this.childData.moduleName,
      id: this.moduleId,
      showFieldsSet: this.childData.showFieldsSet,
      action: 'add',
    });
  }

  /**
   * @description 删除
   */
  public del = (itemId: string, idx: number, items: ListItemsType): void => {
    const childItemId: string = items.chileren_id;
    const childTableName: string = this.childData.moduleName;

    const confirm = this.msg.confirm('您确定要删除吗');

    if (childItemId && childTableName) { // 子表删除 
      confirm.onDidDismiss(res => {
        if (res) {
          this.listProvider.delChildItem(childTableName, childItemId).subscribe(res => {
            if (res.status === 1) {
              // this.listData = this.listProvider.delListData(childTableName, childItemId);
              this.childData.listData.splice(idx, 1);
              this.listProvider.setListData(this.childData.moduleName, this.childData.listData);
            }
          });
        }
      });
    }

  }


  /**
   * @description push 编辑页
   */
  public pushEditPage = (items: ListItemsType): void => {
    const id: string = items.id;
    const moduleName: string = items.Goto_Module || this.childData.moduleName;
    const showFieldsSet: Set<string> = items.showFieldsSet ? items.showFieldsSet : new Set();
    if (this.parentModuleName) {
      this.navCtrl.push(EditPage, {
        moduleName: this.parentModuleName,
        childModuleName: this.childData.moduleName,
        id,
        chileren_id: items.chileren_id,
        showFieldsSet,
      });
    } else {
      this.navCtrl.push(EditPage, { moduleName, id, showFieldsSet });
    }
  }

}
