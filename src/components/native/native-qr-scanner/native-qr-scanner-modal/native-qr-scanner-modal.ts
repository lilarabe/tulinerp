import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Platform, Events, ViewController, NavController } from 'ionic-angular';
import { MsgService } from '../../../../serves/msg.service';
import { BrowserProvider } from '../../../../serves/native/browser';
import { DetailPage } from '../../../../pages/detail/detail';
import { DetailProvider } from '../../../../providers/detail/detail';



@Component({
  selector: 'native-qr-scanner-modal',
  templateUrl: 'native-qr-scanner-modal.html'
})
export class NativeQrScannerModalComponent {

  /** 获取的二维码 */
  private _qrCode: string = '';

  private _isCordova: boolean = this._platform.is('cordova');
  /** 是否打开闪光灯 */
  public isLighting: boolean = false;

  constructor(
    private _qrScanner: QRScanner,
    private _platform: Platform,
    private _msg: MsgService,
    private _viewCtrl: ViewController,
    private _events: Events,
    private _browserProvider: BrowserProvider,
    private _navCtrl: NavController,
    private _detailProvider: DetailProvider,
  ) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this._init();
    }, 300);
  }

  /** 初始化 */
  private _init = async () => {
    /** 切换透明主题 */
    this._events.publish('changeThemeEvent', 'transparent-theme');
    this._qrCode = '';
    this._startScan();
  }

  /** 扫描二维码 */
  private _startScan = async () => {
    if (this._isCordova) {
      try {
        const status: QRScannerStatus = await this._qrScanner.prepare();
        /** 是否授权使用相机 */
        if (status.authorized) {
          let scanSub = this._qrScanner.scan().subscribe(async (qrCode: string) => {
            this._qrCode = qrCode;
            await this._qrScanner.hide();
            scanSub.unsubscribe();
            await this.qrCope(qrCode);
            await this.dismiss();
          });
          await this._qrScanner.show();
        }
      } catch (err) {
        this._msg.alert(`调用相机失败，请授权使用相机。`);
      }
    } else {
      this._msg.alert(`请在APP中使用`);
    }
  }


  /** 关闭 */
  public dismiss = async () => {
    /** 切换默认主题 */
    this._events.publish('changeThemeEvent', 'default-theme');
    if (this._isCordova) {
      await this._qrScanner.destroy();
    }
    await this._viewCtrl.dismiss(this._qrCode);
  }

  /** 闪光灯开关 */
  public toggleLighting = async () => {
    if (this._isCordova) {
      this.isLighting = !this.isLighting;
      if (this.isLighting) {
        this._qrScanner.enableLight();
      } else {
        this._qrScanner.disableLight();
      }
    }
  }


  /** 处理二维码 */
  public qrCope = async (qrCode: string) => {
    qrCode = qrCode.replace(/\s/g, '');
    if (/^https?:\/\//i.test(qrCode)) {
      /** 开启浏览器 */
      this._browserProvider.create(qrCode);
    } else if (/^tl:\/\//i.test(qrCode)) {
      /** push到指定页面 */
      this._pushPage(qrCode);
    } else {
      /** alert二维码内容 */
      this._msg.alert(qrCode);
    }
  }

  /** push到指定页面 */
  private _pushPage = async (qrCode: string) => {
    let pageNum: number = 0;
    let moduleName: string = '';
    let id: string = '';
    const params: any = {};
    qrCode.replace(/^tl:\/\/(\d+)\/(\S+)$/i, ($input: string, $pageNum: string, $params: string) => {
      if ($pageNum) {
        pageNum = +$pageNum;
      }
      $params.split('&').forEach((v: string) => {
        const key: string = v.split('=')[0] || '';
        const value: string = v.split('=')[1] || '';
        if (key) {
          params[key] = value;
          if (key === 'm') {
            moduleName = value;
          }
          if (key === 'id') {
            id = value;
          }
        }
      });
      return $input;
    });
    // console.log(qrCode);
    // console.log(pageNum);
    // console.log(moduleName);
    // console.log(id);
    // console.log(params);

    switch (pageNum) {
      /** 详情页 */
      case 1:
        await this._navCtrl.push(DetailPage, { moduleName, id });
        this._detailProvider.sendDataToPC(moduleName, id);
        break;
      default:
        /** alert二维码内容 */
        this._msg.alert(qrCode);
        break;
    }

  }

}
