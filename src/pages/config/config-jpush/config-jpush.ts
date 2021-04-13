import { Component } from '@angular/core';
import { JpushService } from '../../../serves/native/jpush';


@Component({
  selector: 'page-config-jpush',
  templateUrl: 'config-jpush.html',
})
export class ConfigJpushPage {

  public registrationId: string = '';
  /** 内置开关 */
  public toggle: boolean = false;
  /** 系统开关 */
  public systemToggle: boolean = false;

  constructor(
    private _jpushService: JpushService,
  ) {
  }

  ionViewDidLoad() {
    this._getRegistrationID();
    this._getToggle();
  }

  /** 获取 registrationId */
  private _getRegistrationID() {
    this.registrationId = this._jpushService.getRegistrationID();
  }

  private _getToggle = async () => {
    this.toggle = this._jpushService.getToggle();
    this.systemToggle = await this._jpushService.getUserNotificationSettings();
  }



}
