import { Component, Input, OnChanges } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ListItemsType } from "../../interface/list.interface";
import { DetailChildrenDataType, DETAILCHILDDATA } from '../../interface/detail.interface';
import { AjaxService } from '../../serves/ajax.service';
import { AppGlobalType } from '../../interface/global.interface';
import { BrowserProvider } from '../../serves/native/browser';
import { EditPage } from '../../pages/edit/edit';
declare let app_global: AppGlobalType;

@Component({
  selector: 'detail-child',
  templateUrl: 'detail-child.html'
})
export class DetailChildComponent implements OnChanges {

  /** 传入的数据 */
  @Input() itemsData: DetailChildrenDataType = DETAILCHILDDATA;

  /** 主表名称 */
  @Input() moduleName: string = "";

  /** 主表ID */
  @Input() moduleId: string = "";

  /** 是否可编辑 */
  @Input() isEdit: boolean = true;

  /** 是否可新增 */
  @Input() isAdd: boolean = true;

  /** 是否展开 */
  @Input() public expanded: boolean = false;

  /** 点击动作 */
  @Input() public clickAction: string = '';

  /** 是否显示列表数据 */
  @Input() public isShowList: boolean = false;

  /** 默认显示列表数量 */
  public defaultShowCount: number = 3;

  /** 显示更多列表数量 */
  public showMoreCount: number = 0;

  /** 显示列表数据 */
  public showListData: ListItemsType[] = [];

  /** 新增页面页面 */
  private editPage = EditPage;

  /** 是否显示更多 */
  public isShowMoreOn: boolean = false;

  /** 是否显示收起 */
  public isShowMoreOff: boolean = false;


  constructor(
    private _navCtrl: NavController,
    private _ajax: AjaxService,
    private _platform: Platform,
    private _browserProvider: BrowserProvider,
  ) {
  }

  ngOnChanges(): void {
    if (this.expanded) {
      this.showMoreList();
    } else {
      this.hideMoreList();
    }
  }


  /**
   * @description 显示更多数据
   * @memberof DetailChildComponent
   */
  public showMoreList = (): void => {
    this.showMoreCount = 0;
    this.showListData = this.itemsData.listData;
    this.isShowMoreOn = false;
    this.isShowMoreOff = true;
  }


  /**
   * @description 收起更多数据
   * @memberof DetailChildComponent
   */
  public hideMoreList = (): void => {
    const len = this.itemsData.listData.length;
    if (len > this.defaultShowCount) {
      this.showMoreCount = len - this.defaultShowCount;
      this.showListData = this.itemsData.listData.slice(0, this.defaultShowCount);
      this.isShowMoreOn = true;
      this.isShowMoreOff = false;
    } else {
      this.showMoreCount = 0;
      this.showListData = this.itemsData.listData;
      this.isShowMoreOn = false;
      this.isShowMoreOff = false;
    }
  }


  /**
   * @description 子表添加
   * @memberof DetailChildComponent
   */
  public add = (): void => {
    this._navCtrl.push(this.editPage, {
      moduleName: this.moduleName,
      childModuleName: this.itemsData.moduleName,
      id: this.moduleId,
      showFieldsSet: this.itemsData.showFieldsSet,
      action: 'add',
    });
  }

  /** 开启 excel */
  public openExcel = async () => {
    /** 主表ID */
    const mainId: string = this.moduleId;
    /** 主表名称 */
    const mainTable: string = this.moduleName;
    /** 子表名称 */
    const subTableName: string = this.itemsData.moduleName;
    /** excel 文件名 */
    const excelFileName: string = await this._getExcelFileName(mainId, mainTable, subTableName);
    // const excelFileName: string = '7e1184c41a17bb90513770455146a9de77d002a3.xls';
    /** 文件路径 */
    const fileBaseUrl: string = app_global.fileBaseUrl;
    const officeUrl: string = "https://view.officeapps.live.com/op/view.aspx";
    const encodeUrl: string = encodeURIComponent(`${fileBaseUrl}${excelFileName}`);
    /** 打开excel路径 */
    const openExcelUrl: string = `${officeUrl}?src=${encodeUrl}`;
    this._openExcelWidthCordova(openExcelUrl);
  }

  /** 获取Excel文件的文件名 */
  private _getExcelFileName = (mainId: string, mainTable: string, subTableName: string): Promise<string> => {
    return new Promise((resolve) => {
      this._ajax.loadData({
        title: '获取Excel文件的url地址',
        method: 'get',
        // url: 'assets/data/excel.data.json',
        uri: "detail_data.php",
        params: { ActionID: mainId, Type: mainTable, subTableName },
        debug: true,
      }).subscribe(res => {
        if (res.status === 1 && res.payload.filename) {
          resolve(res.payload.filename);
        }
      });
    });
  }

  /** cordova 开启 excel */
  private _openExcelWidthCordova = (excelUrl: string) => {
    if (this._platform.is('cordova')) {
      this._browserProvider.create(excelUrl);
    } else {
      window.open(excelUrl);
    }
  }

}
