import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AjaxService } from '../../../serves/ajax.service';
import { ToolsProvider } from '../../../serves/tools.service';
import { AppGlobalType } from 'interface/global.interface';
import { HotCodeService } from '../../../serves/native/hot-code.service';
declare let app_global: AppGlobalType;

@Component({
  selector: 'page-config-hotcode',
  templateUrl: 'config-hotcode.html',
})
export class ConfigHotcodePage {

  /** 是否在APP中 */
  public isApp: boolean = this._platform.is('cordova');
  /** 是否在android中 */
  private isAndroid: boolean = this.isApp && this._platform.is('android');
  /** 是否在ios中 */
  private isIos: boolean = this.isApp && this._platform.is('ios');

  /** 本地chcp.json 数据 */
  public localChcpData: Array<any> = [];
  /** 服务器chcp.json 数据 */
  public serveChcpData: Array<any> = [];

  constructor(
    private _ajax: AjaxService,
    private _tools: ToolsProvider,
    private _platform: Platform,
    private _hotCodeService: HotCodeService,
  ) {
  }

  ionViewDidLoad() {
    this._getLocalCHCPInfo().subscribe(res => {
      this.localChcpData = this._tools.objectToArray(res);
    });
    if (this.isApp) {
      this._getServeCHCPInfo().subscribe(res => {
        this.serveChcpData = this._tools.objectToArray(res);
      });
    }
  }

  private _getLocalCHCPInfo = () => {
    return this._ajax.load({
      title: '获取 chcp.json 数据',
      method: 'get',
      url: 'chcp.json',
    });
  }

  private _getServeCHCPInfo = () => {
    let url: string = "";
    if (this.isAndroid) {
      url = `${app_global.androidHotCodePath}/chcp.json`;
    } else if (this.isIos) {
      url = `${app_global.iosHotCodePath}/chcp.json`;
    }
    return this._ajax.load({
      title: '获取 chcp.json 数据',
      method: 'get',
      url: url,
    });
  }

  public hardHotCode = (): void => {
    this._hotCodeService.hotCodeUpdate();
  }


}
