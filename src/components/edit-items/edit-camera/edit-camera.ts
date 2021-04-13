import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { TpProvider } from "../../../providers/tp/tp";
import { Platform } from 'ionic-angular';
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-camera',
  templateUrl: 'edit-camera.html'
})
export class EditCameraComponent extends EditItemComponent {
  /** 显示图片路径 */
  @Input('valueUrl') public valueUrl: string = '';

  public isCordova: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");

  /*上传的图片*/
  public uploadImageSrc: string = '';

  constructor(
    protected _tp: TpProvider,
    protected _platform: Platform,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.uploadImageSrc = this.valueUrl;
  }

  ngOnChanges() {
  }



  /**
   * @description 接收组件 app-image-upload 的输出数据
   * @memberof EditCameraComponent
   */
  public getAppImageUploadData = (imageData:{src:string, base64:string}):void => {
    this.uploadImageSrc = imageData.src;
    this.formControl.setValue(imageData.base64);
    this.formControl.markAsDirty();
  }


  /**
   * @description 接收组件 native-camera base64
   * @memberof EditCameraComponent
   */
  public getNativeCameraData = (base64): void => {
    this.uploadImageSrc = base64;
    this.formControl.setValue(base64);
    this.formControl.markAsDirty();
  }


  /**
   * @description 删除图片
   * @memberof EditCameraComponent
   */
  public del = (): void => {
    this.uploadImageSrc = '';
    this.formControl.setValue('');
  }


  /**
   * @description 图片预览
   * @memberof EditCameraComponent
   */
  public previewImage = (): void => {
    this._tp.openPreviewImageModal([{ src: this.uploadImageSrc }], 0);
  }

}
