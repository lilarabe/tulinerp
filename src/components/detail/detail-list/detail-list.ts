import { Component, Input, ViewChildren, TemplateRef, QueryList, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { AjaxService } from '../../../serves/ajax.service';
import { ListItemsType } from '../../../interface/list.interface';
import { NavController, NavParams } from 'ionic-angular';
import { MsgService } from '../../../serves/msg.service';
import { ListProvider } from '../../../providers/list/list';
import { DetailChildrenDataType, DETAILCHILDDATA } from '../../../interface/detail.interface';
import { EditPage } from '../../../pages/edit/edit';


@Component({
  selector: 'detail-list',
  templateUrl: 'detail-list.html'
})
export class DetailListComponent {
  /** 相关模块需要数据 */

  /*表数据 子表是传入的，相关模块是ajax请求的 */
  public childData: DetailChildrenDataType = DETAILCHILDDATA;
  /** 相关模块传入，表名 */
  @Input() moduleName: string = '';
  /** 子表请求时携带的参数 */
  @Input() params: any = {};
  /** 用于监听值的改变，来更新数据 */
  @Input() getData: boolean = false;
  /** 通知父级数据加载完成 */
  @Output() accomplish: EventEmitter<boolean> = new EventEmitter();
  /** 判断是否显示添加 */
  @Input() isShowAdd: boolean = true;

  /** 是否可新增, 子表传入， 相关模块请求后获取的 */
  public isAdd: boolean = false;

  @ViewChildren('cardHeaderOutlet', { read: TemplateRef }) cardHeaderOutlet: QueryList<TemplateRef<any>>;

  @ViewChildren('cardHeader', { read: ViewContainerRef }) cardHeader: QueryList<ViewContainerRef>;


  constructor(
    protected _ajax: AjaxService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public msg: MsgService,
    public listProvider: ListProvider,
  ) { }

  async ngOnInit() {
    if (this.moduleName) {
      this.childData = await this.getListData();
      this.isAdd = this.childData.isAdd;
      this.setCardHeader();
    }
  }

  async ngOnChanges() {
    if (this.getData) {
      await this.ngOnInit();
      this.accomplish.emit(true);
    }
  }

  public getListData = (): Promise<any> => {
    this.params.Type = this.moduleName;
    this.params.page = 1;
    return new Promise((resolve) => {
      this._ajax.loadData({
        title: '请求列表数据',
        method: "post",
        uri: 'list_data.php',
        params: this.params,
        data: {},
      }).map((res) => {
        if (Array.isArray(res.payload.listData)) {
          this.filterListDisplayData(res.payload.listData);
        }
        return res;
      }).subscribe((res) => {
        if (res.status === 1) {
          resolve(res.payload);
        }

      });
    });
  }

  /** 设置头部信息 */
  public setCardHeader = () => {
    if (Array.isArray(this.childData.listData)) {
      this.filterListDisplayData(this.childData.listData);
      setTimeout(() => {
        this.cardHeader.map((v, i) => {
          v.createEmbeddedView(this.cardHeaderOutlet.find((vv, ii) => i === ii), { $implicit: { label: 'title', idx: i } });
        });
      });
    }
  }

  /** 过滤列表的显示数据 */
  public filterListDisplayData = (listData: ListItemsType[]) => {
    listData.map((items) => {
      if (Array.isArray(items.itemData)) {
        items.itemData = items.itemData
          /** 过滤 value 为空的数据 */
          // .filter((item: any) => {
          //   return item.value !== '';
          // })
          /** 过滤 标签 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-tag';
          })
          /** 过滤 描述 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-desc';
          })
          /** 过滤 图片 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-image';
          })
          /** 过滤 文件 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-file';
          })
          /** 过滤 开关 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-toggle';
          })
          /** 强制更改 title 选择器 */
          .map((item: any, idx: number) => {
            if (idx === 0 && item.selector !== 'display-title') item.selector = 'display-title';
            return item;
          })
          /** 最多显示 */
          .filter((item: any, idx: number) => {
            return idx < 4;
          });
      }
    });
  }

  /**
* @description 子表添加
*/
  public add = (): void => {
    this.navCtrl.push(EditPage, {
      moduleName: this.moduleName,
      ...this.params,
      action: 'add',
    });
  }

  /**
   * @description 删除
   */
  public del = (itemId: string, idx: number, items: ListItemsType): void => {
    const confirm = this.msg.confirm('您确定要删除吗');
    confirm.onDidDismiss(res => {
      if (res) {
        this.listProvider.delItem(itemId, this.moduleName).subscribe(res => {
          if (res.status === 1) {
            // this.childData.listData = this.listProvider.delListData(this.childData.moduleName, itemId);
            this.childData.listData.splice(idx, 1);
          }
        });
      }
    });

  }


  /**
   * @description push 编辑页
   */
  public pushEditPage = (items: ListItemsType): void => {
    const id: string = items.id;
    const moduleName: string = items.Goto_Module || this.childData.moduleName;
    const showFieldsSet: Set<string> = items.showFieldsSet ? items.showFieldsSet : new Set();
    this.navCtrl.push(EditPage, { moduleName, id, showFieldsSet });
  }

}
