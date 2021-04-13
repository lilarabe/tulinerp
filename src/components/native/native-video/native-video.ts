import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { UploadFileInfoType } from '../../../interface/file.interface';
import { ToolsProvider } from '../../../serves/tools.service';
import { MsgService } from '../../../serves/msg.service';
import { VideoService } from '../../../serves/native/video';


/** 使用 cordova-plugin-camera 获取视频 */
@Component({
  selector: '[native-video]',
  templateUrl: 'native-video.html',
  host: {
    '(tap)': 'sendVideoInfoFromPhotoLibrary();',
  },
})
export class NativeVideoComponent {

  /** 视频文件最大限定 */
  @Input() public fileMaxSize: number = 1000;

  /** 输出选择视频的 Path */
  @Output() uploadVideoPath: EventEmitter<{ thumbnailInfo: UploadFileInfoType, videoInfo: UploadFileInfoType }> = new EventEmitter();

  private _isCordova: boolean = this._platform.is("cordova");

  constructor(
    private _platform: Platform,
    private _tools: ToolsProvider,
    private _msg: MsgService,
    private _video: VideoService,
  ) {
  }

  /** 处理获取拍摄的视频 */
  public sendVideoInfoFromCamera = async () => {
    if (this._isCordova) {
      /** loading */
      const loader = this._msg.loading('视频处理中...');
      loader.present();
      try {
        /** 选择视频路径 */
        const metaVideoFullPath: string = await this._video.getMetaVideoCamera();
        await this._tools.sleep(200);
        loader.setContent('复制视频文件中...');
        const copyResult: { path: string, name: string } = await this._video.copyVideoToTemp(metaVideoFullPath);
        const copyMetaVideoInfo: { path: string, name: string, fullPath: string } = {
          path: copyResult.path,
          name: copyResult.name,
          fullPath: `${copyResult.path}${copyResult.name}`
        };
        /** 原视频缩略图 */
        await this._tools.sleep(200);
        loader.setContent('获取视频缩略图中...');
        const thumbnailInfo: UploadFileInfoType = await this._video.getVideopThumbnailInfo(copyMetaVideoInfo.fullPath);
        await this._tools.sleep(200);
        loader.setContent('视频压缩中...');
        const pathTranscodedVideo: string = await this._video.transVideo(copyMetaVideoInfo.fullPath);
        await this._tools.sleep(200);
        loader.setContent('获取视频编码...');
        const base64: string = await this._video.getVideoBase64(pathTranscodedVideo);
        const videoInfo: UploadFileInfoType = { filePath: pathTranscodedVideo, base64 };
        const result = { thumbnailInfo, videoInfo };
        this.uploadVideoPath.emit(result);
        await this._tools.sleep(200);
        loader.setContent('视频处理成功');
        await this._tools.sleep(500);
        loader.dismiss();
      } catch {
        loader.dismiss();
      }
    }
  }

  /** 处理从相册中获取视频 */
  public sendVideoInfoFromPhotoLibrary = async () => {
    if (this._isCordova) {
      /** loading */
      const loader = this._msg.loading('视频处理中...');
      loader.present();
      try {
        /** 选择视频路径 */
        const metaVideoFullPath: string = await this._video.getMetaVideoPhotoLibrary();
        /** 原视频数据 */
        const metaVideoInfo = await this._video.getVideoInfo(metaVideoFullPath);
        if (this._tools.changeFileSize(metaVideoInfo.size) > this.fileMaxSize) {
          this._msg.toast(`上传文件不可大于${this.fileMaxSize}M`, 6000);
          return;
        }

        await this._tools.sleep(200);
        /** 原视频缩略图 */
        loader.setContent('获取视频缩略图中...');
        const thumbnailInfo: UploadFileInfoType = await this._video.getVideopThumbnailInfo(metaVideoFullPath);
        await this._tools.sleep(200);
        /** 复制视频文件：避免源文件权限问题，而带来的麻烦*/
        loader.setContent('复制视频文件中...');
        const copyResult: { path: string, name: string } = await this._video.copyVideoToTemp(metaVideoFullPath);
        const copyMetaVideoInfo: { path: string, name: string, fullPath: string } = {
          path: copyResult.path,
          name: copyResult.name,
          fullPath: `${copyResult.path}${copyResult.name}`
        };
        await this._tools.sleep(200);
        // alert(`复制视频文件：${JSON.stringify(copyMetaVideoInfo)}`);
        /** 转换后的视屏路径 */
        loader.setContent('视频压缩中...');
        const pathTranscodedVideo: string = await this._video.transVideo(copyMetaVideoInfo.fullPath);
        await this._tools.sleep(200);
        // alert(`转换后的视屏路径:${pathTranscodedVideo}`)
        /** video Base64 */
        loader.setContent('获取视频编码...');
        const base64: string = await this._video.getVideoBase64(pathTranscodedVideo);
        await this._tools.sleep(200);
        // alert(`base64:${base64.slice(0,100)}`);
        /** 处理后视频信息 */
        const videoInfo: UploadFileInfoType = { filePath: pathTranscodedVideo, base64 };
        /** 发送数据 */
        const result = { thumbnailInfo, videoInfo };
        this.uploadVideoPath.emit(result);
        loader.setContent('视频处理成功');
        await this._tools.sleep(500);
        loader.dismiss();
      } catch {
        loader.dismiss();
      }
    }
  }

  /** 选择上传视频方式 */
  public selectUploadVideoType = async () => {
    const btnData: Array<any> = [{ text: '拍摄', value: 1 }, { text: '相册', value: 2 }];
    const selected: number = await this._msg.actionSheet('请选择上传方式', btnData);
    switch (selected) {
      case 1:
        this.sendVideoInfoFromCamera();
        break;
      case 2:
        this.sendVideoInfoFromPhotoLibrary();
        break;
      default:
        break;
    }
  }

}