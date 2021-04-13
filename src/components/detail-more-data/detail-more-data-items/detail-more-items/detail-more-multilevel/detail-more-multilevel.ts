import { Component, Input } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { Modal, ModalController } from 'ionic-angular';
import { DisplayDescShowComponent } from '../../../../display-items/display-desc/display-desc-show/display-desc-show';

@Component({
  selector: 'detail-more-multilevel',
  templateUrl: 'detail-more-multilevel.html'
})

export class DetailMoreMultilevelComponent extends DetailMoreItemComponent {

  /** 是否溢出 */
  public isOverflow: boolean = false;

  private _modal: Modal;

  @Input() itemData:any;

  public realValue:string='';

  constructor(
    private _modalCtrl: ModalController,
  ) {
    super();
  }

  ngOnInit(): void {
    this.realValue = this.itemData.find(v=>v.key===this.moreDataItemData.key+'_name').value;
  }
  /** 测试是否溢出 */
  public testOverflow = (e: boolean) => {
    this.isOverflow = e;
  }
  /** 文字预览 */
  public textView = (): void => {
    /** 文字长度 */
    const strLen: number = this.realValue.length;
    if (this.isOverflow && strLen > 20) {
      this._modal = this._modalCtrl.create(DisplayDescShowComponent, { value: this.realValue });
      this._modal.present();
    }
  }

}

