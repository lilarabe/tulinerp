import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { AlertController, Alert } from 'ionic-angular';
import { SignPostDataType } from "../../../interface/components/sign.interface";
import { Observable } from 'rxjs';
import { AjaxService } from "../../../serves/ajax.service";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { StringCodeService } from '../../../serves/string-code.service';
import { MsgService } from '../../../serves/msg.service';
import { IonicStorageService } from '../../../serves/ionic-storage.service';


@Component({
  selector: 'edit-sign',
  templateUrl: 'edit-sign.html'
})
export class EditSignComponent extends EditItemComponent {

  private _signPostData: SignPostDataType = { username: "", password: "" };

  private _alert: Alert;

  constructor(
    private alertCtrl: AlertController,
    private ajax: AjaxService,
    protected validators: FormValidatorsService,
    private _ionicStorageService: IonicStorageService,
    private _stringCodeService: StringCodeService,
    private _msg: MsgService,
  ) {
    super(validators);

  }



  /**
   * @description 设置alert
   * @private
   * @memberof EditSignComponent
   */
  private _setAlertOptions = (): void => {
    this._alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
    });
    this._alert.setTitle('签名');
    // this._alert.addInput({
    //   name: 'username',
    //   value: this._signPostData.username,
    //   placeholder: '用户名',
    //   disabled: true,
    // });
    this._alert.addInput({
      name: 'password',
      placeholder: '请输入当前用户密码',
      type: 'password'
    });
    this._alert.addButton({
      text: '取消',
      role: 'cancel',
    });
    this._alert.addButton({
      text: '确定',
      handler: this._okHandler,
    });
  }



  /**
   * @description 弹出框
   * @memberof EditSignComponent
   */
  public presentAlert = async () => {
    if (this.readonly || this.disable) {
      return void 0;
    }
    const username: string = this._stringCodeService.decode(await this._ionicStorageService.get('username'));
    this._signPostData.username = username;

    this._setAlertOptions();

    this._alert.present();
  }




  /**
   * @description 点击确定
   * @private
   * @memberof EditSignComponent
   */
  private _okHandler = (data: any): boolean => {
    this._signPostData.password = data.password;
    this._postData().subscribe(res => {
      if (res.status === 1) {
        const signer: string = res.payload.name;
        this.formControl.setValue(signer);
        const msg: string = '签名成功';
        this._msg.toast(msg);
        this._alert.dismiss();
      } else if (res.status === 0) {
        const errorMsg: string = res.payload.errorMsg || '签名失败';
        this._msg.toast(errorMsg);
      }
    });
    return false;
  }


  /**
   * @description 提交签名数据
   * @private
   * @memberof EditSignComponent
   */
  private _postData = (): Observable<any> => {
    return this.ajax.loadData({
      title: '请求签名',
      uri: 'sign.php',
      method: "post",
      params: {
        SystemAction: 'DoSign',
      },
      data: {
        data: this._signPostData
      }
    });
  }

}
