import { Component } from '@angular/core';
import { AlertController, NavParams } from 'ionic-angular';
import { UserInfo } from '../user.interface';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AjaxService } from '../../../serves/ajax.service';
import { MsgService } from '../../../serves/msg.service';
import { Platform } from 'ionic-angular';


// @IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {

  /** 用户数据 */
  public userData: UserInfo = { avatar: '', name: '', role: '', email: '', gender: 'm', phone: '' };
  /** 用户信息表单 */
  public userForm: FormGroup;

  public isCordova: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");

  constructor(
    private _alertCtrl: AlertController,
    private _navParams: NavParams,
    private _fb: FormBuilder,
    private _ajax: AjaxService,
    private _msg: MsgService,
    private _platform: Platform,
  ) {
    this.userData = this._navParams.get('userData') || {};
    this.userForm = this._fb.group({
      avatar: this._fb.control(this.userData.avatar),
      name: this._fb.control(this.userData.name),
      email: this._fb.control(this.userData.email),
      gender: this._fb.control(this.userData.gender),
      phone: this._fb.control(this.userData.phone),
    });
  }

  ionViewDidLoad() {
  }

  /** 性别选择 */
  public selectGender = (): void => {
    const alert = this._alertCtrl.create();
    const gender = this.userForm.get('gender').value;
    alert.setTitle('请选择您的性别');
    alert.addInput({
      type: 'radio',
      label: '男',
      value: 'm',
      checked: gender === 'm'
    });
    alert.addInput({
      type: 'radio',
      label: '女',
      value: 'f',
      checked: gender === 'f'
    });
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.userForm.get('gender').setValue(data);
      }
    });
    alert.present();
  }

  /** 浏览器获取图片base64 */
  public getAppImageUploadData = (imageData: { src: string, base64: string }): void => {
    const formControl: FormControl = this._fb.control(imageData.base64);
    this.userForm.setControl('avatar', formControl);
  }
  /** app获取图片base64 */
  public getNativeCameraData = (base64: string): void => {
    const formControl: FormControl = this._fb.control(base64);
    this.userForm.setControl('avatar', formControl);
  }

  /** 保存 */
  public save = (): void => {
    const value = this.userForm.value;
    const postData = {
      avatar: value.avatar,
      email: value.email,
      gender: value.gender,
      phone: value.phone,
      lg_username: value.name,
    };
    this._ajax.loadData({
      title: '用户信息提交',
      method: 'post',
      uri: "center.php",
      params: {
        format: "user_info",
      },
      data: { ...postData },
    }).subscribe((res) => {
      if (res.status === 1) {
        this._msg.toast('保存成功');
      } else {
        this._msg.toast('保存失败');
      }
    });
  }

}
