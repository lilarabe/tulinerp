import { Component, Output, EventEmitter } from '@angular/core';
import { ModalController, Modal } from 'ionic-angular';
import { NativeQrScannerModalComponent } from './native-qr-scanner-modal/native-qr-scanner-modal';


@Component({
  selector: '[native-qr-scanner]',
  templateUrl: 'native-qr-scanner.html',
  host: {
    'class': 'native-qr-scanner',
    '(click)': 'openScannerModal();',
  },
})
export class NativeQrScannerComponent {

  /** 扫描页 */
  private _modal: Modal = this._modalCtrl.create(NativeQrScannerModalComponent);
  /** 输出二维码 */
  @Output() outputQrCodeEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private _modalCtrl: ModalController,
  ) {
    this._modal.onDidDismiss((qrCode: string)=>{
      this.outputQrCodeEvent.emit(qrCode);
    });
  }

  ionViewDidLoad() {
  }

  /** 开启二维码扫描页 */
  public openScannerModal = async () => {
    await this._modal.present();
}
  

  

}
