import { Component } from '@angular/core';
import { DetailItemComponent } from "../detail-item/detail-item";
import { TpProvider } from "../../../providers/tp/tp";


@Component({
  selector: 'detail-image',
  templateUrl: 'detail-image.html'
})
export class DetailImageComponent extends DetailItemComponent {

  constructor(
    private tp: TpProvider,
  ) {
    super();
  }

    /**
   * @description 图片预览
   * @memberof EditCameraComponent
   */
  public previewImage = (): void => {
    this.tp.openPreviewImageModal([{ src: this.value }], 0);
  }

}
