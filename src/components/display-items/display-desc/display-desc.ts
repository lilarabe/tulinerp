import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";
import { Modal, ModalController } from "ionic-angular";
import { DisplayDescShowComponent } from './display-desc-show/display-desc-show';


/**
 * @description 显示描述组件
 * @author da
 * @export
 * @class DisplayDescComponent
 * @extends {DisplayItemComponent}
 */
@Component({
  selector: 'display-desc',
  templateUrl: 'display-desc.html'
})
export class DisplayDescComponent extends DisplayItemComponent {

  public modal: Modal;

  constructor(
    private _modalCtrl: ModalController,
  ) {
    super();
  }

  /** 显示所有描述信息 */
  public showDescription = (): void => {
    this.modal = this._modalCtrl.create(DisplayDescShowComponent, { value: this.value });
    this.modal.present();
  }

}
