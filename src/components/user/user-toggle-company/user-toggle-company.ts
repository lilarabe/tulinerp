import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserTogglePage } from '../../../pages/user/user-toggle/user-toggle';
import { IonicStorageService } from '../../../serves/ionic-storage.service';


@Component({
  selector: 'user-toggle-company',
  templateUrl: 'user-toggle-company.html'
})
export class UserToggleCompanyComponent {

  /** 当前公司数据库ID */
  public SAAS_DB_AUTH: string = '';
  /** 当前公司名称 */
  public company: string = '';

  constructor(
    private _navCtrl: NavController,
    private _ionicStorageService: IonicStorageService,
  ) {
    this._ionicStorageService.get('SAAS_DB_AUTH').then(res=>{
      this.SAAS_DB_AUTH = res || '';
    });
    this._ionicStorageService.get('company').then(res=>{
      this.company = res || '';
    });
  }

  /** 切换到企业切换页面 */
  public pushTogglePage = (): void => {
    this._navCtrl.push(UserTogglePage);
  }
}
