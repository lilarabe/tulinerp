import { Component, Input } from '@angular/core';
import { TpProvider } from "../../providers/tp/tp";
import { CanvasBase64Service } from "../../serves/canvas-base64.service";
import { Platform } from 'ionic-angular';
import { MsgService } from "../../serves/msg.service";
import { AjaxService, ResponseDataType } from "../../serves/ajax.service";
import { Observable } from 'rxjs';



@Component({
  selector: 'detail-pictures',
  templateUrl: 'detail-pictures.html',
  host: {},
})
export class DetailPicturesComponent {

  public isCordova: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");


  /** 传入的数据 */
  @Input() itemsData: ItemsDataType;

  /** 是否可编辑 */
  @Input() isEdit: boolean = true;

  /** 是否显示 */
  @Input() isShow: boolean = true;

  /** 图片显示最大数量 */
  public max: number = 9;

  constructor(
    protected _tp: TpProvider,
    protected _canvasBase64Service: CanvasBase64Service,
    protected _platform: Platform,
    protected _msg: MsgService,
    protected _ajax: AjaxService,
  ) {
  }

  ngOnChanges() {
    this.max = this.itemsData.max ? this.itemsData.max : this.max;
    const len: number = this.itemsData.listData.length;
    if (len > this.max) {
      this.itemsData.listData = this.itemsData.listData.slice(0, this.max);
    }
  }



  /**
   * @description 从组件中获取 base64 新增
   * @memberof DetailPicturesComponent
   */
  public getBase64FromComponent = (base64: string): void => {
    const params: any = { moduleName: this.itemsData.moduleName, parentId: this.itemsData.parentId };
    const postData: any = { base64: base64 };
    this._msg.showLoader('数据提交中，请稍后...');
    this._addAction(params, postData).subscribe(res => {
      this._msg.hideLoader();
      if (res.status === 1) {
        const newImageData: any = { id: res.payload.id, src: res.payload.src };
        this.itemsData.listData.push(newImageData);
      } else {
        this._msg.toast(`新增失败`);
      }
    });
  }

  /**
   * @description 图片预览
   * @memberof DetailPicturesComponent
   */
  public previewImage = (idx: number): void => {
    this._tp.openPreviewImageModal(this.itemsData.listData, idx, { showMenu: true, showDownload: true });
  }



  /**
   * @description 图片删除
   * @memberof DetailPicturesComponent
   */
  public imageDel = (id, idx): void => {
    const confirm = this._msg.confirm('您确定要删除吗?');
    confirm.onDidDismiss(isOK => {
      if (isOK) {
        const params: any = { tableName: this.itemsData.moduleName, itemId: id, action: "delChildItem" };
        this._delAction(params).subscribe(res => {
          if (res.status === 1) {
            this.itemsData.listData.splice(idx, 1);
          } else {
            this._msg.toast(`删除失败`);
          }
        });
      }
    });
  }



  /**
   * @description 新增图片请求
   * @protected
   * @memberof DetailPicturesComponent
   */
  protected _addAction = (params: any, postData: any): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      title: "新增图片请求",
      method: "post",
      // url: 'assets/data/test.data.json',
      uri: "file_save.php",
      params: params,
      data: postData,
      timeout: 30000,
    });
  }



  /**
   * @description 输出图片请求
   * @protected
   * @memberof DetailPicturesComponent
   */
  protected _delAction = (params): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      title: "新增图片请求",
      method: "get",
      // url: 'assets/data/test.data.json',
      uri: "delete.php",
      params: params,
    });
  }

}


interface ItemsDataType {
  max: number;
  displayStyle: string;
  moduleName: string;
  parentId: string;
  name: string;
  listData: Array<{ id: string, src: string }>;
}