import { Component, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';


@Component({
  selector: '[native-camera]',
  templateUrl: 'native-camera.html',
  host: {
    '(tap)': 'presentActionSheet();',
  },
})
export class NativeCameraComponent {

  /** 选择图片的base64 */
  @Output() uploadImageBase64: EventEmitter<string> = new EventEmitter<string>();

  /** CameraOptions 相机设置的可选参数 */
  protected _cameraOptions: CameraOptions = {
    /** 图片质量 */
    quality: 90,
    /** 返回值的格式 */
    destinationType: this._camera.DestinationType.FILE_URI,
    /** 选择图像的返回编码 */
    encodingType: this._camera.EncodingType.JPEG,
    /** 选择media类型 */
    mediaType: this._camera.MediaType.PICTURE,
    /** 获取图片的来源 */
    sourceType: this._camera.PictureSourceType.CAMERA,
    /** 如果是横向拍摄的照片，会自动旋转到正确的方向 */
    correctOrientation: true,
    /** 宽度像素用来缩放图像 */
    targetWidth: 1000,
    /** 高度像素用来缩放图像 */
    targetHeight: 1000
  };

  /** 是否在app中 */
  protected isCordova: boolean = this._platform.is("cordova");

  constructor(
    protected _platform: Platform,
    protected _camera: Camera,
    protected _actionSheetCtrl: ActionSheetController
  ) {
  }


  /**
   * @description 选择图片ActionSheet
   * @memberof NativeCameraComponent
   */
  public presentActionSheet = (): void => {
    const actionSheet = this._actionSheetCtrl.create({
      title: '选择图片',
      buttons: [
        {
          text: '相机',
          handler: () => {
            this._cameraOptions.sourceType = this._camera.PictureSourceType.CAMERA;
            this._sendImageBase64();
          }
        }, {
          text: '相册',
          handler: () => {
            this._cameraOptions.sourceType = this._camera.PictureSourceType.PHOTOLIBRARY;
            this._sendImageBase64();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }



  /**
   * @description 发送图片base64
   * @protected
   * @memberof NativeCameraComponent
   */
  protected _sendImageBase64 = (): void => {
    if (this.isCordova) {
      this._cameraOptions.destinationType = this._camera.DestinationType.DATA_URL;
      this._camera.getPicture(this._cameraOptions).then((imageBase64) => {
        let base64Image: string = 'data:image/jpeg;base64,' + imageBase64;
        this.uploadImageBase64.emit(base64Image);
      }, (err) => {
        // alert(`发送图片base64错误:${err}`);
      });
    } else {
      alert(`发送图片base64错误:不在APP中`);
    }
  }
}
