import { Component } from '@angular/core';
import { TpProvider } from '../../../../../providers/tp/tp';
import { DetailMoreItemComponent } from '../detail-more-item';

/**
 * Generated class for the DetailMoreMultiimageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'detail-more-multiimage',
  templateUrl: 'detail-more-multiimage.html'
})
export class DetailMoreMultiimageComponent extends DetailMoreItemComponent {

  constructor(
    private _tp: TpProvider,
  ) {
    super();
  }

  /** 图片预览 */
  public previewImage = (src: string): void => {
    this._tp.openPreviewImageModal([{ src }], 0);
  }

}
