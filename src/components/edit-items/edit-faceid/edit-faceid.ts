import { Component, Input } from '@angular/core';
import { EditCameraComponent } from "../edit-camera/edit-camera";
import { TpProvider } from "../../../providers/tp/tp";
import { AjaxService } from '../../../serves/ajax.service';
import { MsgService } from '../../../serves/msg.service';
import { Platform } from 'ionic-angular';
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { FormControl } from '@angular/forms';
import { EditProvider } from '../../../providers/edit/edit';


@Component({
  selector: 'edit-faceid',
  templateUrl: 'edit-faceid.html',
  // templateUrl: '../edit-camera/edit-camera.html',
})
export class EditFaceidComponent extends EditCameraComponent {

  /** 显示图片路径 */
  @Input('valueUrl') public valueUrl: string = '';

  /** 图片提交前必填字段 */
  @Input() public faceidArr: string[] = [];
  /** 必填的字段是否OK */
  public isRequiredFieldsOk: boolean = true;

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

  ngOnChanges() {
    if (Array.isArray(this.faceidArr)) {
      // this.formControl.setValue(' ');
      this.checkRequiredFieldsLision();
    }
  }

  /** 设置必填的字段 */
  public checkRequiredFieldsLision = (): boolean => {
    let result: boolean = true;
    for (let idx in this.faceidArr) {
      const key: string = this.faceidArr[idx];
      const fieldFormControl: FormControl = this.inputFormGroup.get(key) as FormControl;
      const value: any = fieldFormControl.value;
      if (fieldFormControl) {
        fieldFormControl.valueChanges.subscribe(() => {
          this.checkRequiredFields();
        });
      }
      /** 其他不为空，并且不验证自己 */
      if ((value === null || value === '') && this.inputFormControlName !== key) {
        result = false;
      }
    }
    this.isRequiredFieldsOk = result;
    return result;
  }

  public checkRequiredFields = (): boolean => {
    let result: boolean = true;
    for (let idx in this.faceidArr) {
      const key: string = this.faceidArr[idx];
      const fieldFormControl: FormControl = this.inputFormGroup.get(key) as FormControl;
      const value: any = fieldFormControl.value;
      if ((value === null || value === '') && this.inputFormControlName !== key) {
        result = false;
        break;
      }
    }
    this.isRequiredFieldsOk = result;
    return result;
  }

  public checkRequiredFieldsMitMsg = (): boolean => {
    let result: boolean = true;
    for (let idx in this.faceidArr) {
      const key: string = this.faceidArr[idx];
      const fieldFormControl: FormControl = this.inputFormGroup.get(key) as FormControl;
      const value: any = fieldFormControl.value;
      const itemData = this._editProvider.getMasterFieldData(key, this.editGroupData);
      if ((value === null || value === '') && this.inputFormControlName !== key) {
        result = false;
        this._msg.toast(`请填写${itemData.placeholder}, 在上传图片`);
        break;
      }
    }
    this.isRequiredFieldsOk = result;
    return result;
  }

  /**
   * @description 接收组件 app-image-upload 的输出数据
   * @memberof EditCameraComponent
   */
  public getAppImageUploadData = (imageData: { src: string, base64: string }): void => {
    if (this.checkRequiredFields()) {
      // this.uploadImageSrc = imageData.src;
      this.formControl.setValue(imageData.base64);
      this.setDataFromCard(imageData.base64);
    }
  }


  /**
   * @description 接收组件 native-camera base64
   * @memberof EditCameraComponent
   */
  public getNativeCameraData = (base64): void => {
    if (this.checkRequiredFields()) {
      // this.uploadImageSrc = base64;
      this.formControl.setValue(base64);
      this.setDataFromCard(base64);
    }
  }



  private setDataFromCard = (base64: string): void => {
    if (!this.checkRequiredFields()) {
      this.formControl.setValue('');
      return;
    }
    const fieldsData: any = {};
    for (let idx in this.faceidArr) {
      const key: string = this.faceidArr[idx];
      const fieldFormControl: FormControl = this.inputFormGroup.get(key) as FormControl;
      const value: any = fieldFormControl.value;
      fieldsData[key] = value;
    }

    const loader = this._msg.loading('数据分析中...');
    loader.present();

    /** 人脸识别 */
    this._ajax.loadData({
      method: 'post',
      title: '人脸识别接口',
      uri: 'do_faceid.php',
      params: {
        loginType: 2,
        xmlName: this.moduleName,
      },
      data: { fieldsData, },
    }).subscribe(res => {
      loader.dismiss();
      if (res.status === 1) {
        this.uploadImageSrc = res.payload.imgUrl;
        this.formControl.setValue(res.payload.imgName);
        /** 改变表单数据 */
        this._editProvider.setArrayDataToForm([{ key: 'faceid', value: res.payload.faceid }], this.inputFormGroup);
      } else {
        this.formControl.setValue('');
      }
    });
  }



}
