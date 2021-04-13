import { Injectable } from '@angular/core';
// import { Platform } from 'ionic-angular';
// import { PhotoLibrary, LibraryItem } from '@ionic-native/photo-library';
// import { ToolsProvider } from "../tools.service";
// import { MsgService } from '../msg.service';


@Injectable()
export class PhotoLibraryService {

    // private _debug: boolean = false;

    constructor(
        // private _platform: Platform,
        // private _photoLibrary: PhotoLibrary,
        // private _msg: MsgService,
        // private _tools: ToolsProvider,
    ) {
    }

    /**
     * @description 授权
     * @private
     * @memberof PhotoLibraryService
     */
    // private _auth = (): Promise<void> => {
    //     return new Promise((resolve, reject) => {
    //         this._platform.ready().then(() => {
    //             this._photoLibrary.requestAuthorization({ read: true, write: true })
    //                 .then((res) => {
    //                     this._tools.printDebugMsg(`授权成功:`, this._debug);
    //                     this._tools.printDebugMsg(res, this._debug);
    //                     resolve();
    //                 })
    //                 .catch((error) => {
    //                     this._msg.toast('没有授权，无法保存');
    //                     this._tools.printDebugMsg(`授权失败:`, this._debug);
    //                     this._tools.printDebugMsg(error, this._debug);
    //                     reject();
    //                 });
    //         });
    //     });
    // }




    /**
     * @description 文件路径格式化
     * @private
     * @memberof PhotoLibraryService
     */
    // private _formatFilePath = (filePath: string): string => {
    //     /* 去掉参数 */
    //     filePath = filePath.replace(/\?[\d|\D]*/i, () => {
    //         return ``;
    //     });
    //     return filePath;
    // }


    /**
     * @description 保存图片
     * @memberof PhotoLibraryService
     */
    // public saveImage = (imagePath: string): Promise<any> => {
    //     return new Promise((resolve, reject) => {
    //         this._auth().then(() => {
    //             imagePath = this._formatFilePath(imagePath);
    //             this._tools.printDebugMsg(`图片路径:`, this._debug);
    //             this._tools.printDebugMsg(imagePath, this._debug);
    //             this._photoLibrary.saveImage(imagePath, 'tulinerp')
    //                 .then((libraryItem: LibraryItem) => {
    //                     this._msg.toast('保存成功，请在相册中查看');
    //                     this._tools.printDebugMsg(`保存成功:`, this._debug);
    //                     this._tools.printDebugMsg(libraryItem, this._debug);
    //                     resolve(libraryItem);
    //                 })
    //                 .catch((error) => {
    //                     this._msg.toast('保存到相册失败');
    //                     this._tools.printDebugMsg(`保存失败:`, this._debug);
    //                     this._tools.printDebugMsg(error, this._debug);
    //                     reject(error);
    //                 });
    //         });
    //     });
    // }
}