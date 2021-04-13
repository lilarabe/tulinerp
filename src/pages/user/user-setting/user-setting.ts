import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UserPasswordPage } from '../user-password/user-password';
import { HotCodeService } from '../../../serves/native/hot-code.service';
import { MsgService } from '../../../serves/msg.service';
import { AppGlobalType } from '../../../interface/global.interface';
declare const app_global: AppGlobalType;

// @IonicPage()
@Component({
  selector: 'page-user-setting',
  templateUrl: 'user-setting.html',
})
export class UserSettingPage {

  /** 是否在APP中 */
  public isApp: boolean = this._platform.is('cordova');

  /** 本地热更新 版本 */
  public localRelease: string = '';
  /** 服务器热更新 版本 */
  public serveRelease: string = '';

  /** 是否在企业微信手机端 */
  public isWxWorkMobile: boolean = app_global.isWxWorkMobile;

  public userAgent: string = navigator.userAgent.toLowerCase();

  constructor(
    private _navCtrl: NavController,
    private _platform: Platform,
    private _hotCodeService: HotCodeService,
    private _msg: MsgService,
  ) {
    this.userAgent = navigator.userAgent.toLowerCase();
  }

  async ionViewDidLoad() {
    if (this.isApp) {
      this.localRelease = await this._hotCodeService.getLocalRelease();
      this.serveRelease = await this._hotCodeService.getServeRelease();
    }
  }

  /** 修改密码页 */
  public pushPasswordPage = (): void => {
    this._navCtrl.push(UserPasswordPage);
  }

  /** 强制热更新 */
  public hardHotCode = (): void => {
    if (this.isApp) {
      if (+(this.localRelease.replace(/[\.|\-]+/g, '')) < +(this.serveRelease.replace(/[\.|\-]+/g, ''))) {

      } else {
        // this._msg.alert(`当前为最新版本,无法更新.`);
      }
      this._hotCodeService.hotCodeUpdate();
    } else {
      this._msg.alert(`浏览器端无法热更新`);
    }
  }

}
