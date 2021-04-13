import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { Platform } from 'ionic-angular';
import { ToolsProvider } from "../../../serves/tools.service";
import { UploadFileInfoType } from "../../../interface/file.interface";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { MsgService } from '../../../serves/msg.service';


@Component({
  selector: 'edit-video',
  templateUrl: 'edit-video.html'
})
export class EditVideoComponent extends EditItemComponent {

  @Input() public fileMaxSize: number = 1000;

  public isApp: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");

  public uploadVideoSrc: string = "";

  public poster: string = "";

  constructor(
    protected _platform: Platform,
    protected _tools: ToolsProvider,
    protected validators: FormValidatorsService,
    private _msg: MsgService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.uploadVideoSrc = this.formControl.value;
  }


  /**
   * @description browser获取文件信息
   * @memberof EditVideoComponent
   */
  public getBrowserUploadFileInfo = (fileInfo: UploadFileInfoType): void => {
    this.uploadVideoSrc = fileInfo.filePath;
    this.formControl.setValue(fileInfo.base64);
  }

  /** app获取文件信息 */
  public getAppUploadFileInfo = (e: { thumbnailInfo: UploadFileInfoType, videoInfo: UploadFileInfoType }): void => {
    this.poster = e.thumbnailInfo.filePath;
    this.uploadVideoSrc = e.videoInfo.filePath;
    this.formControl.setValue(e.videoInfo.base64);
    // alert(`收到视频信息:`);
    // alert(`poster:${this.poster}`);
    // alert(`uploadVideoSrc:${this.uploadVideoSrc}`);
    // alert(`base64:${e.videoInfo.base64.slice(0,100)}`);
  }


  /**
   * @description 删除
   * @memberof EditVideoComponent
   */
  public del = (): void => {
    const confirm = this._msg.confirm('您确定要删除吗?');
    confirm.onDidDismiss(res => {
      if (res) {
        this.poster = "";
        this.uploadVideoSrc = "";
        this.formControl.setValue("");
      }
    });
  }



}
