import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { FormValidatorsService } from "../../../serves/form-validators.service";
import { AjaxService } from "../../../serves/ajax.service";
import { MsgService } from "../../../serves/msg.service";


// @IonicPage()
@Component({
  selector: 'page-user-password',
  templateUrl: 'user-password.html',
})
export class UserPasswordPage {

  /*修改密码表单*/
  public editPasswordForm: FormGroup;

  /** 提交数据 */
  private postPasswordData: any = {};

  /** 提示 */
  public tips: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private formValid: FormValidatorsService,
    private ajax: AjaxService,
    private msg: MsgService,
  ) {
    this.setEditPasswordForm();
  }

  ionViewDidLoad() {
    this._getPasswordRuls();
  }

  /**
   * @description 设置编辑密码表单
   * @private
   * @memberof UserPage
   */
  private setEditPasswordForm = (): void => {
    this.editPasswordForm = this.fb.group({
      currPassword: new FormControl('', [this.formValid.required]),
      passwordInfo: this.fb.group({
        password: ['', [this.formValid.required]],
        passwordConfirm: [''],
      }, { validator: this.formValid.passwordEqual }),
    });
  }
  /**
   * 密码
   */
  private _getPasswordRuls = () => {
    this.ajax.loadData({
      method: "get",
      title: "修改密码",
      uri: "password_rules.php",
    }).subscribe((res) => {
      if (res.status === 1) {
        this.tips = res.payload.placeholderTips.tips;
      }
      console.log(res);
    });
  }

    /**
   * @description 修改密码
   * @memberof UserPage
   */
  public editPassword = (): void => {
    if (this.editPasswordForm.valid) {
      this.postPasswordData.format = "update";
      this.postPasswordData.password = this.editPasswordForm.get('currPassword').value;
      this.postPasswordData.newpassword = this.editPasswordForm.get('passwordInfo').get('password').value;
      this.ajax.loadData({
        method: "get",
        title: "修改密码",
        uri: "center.php",
        params: this.postPasswordData,
      }).subscribe((res) => {
        if (res.status === 1) {
          // 密码修改成功
          this.msg.toast(`密码修改成功`);
          this.editPasswordForm.reset();
        } else {
          // 密码修改失败
          this.msg.toast(`密码修改失败`);
        }
      });
    }
  }

}
