import { Component, Output, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MediaProvider } from "../../../serves/native/media";
import { UploadFileInfoType } from "../../../interface/file.interface";


@Component({
  selector: '[native-audio]',
  templateUrl: 'native-audio.html',
  host: {
    '(touchstart)': 'recordStart($event);',
  },
})
export class NativeAudioComponent {

  @Output() uploadFileInfoEvent: EventEmitter<UploadFileInfoType> = new EventEmitter<UploadFileInfoType>();

  private _isApp: boolean = this._platform.is("cordova");

  constructor(
    private _platform: Platform,
    private _mediaProvider: MediaProvider,
  ) {
  }


  /**
   * @description 开始录音
   * @memberof NativeAudioComponent
   */
  public recordStart = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    if (this._isApp) {
      this._mediaProvider.captureMedia('audio').then((fileInfo: UploadFileInfoType) => {
        this.uploadFileInfoEvent.emit(fileInfo);
      });
    }
  }

}
