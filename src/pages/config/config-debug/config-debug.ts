import { Component } from '@angular/core';
import { AjaxService } from '../../../serves/ajax.service';
import { IonicStorageService } from '../../../serves/ionic-storage.service';
import { DebugService } from '../../../serves/debug.service';


@Component({
  selector: 'page-config-debug',
  templateUrl: 'config-debug.html',
})
export class ConfigDebugPage {

  public debugConfigs: Array<any> = [];

  public _response: any = {};

  constructor(
    private _ajax: AjaxService,
    private _ionicStorageService: IonicStorageService,
    private _debugService: DebugService,
  ) {
    this._getDebugConfigsData().subscribe(res => {
      this._response = res;
      this.debugConfigs = this._response.payload.debugConfigs;
    });

  }

  private _getDebugConfigsData = () => {
    return this._ajax.loadData({
      title: "获取debug数据",
      url: "assets/data/config.data.json",
      method: "get",
      isCachable: true,
      cacheKey: 'debugConfigs',
      testToken: false,
    });
  }

  public save = () => {
    setTimeout(async () => {
      const expires: number = +new Date() + 8640000000;
      const response = { ...this._response };
      await this._ionicStorageService.set('debugConfigs', { expires, response });
      await this._debugService.setDebugs();
    });
  }

}
