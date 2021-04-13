import { Component } from '@angular/core';
import { EditCameraComponent } from "../edit-camera/edit-camera";
import { TpProvider } from "../../../providers/tp/tp";
import { AjaxService } from '../../../serves/ajax.service';
import { MsgService } from '../../../serves/msg.service';
import { Platform } from 'ionic-angular';
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { EditProvider } from '../../../providers/edit/edit';


@Component({
  selector: 'edit-card',
  templateUrl: '../edit-camera/edit-camera.html',
})
export class EditCardComponent extends EditCameraComponent {


  constructor(
    protected _tp: TpProvider,
    protected _platform: Platform,
    protected _ajax: AjaxService,
    protected _msg: MsgService,
    protected validators: FormValidatorsService,
    private _editProvider: EditProvider,
  ) {
    super(_tp, _platform, validators);
  }


  /**
   * @description 接收组件 app-image-upload 的输出数据
   * @memberof EditCameraComponent
   */
  public getAppImageUploadData = (imageData: { src: string, base64: string }): void => {
    this.uploadImageSrc = imageData.src;
    this.formControl.setValue(imageData.base64);
    this.setDataFromCard(imageData.base64);
  }


  /**
   * @description 接收组件 native-camera base64
   * @memberof EditCameraComponent
   */
  public getNativeCameraData = (base64): void => {
    this.uploadImageSrc = base64;
    this.formControl.setValue(base64);
    this.setDataFromCard(base64);
  }


  /**
   * @description 获取名片数据改变表单数据
   * @memberof EditCameraComponent
   */
  private setDataFromCard = (base64: string): void => {

    const loader = this._msg.loading('数据分析中...');
    loader.present();

    /** 名片识别 */
    this._ajax.loadData({
      method: 'post',
      title: '名片识别接口',
      uri: 'card_scan.php',
      params:{
        moduleName: this.moduleName,
      },
      data: {
        "base64": base64,
        "field": this.inputFormControlName,
      }
    }).subscribe(res => {
      loader.dismiss();
      /** 改变表单数据 */
      this._editProvider.setArrayDataToForm(res.payload.selectData, this.inputFormGroup);
    });
  }

}
