import { Injectable } from '@angular/core';
import { AjaxService, ResponseDataType } from '../../serves/ajax.service';
import { Observable } from 'rxjs/Observable';
import { IonicStorageService } from '../../serves/ionic-storage.service';
import { MsgService } from '../../serves/msg.service';
import { JpushService } from '../../serves/native/jpush';
import { Events } from 'ionic-angular';


@Injectable()
export class ToggleCompanyProvider {

  /** 当前公司ID */
  private _currCompanyId: string = '';

  constructor(
    private _ajax: AjaxService,
    private _ionicStorageService: IonicStorageService,
    private _msg: MsgService,
    private _jpushService: JpushService,
    protected _events: Events,
  ) {
  }

  /** 获取当前公司ID */
  public getCurrCompanyId = async () => {
    await this._ionicStorageService.get('SAAS_DB_AUTH').then(res => {
      this._currCompanyId = res;
    });
    return this._currCompanyId;
  }

  /** 切换到其他企业 */
  public toggleOtherCompany = (company: ToggleCompany): Promise<any> => {
    return new Promise((resolve) => {
      if (company.SAAS_DB_AUTH !== this._currCompanyId) {
        const confirm = this._msg.confirm(`您确定要切换到${company.name}查看吗?`);
        confirm.onDidDismiss(res => {
          if (res) {
            this.toggleCompany(company.SAAS_DB_AUTH).subscribe(res => {
              if (res.status === 1) {
                this._ionicStorageService.set('Now_SAAS_DB_AUTH', company.SAAS_DB_AUTH);
                this._ionicStorageService.set('username', res.payload.username);
                this._ionicStorageService.set('SAAS_DB_AUTH', res.payload.SAAS_DB_AUTH);
                this._ionicStorageService.set('company', res.payload.company);
                this._ionicStorageService.set('token', res.payload.token);
                this._msg.toast('切换成功');
                this._events.publish('approvalUpdata');
                resolve();
              }
            });
          }
        });
      }
    });
  }


  /** 切换企业 */
  public toggleCompany = (NEW_SAAS_DB_AUTH: string): Observable<ResponseDataType> => {
    const jpush_device_id: string = this._jpushService.getRegistrationID();
    return this._ajax.loadData({
      title: '切换企业',
      method: 'get',
      params: { format: 'switch_company', NEW_SAAS_DB_AUTH, jpush_device_id },
      uri: 'center.php',
    });
  }

  /** 获取企业列表数据 */
  public getCompanys = (): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      title: '获取企业列表数据',
      method: 'get',
      params: { format: 'my_company' },
      uri: 'center.php',
    });
  }

}

export interface ToggleCompany {
  /** 角标 */
  todo_num: number | string;
  /** 公司数据库ID */
  SAAS_DB_AUTH: string;
  /** 公司数据库ID */
  Now_SAAS_DB_AUTH: string;
  /** 公司名称 */
  name: string;
}
