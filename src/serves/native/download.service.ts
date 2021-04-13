import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ToolsProvider } from "../tools.service";
import { MsgService } from '../msg.service';
// import { PhotoLibraryService } from './photoLibrary.service';


@Injectable()
export class DownloadService {

    /** 是否在App中 */
    private _isApp:boolean = false;

    constructor(
        private _platform: Platform,
        private _msg: MsgService,
        private _tools: ToolsProvider,
        // private _photoLibraryService:PhotoLibraryService,
    ) {
        this._isApp = this._platform.is('cordova');
    }

    /**
     * @description 浏览器下载。不可跨域,微信无效
     * @private
     * @memberof DownloadService
     */
    private _browserDownload = (filePath: string, filename: string = ''): void => {
        /* 在微信浏览器提示无法下载 */
        if (this._tools.isWxBrowser()) {
            this._msg.toast(`在微信中无法下载，请使用浏览器下载。`);
            return void 0;
        }
        let eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        eleLink.href = filePath;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }

    /**
     * @description 下载图片到相册
     * @memberof DownloadService
     */
    public downloadImageToAlbum = async (imagePath: string):Promise<any> => {
        if(this._isApp){
            // await this._photoLibraryService.saveImage(imagePath);
        } else {
            this._browserDownload(imagePath);
        }
    }
}