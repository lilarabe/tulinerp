import { Component, Injectable } from '@angular/core';
import { ModalController, Modal, ViewController, NavParams, ModalOptions } from 'ionic-angular';
import { ToolsProvider } from '../../serves/tools.service';

@Component({
  selector: 'print-msg',
  templateUrl: 'print-msg.html'
})
export class PrintMsgComponent {

  public preMsg: any;

  public msg: any;

  public typeof: string = '';

  public title: string = '';

  constructor(
    private _viewCtrl: ViewController,
    private _navParams: NavParams,
    private _tools: ToolsProvider,
  ) {
    this.msg =  this._navParams.get('msg');
    this.typeof = this._tools.getType(this.msg);
    if(this.typeof === 'function'){
      alert(this.msg);
    }
    this.preMsg = JSON.stringify(this._navParams.get('msg'), null, 2);
    this.title = this._navParams.get('title');
  }

  public close = () => { this._viewCtrl.dismiss(); }

}

@Injectable()
export class PrintMsgService {

  /** 列队数据 */
  private _queueArr: Array<Modal> = [];

  private _isOpening: boolean = false;

  constructor(
    private _modalCtrl: ModalController,
  ) { }

  /** 加入列队 */
  private _addQueue = (msg: any, title: string = ''): void => {
    const modalOptions: ModalOptions = {};
    const modal: Modal = this._modalCtrl.create(PrintMsgComponent, { msg, title }, modalOptions);
    this._queueArr.push(modal);
    this._open();
  }

  /** 移除列队 */
  private _delQueue = (idx: number) => {
    this._queueArr.splice(idx, 1);
  }

  /** 打开 Modal */
  private _open = () => {
    if (this._queueArr.length === 0) {
      return;
    }
    if (this._isOpening === false) {
      this._isOpening = true;
      const index: number = 0;
      const modal: Modal = this._queueArr[index];
      modal.present();
      modal.onDidDismiss(() => {
        this._isOpening = false;
        this._delQueue(index);
        this._open();
      });
    }
  }

  /** 打开 Modal */
  public print = (msg: any, title: string = '', debug: boolean = false) => {
    if (debug) {
      this._addQueue(msg, title);
      console.log(msg);
    }
  }

}