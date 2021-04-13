import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { TpProvider } from '../../../../../providers/tp/tp';


@Component({
  selector: 'detail-more-image',
  templateUrl: 'detail-more-image.html'
})
export class DetailMoreImageComponent extends DetailMoreItemComponent {

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
