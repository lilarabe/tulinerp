import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { ToastController, Toast, ActionSheetController, ActionSheetOptions, ActionSheetButton, ActionSheet } from 'ionic-angular';


@Injectable()
export class MsgService {

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _actionSheetCtrl: ActionSheetController
  ) {
  }

  /** Alert列队数据 */
  private _queueAlertArr: Array<Alert> = [];
  /** 是否alert开启 */
  private _isAlertOpening: boolean = false;

  /** 加入Alert列队 */
  private _addAlertQueue = (alert: Alert): void => {
    this._queueAlertArr.push(alert);
    this._openAlert();
  }

  /** 移除Alert列队 */
  private _delAlertQueue = (idx: number) => {
    this._queueAlertArr.splice(idx, 1);
  }

  /** 打开 Alert */
  private _openAlert = () => {
    if (this._queueAlertArr.length === 0) {
      return;
    }
    if (this._isAlertOpening === false) {
      this._isAlertOpening = true;
      const index: number = 0;
      const alert: Alert = this._queueAlertArr[index];
      alert.present();
      alert.onDidDismiss(() => {
        this._isAlertOpening = false;
        this._delAlertQueue(index);
        this._openAlert();
      });
    }
  }

  /**
   * @description alert
   * @memberof MsgService
   */
  public alert = (message: string, title: string = '系统提示', buttons: Array<string> = ['确定']): Alert => {
    const alert: Alert = this.alertCtrl.create({ message, title, buttons });
    this._addAlertQueue(alert);
    return alert;
  }

  public actionSheet = async (title: string, btnData: Array<{ text: string, value: any }>): Promise<any> => {
    return new Promise((resolve) => {
      const buttons: Array<ActionSheetButton> = [];
      btnData.forEach(v => {
        const text: string = v.text;
        const handler = () => {
          resolve(v.value);
        };
        buttons.push({ text, handler });
      });
      buttons.push({ text: `取消`, role: 'cancel' });
      const options: ActionSheetOptions = {
        title,
        buttons,
      };
      const actionSheet: ActionSheet = this._actionSheetCtrl.create(options);
      actionSheet.present();
    });
  }

  /**
   * 弹出一个 “confirm”
   * 用法：
   * 1.依赖注入：private msg: MsgProvider
   * 2.const confirm = this.msg.confirm('您确定要退出吗?');
    confirm.onDidDismiss(res => {
      if (res) { res: 确定 返回 true, 取消返回 false
        ...
      }
    });
   *
   * @memberof MsgProvider
   */
  public confirm = (msg: string, btnsText = { ok: '确定', cancel: '取消' }): Alert => {
    const confirm = this.alertCtrl.create({
      title: '系统提示',
      cssClass: 'max-zindex',
      message: msg,
      buttons: [
        {
          text: btnsText.cancel,
          role: 'cancel',
          handler: () => {
            confirm.dismiss(false);
            return false;
          }
        },
        {
          text: btnsText.ok,
          handler: () => {
            confirm.dismiss(true);
            return false;
          }
        }
      ]
    });
    confirm.present();
    return confirm;
  }


  public confirmAsync = async (
    msg: string,
    btnsText = { ok: '确定', cancel: '取消' },
  ): Promise<any> => {
    const confirm = this.alertCtrl.create({
      title: '系统提示',
      cssClass: 'max-zindex',
      message: msg,
      buttons: [
        {
          text: btnsText.cancel,
          role: 'cancel',
          handler: () => {
            confirm.dismiss(false);
            return false;
          }
        },
        {
          text: btnsText.ok,
          handler: () => {
            confirm.dismiss(true);
            return false;
          }
        }
      ]
    });
    await confirm.present();
    return new Promise((resolve) => {
      confirm.onDidDismiss((res: boolean) => {
        resolve(res);
      });
    });
  }

  /**
   * 用于提示用户正在加载，或提交数据等。避免用户重复UI操作，产生不必要的请求.
   * 用法：
   * 1.依赖注入： msg: MsgProvider
   * 2.const loader = this.msg.loading('数据加载中...');
   * loader.present(); 开启
   * loader.dismiss(); 关闭
   * cssClass : loading-top loading-delay
   * @memberof MsgProvider
   */
  public loading = (msg: string = '数据加载中', cssClass?: string): Loading => {
    const loader = this.loadingCtrl.create({
      content: msg,
      cssClass,
    });
    return loader;
  }

  /**
   * 显示提示信息
   * 用法：
   * 1.依赖注入： msg: MsgProvider
   * this.msg.toast('数据保存成功');
   *
   * @memberof MsgProvider
   */
  private isToastHide: boolean = true;
  public toast = (msg: string, time: number = 2000): Toast => {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: time,
      position: 'bottom'
    });
    toast.dismissAll();
    if (this.isToastHide) {
      toast.present();
      this.isToastHide = false;
    }
    toast.onDidDismiss(() => {
      this.isToastHide = true;
    });
    return toast;
  }


  private loader: any = null;
  private showLoadingHandler(msg) {
    if (this.loader == null) {
      this.loader = this.loadingCtrl.create({
        cssClass: 'max-zindex',
        content: msg
      });
      this.loader.present();
    } else {
      this.loader.data.content = msg;
    }
  }
  private hideLoadingHandler() {
    if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
    }
  }
  /**
   * @description 开启loading
   * @author da
   * @param {any} msg string 显示信息
   * @memberof MsgService
   */
  public showLoader(msg: string) {
    this.showLoadingHandler(msg);
  }
  /**
   * @description 关闭loading
   * @author da
   * @memberof MsgService
   */
  public hideLoader() {
    this.hideLoadingHandler();
  }


  /** 弹出密码输入框 */
  public passwordConfirm = async (msg: string): Promise<any> => {
    let password: string = '';
    const confirm: Alert = this.alertCtrl.create({
      title: '系统提示',
      message: msg,
      inputs: [
        { name: 'password', placeholder: '密码', type: 'password' }
      ],
      buttons: [
        { text: '取消', role: 'cancel' },
        { text: '确定', role: 'ok' }
      ]
    });
    await confirm.present();
    return new Promise(resolve => {
      confirm.onDidDismiss((data: any, role: string) => {
        password = role === 'ok' ? data.password : '';
        password = password + "";
        resolve(password);
      });
    });
  }

}