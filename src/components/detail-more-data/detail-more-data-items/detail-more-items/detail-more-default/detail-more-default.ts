import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { Modal, ModalController } from 'ionic-angular';
import { DisplayDescShowComponent } from '../../../../display-items/display-desc/display-desc-show/display-desc-show';


@Component({
  selector: 'detail-more-default',
  templateUrl: 'detail-more-default.html'
})
export class DetailMoreDefaultComponent extends DetailMoreItemComponent {

  /** 是否溢出 */
  public isOverflow: boolean = false;

  private _modal: Modal;

  constructor(
    private _modalCtrl: ModalController,
  ) {
    super();
  }
  /** 测试是否溢出 */
  public testOverflow = (e: boolean) => {
    this.isOverflow = e;
  }
  /** 文字预览 */
  public textView = (): void => {
    /** 文字长度 */
    const strLen: number = this.moreDataItemData.value.length;
    if (this.isOverflow && strLen > 20) {
      this._modal = this._modalCtrl.create(DisplayDescShowComponent, { value: this.moreDataItemData.value });
      this._modal.present();
    }
  }

}
