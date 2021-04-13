import { Component, Output, EventEmitter } from '@angular/core';
import { CanvasBase64Service } from "../../../serves/canvas-base64.service";
import { ToolsProvider } from '../../../serves/tools.service';



@Component({
  selector: 'app-image-upload',
  templateUrl: 'app-image-upload.html',
})
export class AppImageUploadComponent {

  /** 输出选中图片数据 */
  @Output() imageDataEvent: EventEmitter<{ src: string, base64: string }> = new EventEmitter();


  constructor(
    protected _canvasBase64Service: CanvasBase64Service,
    protected _tools:ToolsProvider,
  ) {

  }

  /**
   * @description 图片改变
   * @memberof AppImageUploadComponent
   */
  public imageChange = (event): void => {
    const files: Array<any> = event.target.files;
    if (files.length > 0) {
      const uploadImageSrc = this._tools.fileToBlobUrl(files[0]);
      this._canvasBase64Service.getBase64Code(uploadImageSrc).then((base64: string) => {
        this.imageDataEvent.emit({src:uploadImageSrc, base64: base64});
      });
    }
  }

}
