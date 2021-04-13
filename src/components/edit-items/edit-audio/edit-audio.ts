import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { Platform } from 'ionic-angular';
import { ToolsProvider } from "../../../serves/tools.service";
import { UploadFileInfoType } from "../../../interface/file.interface";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-audio',
  templateUrl: 'edit-audio.html'
})
export class EditAudioComponent extends EditItemComponent {

  public isApp: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");

  public uploadAudioSrc: string = "";

  constructor(
    protected _platform: Platform,
    protected _tools: ToolsProvider,
    protected _validators: FormValidatorsService,
  ) {
    super(_validators);
  }


  ngOnInit() {
    this.init();
    this.uploadAudioSrc = this.formControl.value;
  }



  /**
   * @description 获取文件信息
   * @memberof EditAudioComponent
   */
  public getUploadFileInfo = (fileInfo: UploadFileInfoType): void => {
    this.uploadAudioSrc = fileInfo.filePath;
    this.formControl.setValue(fileInfo.base64);
  }



  /**
   * @description 删除
   * @memberof EditAudioComponent
   */
  public del = (e: Event): void => {
    e.stopPropagation();
    this.uploadAudioSrc = "";
    this.formControl.setValue("");
  }

}
