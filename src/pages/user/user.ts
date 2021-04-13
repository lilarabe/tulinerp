import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AjaxService } from "../../serves/ajax.service";
import { MsgService } from '../../serves/msg.service';
import { LoginProvider } from '../../providers/login/login';
import { UserInfoPage } from './user-info/user-info';
import { UserInfo } from './user.interface';
import { ToggleCompanyProvider, ToggleCompany } from '../../providers/toggle-company/toggle-company';
// import { AppGlobalType } from '../../interface/global.interface';
import { UserSettingPage } from './user-setting/user-setting';
import { ToolsProvider } from '../../serves/tools.service';
// declare let app_global: AppGlobalType;


/**
 * @description 用户中心
 * @author da
 * @export
 * @class UserPage
 */
// @IonicPage({
//   name: 'user',
//   segment: 'user'
// })
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  /** 用户数据 */
  public userData: UserInfo = { avatar: '', name: '', role: '', email: '', gender: 'm', phone: '' };

  /** 其他公司列表 */
  public otherCompanys: Array<ToggleCompany> = [];

  /** url 参数 */
  public urlParams: any = {};

  /** url 参数:site */
  public site: string = '';

  constructor(
    private _navCtrl: NavController,
    private _ajax: AjaxService,
    private _msg: MsgService,
    private _loginProvider: LoginProvider,
    private _toggleCompanyProvider: ToggleCompanyProvider,
    private _tools: ToolsProvider,
  ) {
   this.urlParams = this._tools.urlToObj(window.location.href).query;
   this.site = this.urlParams.site || '';
  }

  ionViewDidLoad() {
    // this.getUserData();
    // this._getCompanys();
     /** url 参数 */
    this.urlParams = this._tools.urlToObj(window.location.href).query;
  }

  ionViewWillEnter(){
    this.getUserData();
    this._getCompanys();
  }


  /**
   * @description 获取用户数据
   * @private
   * @memberof UserPage
   */
  private getUserData = (): void => {
    this._ajax.loadData({
      method: "get",
      title: "获取用户数据",
      uri: "center.php",
      params: {
        format: "center",
      }
    }).subscribe((res) => {
      if (res.status === 1) {
        this.userData.name = res.payload.lg_username || '';
        this.userData.role = res.payload.lg_role || '';
        this.userData.phone = res.payload.phone || '';
        this.userData.email = res.payload.email || '';
        this.userData.gender = res.payload.gender || 'm';
        if (this.userData.gender === 'm') {
          this.userData.avatar = res.payload.avatar || 'assets/images/user/male.png';
        } else if (this.userData.gender === 'f') {
          this.userData.avatar = res.payload.avatar || 'assets/images/user/female.png';
        }

      }
    });
  }

  /** 用户信息页 */
  public pushUserInfo = (): void => {
    this._navCtrl.push(UserInfoPage, { userData: this.userData });
  }

  /** 用户设置 */
  public pushUserSetting = (): void => {
    this._navCtrl.push(UserSettingPage);
  }

  /** 登出 */
  public logout = (): void => {
    const confirm = this._msg.confirm(`您确定要退出吗`);
    confirm.onDidDismiss(res => {
      if (res) {
        this._ajax.loadData({
          title: '登出',
          uri: 'logout.php',
        }).subscribe();
        this._loginProvider.logout();
      }
    });

  }

  /** 获取其他公司列表 */
  private _getCompanys = (): void => {
    this.otherCompanys = [];
    this._toggleCompanyProvider.getCompanys().subscribe(res => {
      if (res.status === 1) {
        if (Array.isArray(res.payload.company)) {
          this.otherCompanys = res.payload.company || [];
        }
      }
    });
  }


}
