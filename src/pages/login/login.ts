import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, TextInput, ToastController, ViewController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { AjaxService } from '../../serves/ajax.service';
import { LoginProvider } from '../../providers/login/login';
import { MsgService } from '../../serves/msg.service';
import { JpushService } from '../../serves/native/jpush';
import { IonicStorageService } from '../../serves/ionic-storage.service';
import { WxService } from '../../serves/wx.service';
import { AppGlobalType } from '../../interface/global.interface';
import { ToolsProvider } from '../../serves/tools.service';
declare const app_global: AppGlobalType;

// @IonicPage({
//   name: 'login',
//   segment: 'login',
//   defaultHistory: ['home']
// })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  /** 高亮元素 */
  public highlight = new Map<string, boolean>([
    ['loginName', false],
    ['loginPassword', false],
  ]);

  /* 是否记住账户 */
  public isRememberMe: boolean = true;

  /* 密码是否可见 */
  public isPasswordVisibility: boolean = false;

  /** 默认logo */
  public logoSrc: string = app_global.logoUrl;
  // public logoSrc: string = 'assets/images/login/zs_logo.png';


  /** 登录 or 注册 */
  public loginType: string = 'login';

  /* 表单数据结构 */
  private fb = new FormBuilder();
  public loginForm: any = this.fb.group({
    name: ['', []],
    password: ['', [Validators.required]],
  });
  /** 注册表单数据 */
  public registerForm: any = this.fb.group({
    name: ['', []],
    password: ['', [Validators.required]],
    repassword: ['']
  });

  /** 用户名的 input 元素 */
  @ViewChild('loginName') loginNameInputRef: TextInput ;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ajax: AjaxService,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private loginProvider: LoginProvider,
    private msg: MsgService,
    private _jpushService: JpushService,
    private _ionicStorageService: IonicStorageService,
    private _wxService: WxService,
    private _tools: ToolsProvider,
  ) {

    // this._ionicStorageService.clear();

    // this._getAppInfo();
    this._ionicStorageService.get('isRememberMe').then((res: boolean) => {
      return this.isRememberMe = res === null ? this.isRememberMe : res;
    }).then((res: boolean) => {
      if (res) {
        this._setLoginUserInfo();
      }
    });

  }

  ionViewDidEnter() {}

  /* 提交登录信息 */
  public loginFormSubmit = async () => {
    const loader = this.msg.loading('登录中...请稍后');
    const afterFn = (res): void => {
      if (res.status === 1) {
        this.viewCtrl.dismiss();
      }
    };
    /*发送的数据*/
    const postData: any = {};
    if (this.loginForm.valid) {
      loader.present();
      postData.txtLoginName = this.loginForm.value.name;
      postData.txtLoginPwd = this.loginForm.value.password;
      postData.jpush_device_id = this._jpushService.getRegistrationID();

      /** url params */
      const urlParams: any = this._tools.urlToObj(window.location.href).query;
      /** site */
      const site: string = urlParams.site || '';
      const params: any = { LoginAction: 'Login', site };

      if (app_global.isWxWorkMobile) {
        params.qywxid = await this._ionicStorageService.get('wxUserid');
        if (this._wxService.wxUserid) params.qywxid = this._wxService.wxUserid;
      }

      this.ajax.loadData({
        uri: 'login.php',
        method: 'post',
        title: '登录请求',
        params,
        data: postData,
        afterFn: afterFn,
        testToken: false,
      }).subscribe(res => {
        if (res.status === 1) {
          this.loginProvider.login(res);
          if (this.isRememberMe) {
            this._ionicStorageService.set('login-username', postData.txtLoginName);
            this._ionicStorageService.set('login-password', postData.txtLoginPwd);
          }
        }
        loader.dismiss();
      });

      setTimeout(() => {
        loader.dismiss();
      }, 6000);
    }
  }

  /** 提交注册信息 */
  public registerFormSubmit = (): void => {
    const loader = this.msg.loading('登录中...请稍后');
    const afterFn = (res): void => {
      if (res.status === 1) {
        this.viewCtrl.dismiss();
      }
    };
    /*发送的数据*/
    const postData: any = {};
    if (this.registerForm.valid) {
      loader.present();
      postData.lg_username = this.registerForm.value.name;
      postData.lg_password = this.registerForm.value.password;
    }

    this.ajax.loadData({
      uri: 'register.php',
      method: 'get',
      title: '注册请求',
      params: postData,
      // data: postData,
      afterFn: afterFn,
      testToken: false,
    }).subscribe(res => {

      if (res.status === 1) {
        this.loginProvider.login(res);
      } else if (res.status === -2) {
        this.msg.toast(`用户已存在`);
      }
      loader.dismiss();
    });

    setTimeout(() => {
      loader.dismiss();
    }, 6000);
  }


  /** 显示隐藏密码 */
  public displayPassword = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    this.isPasswordVisibility = !this.isPasswordVisibility;
  }

  /** 记录登录信息 */
  public rememberMe = (): void => {
    this.isRememberMe = !this.isRememberMe;
    this._ionicStorageService.set('isRememberMe', this.isRememberMe);
  }

  /** 设置登录用户名密码 */
  private _setLoginUserInfo = async () => {
    const name: string = await this._ionicStorageService.get('login-username') || '';
    const password: string = await this._ionicStorageService.get('login-password') || '';
    const nameFormControl: FormControl = this.loginForm.get('name') as FormControl;
    const passwordFormControl: FormControl = this.loginForm.get('password') as FormControl;
    nameFormControl.setValue(name);
    passwordFormControl.setValue(password);
  }

}