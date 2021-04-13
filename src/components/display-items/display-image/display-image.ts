import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";
import { TpProvider } from "../../../providers/tp/tp";

@Component({
  selector: 'display-image',
  templateUrl: 'display-image.html'
})
export class DisplayImageComponent extends DisplayItemComponent {

  constructor(
    public tp: TpProvider,
  ) {
    super();
  }


  /**
   * @description 图片预览
   * @memberof DisplayImageComponent
   */
  public previewImage = (src: string): void => {
    this.tp.openPreviewImageModal([{ src }]);
  }

}
