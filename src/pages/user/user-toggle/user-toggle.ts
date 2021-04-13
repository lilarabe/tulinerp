import { Component } from '@angular/core';
import { ToggleCompanyProvider, ToggleCompany } from '../../../providers/toggle-company/toggle-company';
import { IonicStorageService } from '../../../serves/ionic-storage.service';
import { Events } from 'ionic-angular';

// @IonicPage({
//   name: 'user-toggle',
//   segment: 'user-toggle'
// })
@Component({
  selector: 'page-user-toggle',
  templateUrl: 'user-toggle.html',
})
export class UserTogglePage {

  /** 公司列表 */
  public companys: Array<ToggleCompany> = [];
  /** 当前公司ID */
  public currCompanyId: string = '';

  constructor(
    private _toggleCompanyProvider: ToggleCompanyProvider,
    private _ionicStorageService: IonicStorageService,
    private _events: Events,
  ) {
    this._companysInit();
  }

  /** 公司列表初始化 */
  private _companysInit = (): void => {
    this._ionicStorageService.get('SAAS_DB_AUTH').then(res => {
      this.currCompanyId = res;
    });
    this._toggleCompanyProvider.getCompanys().subscribe(res => {
      if (res.status === 1 && Array.isArray(res.payload.company)) {
        this.companys = res.payload.company;
      }
    });
  }

  /** 切换企业 */
  public toggleCompany = (company: ToggleCompany): void => {
    this._toggleCompanyProvider.toggleOtherCompany(company).then(()=>{
      this._companysInit();
      this._events.publish('gohome');
    });
  }

}
