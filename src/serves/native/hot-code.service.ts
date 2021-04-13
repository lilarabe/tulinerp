import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { MsgService } from '../msg.service';
import { HotCodePush, HotCodePushRequestOptions, HotCodePushUpdate, HotCodePushVersion } from '@ionic-native/hot-code-push';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LoadingController } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';
import { FileProvider } from './file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppGlobalType } from "../../interface/global.interface";
import { AjaxService } from '../../serves/ajax.service';
import { ChcpType } from '../../interface/chcp.interface';

declare const app_global: AppGlobalType;



@Injectable()
export class HotCodeService {

  /**
   * 是否debug?
   */
  private isDebug: boolean = false;

  /* 热更新版本号 */
  public release: string = '';
  /**
 * 是否在APP中
 */
  private isApp: boolean = this.platform.is('cordova');
  /**
   * 是否在android中
   */
  private isAndroid: boolean = this.isApp && this.platform.is('android');
  /**
   * 是否在ios中
   */
  private isIos: boolean = this.isApp && this.platform.is('ios');

  constructor(
    private msg: MsgService,
    private hotCodePush: HotCodePush,
    private platform: Platform,
    private transfer: FileTransfer,
    private loadingCtrl: LoadingController,
    private fileOpener: FileOpener,
    private fileProvider: FileProvider,
    private inAppBrowser: InAppBrowser,
    private _ajax: AjaxService,
  ) {
  }

  /** 获取本的本地chcp版本号 */
  public getLocalRelease = (): Promise<string> => {
    return new Promise((resolve) => {
      this._ajax.load({
        title: '获取 chcp.json 数据',
        method: 'get',
        url: 'chcp.json',
      }).subscribe((res: ChcpType) => {
        const localRelease: string = res.release || '';
        if (localRelease) {
          resolve(localRelease);
        }
      });
    });
  }

  /** 获取服务器的chcp版本号 */
  public getServeRelease = (): Promise<string> => {
    return new Promise(async (resolve) => {
      if (this.isApp) {
        const hotCodePushVersion: HotCodePushVersion = await this.hotCodePush.getVersionInfo();
        const serveRelease: string = hotCodePushVersion.currentWebVersion || '';
        if (serveRelease) {
          resolve(serveRelease);
        }
      }
    });
  }

  /**
   * @description 热更新
   * 
   * @private
   * @memberof MyApp
   */
  public hotCodeUpdate = async (method = "force") => {
    if (this.isApp) {
      /* 下载数据 */
      try {
        const options: HotCodePushRequestOptions = {
          'config-file': 'https://edemo.quanzhuyun.com/uploadfiles/hotcode/cn_tulin_erp/android/chcp.json'
        };
        const result = await this.hotCodePush.fetchUpdate(options);
        this.showMsg(`热更新config-file: ${JSON.stringify(result)}`);
      }
      catch (e) {
        this.showMsg(`热更新失败信息: ${JSON.stringify(e)}`);
        if (e && +e.code === -2) {
          /** app版本 < serve版本 app更新 */
          if (this.isAndroid) {
            this.androidUpdate();
          } else if (this.isIos) {
            this.iosUpdate();
          }
        }
      }
      /* 验证是否可以安装新的版本 热更新 */
      try {
        const updateInfo: HotCodePushUpdate = await this.hotCodePush.isUpdateAvailableForInstallation();
        this.showMsg(`热更新信息: ${JSON.stringify(updateInfo)}`);
        const currentVersion: number = +(updateInfo.currentVersion.replace(/[\.|\-]+/g, ''));
        const readyToInstallVersion: number = +(updateInfo.readyToInstallVersion.replace(/[\.|\-]+/g, ''));
        if (+currentVersion < +readyToInstallVersion) {
          switch (method) {
            case 'force':
              await this.forceUpdate();
              break
            case 'select':
              await this.selectUpdate();
              break
            default:
              await this.forceUpdate();
              break;
          }
        }
      }
      catch (e) {
        this.showMsg(`验证热跟新是否可以安装新的版本错误信息: ${JSON.stringify(e)}`);
      }
    }
  }

  /**
   * @description 选择更新
   * 
   * @private
   * @memberof MyApp
   */
  public selectUpdate = async (): Promise<any> => {
    const confirm = this.msg.confirm('发现新版本，是否立即更新?');
    confirm.onDidDismiss(async (isUpdate: boolean) => {
      if (isUpdate) {
        this.msg.showLoader('数据更新中...');
        try {
          await this.hotCodePush.fetchUpdate();
          await this.hotCodePush.installUpdate();
        } catch{
        }
        this.msg.hideLoader();
      }
    });
  }

  /**
   * @description 强制更新
   * 
   * @private
   * @memberof MyApp
   */
  private forceUpdate = async (): Promise<any> => {
    this.msg.showLoader('数据更新中...预计2分钟完成');
    await this.hotCodePush.fetchUpdate();
    await this.hotCodePush.installUpdate();
    this.msg.hideLoader();
  }

  /**
   * @description android app update
   * @private
   * @memberof HotCodeService
   */
  private androidUpdate = (): void => {
    this.fileProvider.creatExternalTempDir().then((tempPath: string) => {
      this.showMsg(`临时文件夹的地址:${tempPath}`);
      const fileTransfer: FileTransferObject = this.transfer.create();
      const confirm = this.msg.confirm('发现新版本，是否立即更新?');
      const appName: string = `app.apk`;
      setTimeout(() => {
        confirm.onDidDismiss(res => {
          if (res) {
            const loader = this.loadingCtrl.create({ content: `已下载0%` });
            loader.present();
            const url = app_global.androidApkUrl;
            fileTransfer.download(url, `${tempPath}${appName}`).then(
              (entry) => {
                this.showMsg(`download complete 存放地址: ${entry.toURL()}`);
                loader.dismiss();
                /** 打开 apk */
                const filePath: string = entry.toURL();
                const fileMIMEType: string = `application/vnd.android.package-archive`;
                this.fileOpener.open(filePath, fileMIMEType).then(
                  (success: any) => {
                    this.showMsg(`open apk success: ${JSON.stringify(success)}}`);
                  },
                  (error) => {
                    this.showMsg(`open apk error: ${JSON.stringify(error)}`);
                  }
                );
              },
              (error) => {
                this.showMsg(`download error: ${JSON.stringify(error)}`);
                loader.dismiss();
              }
            );
            fileTransfer.onProgress((progressEvent: ProgressEvent) => {
              if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                var msg = perc + "%";
                loader.setContent(`已下载${msg}`);
              } else {
                loader.setContent(`已下载100%`);
              }
            });
          }
        });
      }, 1000);
    });
  }

  /**
   * @description ios app update
   * @private
   * @memberof HotCodeService
   */
  private iosUpdate = (): void => {
    const confirm = this.msg.confirm('发现新版本，是否立即更新?');
    const url = app_global.iosBrowserUrl;
    confirm.onDidDismiss(res => {
      if (res) {
        this.inAppBrowser.create(url, '_system');
      }
    });
  }

  /**
 * @description 显示信息
 * @private
 * @memberof FileProvider
 */
  private showMsg = (msg: any): void => {
    if (this.isDebug) {
      alert(JSON.stringify(msg));
    }
  }


  public setDebug = (toggle: boolean): void => {
    this.isDebug = toggle;
  }

}
