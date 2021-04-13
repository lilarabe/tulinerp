
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ToolsProvider } from '../../serves/tools.service';
import { BrowserProvider } from '../../serves/native/browser';
import { TpProvider } from '../../providers/tp/tp';


@Injectable()
export class OpenBrowserProvider {

  private _isApp: boolean = this._platform.is("cordova");

  private _isBrowser: boolean = !this._platform.is("cordova");

  constructor(
    private _platform: Platform,
    private _browserProvider: BrowserProvider,
    private _tools: ToolsProvider,
    private _tp: TpProvider,
  ) {
  }

  /** 在浏览器中打开指定的网址 */
  public openBrowser = (webPath: string): void => {
    if (this._isBrowser) {
      // webPath = 'http://edemo.quanzhuyun.com/uploadfiles/qjjfwpt_dev/data/sdafasfdas.pdf';
      const isImage: boolean = this._tools.isImage(webPath);
      if(isImage){
        this._previewImage(webPath);
      } else {
        window.open(webPath);
      }
    } else if (this._isApp) {
      this._browserProvider.create(webPath);
    }

  }

  /** 图片预览 */
  private _previewImage = (webPath: string): void => {
    this._tp.openPreviewImageModal([{ src: webPath }], 0);
  }

}
