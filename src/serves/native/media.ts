import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MediaCapture, CaptureAudioOptions, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { FileProvider } from './file';
import { MsgService } from '../../serves/msg.service';
import { UploadFileInfoType } from "../../interface/file.interface";
import { VideoEditor, TranscodeOptions } from '@ionic-native/video-editor';


@Injectable()
export class MediaProvider {

  /** 是否debug? */
  private _isDebug: boolean = false;

  /** 是否在app */
  private _isApp: boolean = this._platform.is("cordova");

  /** 音频参数 */
  private _audioOptions: CaptureAudioOptions = {
    limit: 1,
    duration: 30,
  }

  /** 视频参数 */
  private _videoOptions: CaptureVideoOptions = {
    limit: 1,
    duration: 60,
    quality: 1,
  }

  constructor(
    private _platform: Platform,
    private _mediaCapture: MediaCapture,
    private _fileProvider: FileProvider,
    private _msg: MsgService,
    private _videoEditor: VideoEditor,
  ) {
    if (this._isApp) {
      this._fileProvider.createTempDir().then(()=>{
        // this._fileProvider.clearTempDir();
      });
      
    }
  }


  /**
   * @description 获取媒体
   * @memberof MediaProvider
   */
  public captureMedia = (type: string): Promise<UploadFileInfoType> => {
    return new Promise((resovle, reject) => {
      if (this._isApp) {
        switch (type) {
          case "audio":
            this._mediaCapture.captureAudio(this._audioOptions).then((mediaFiles: MediaFile[]) => {
              this._showMsg(mediaFiles);
              this._captureMediaSuccess(mediaFiles[0], "audio").then((fileInfo: UploadFileInfoType) => {
                resovle(fileInfo);
              });
            });
            break;
          case "video":
            this._mediaCapture.captureVideo(this._videoOptions).then((mediaFiles: MediaFile[]) => {
              this._showMsg(mediaFiles);
              this._captureMediaSuccess(mediaFiles[0], "video").then((fileInfo: UploadFileInfoType) => {
                resovle(fileInfo);
              });
            });
            break;
        }
      } else {
        this._showMsg(`不在App中，无法获取视频`);
        reject(`不在App中，无法获取视频`);
      }
    });
  }



  /**
   * @description 成功获取媒体回调
   * @protected
   * @memberof MediaProvider
   */
  protected _captureMediaSuccess = (capturedFile: MediaFile, type: string): Promise<any> => {
    return new Promise((resovle, reject) => {
      /** 返回数据 */
      const result: UploadFileInfoType = {};
      /** 获取的媒体数据名称 */
      const fileNameEncode: string = encodeURI(capturedFile.name);
      const fileName: string = capturedFile.name;
      this._showMsg(`获取的媒体数据名称:${fileName}`);
      /** 过滤名称正则 */
      const reg: RegExp = new RegExp(fileNameEncode);
      /** 获取的媒体数据的localURLDirPath */
      const localURLDirPath: string = capturedFile['localURL'].replace(reg, '');
      this._showMsg(`获取的媒体数据的路径地址:${localURLDirPath}`);
      /** 文件的后缀名 */
      const suffix: string = fileName.replace(/[\D|\d]+\.([\w|\d]+)/, '$1');
      this._showMsg(`文件的后缀名:${suffix}`);
      /** 临时媒体文件名 */
      const tempMediaName: string = `tempMedia.${suffix}`;
      this._showMsg(`临时媒体文件名:${tempMediaName}`);
      /** 将获取的媒体文件重命名，并且拷贝到另外的一个目录 */
      /** 检查媒体文件是否存在 */
      this._fileProvider.checkFile(localURLDirPath, fileName).then(() => {
        this._showMsg(`文件存在：${localURLDirPath + fileName}`);
         /** 将媒体文件拷贝到临时文件夹 */
         this._fileProvider.copyFileToTemp(localURLDirPath, fileName, tempMediaName).then((copyFileRes) => {
          this._showMsg(`copyFileRes:${JSON.stringify(copyFileRes)}`);
          /** 删除媒体文件 */
          this._fileProvider.delFile(localURLDirPath, fileName);
          // this._fileProvider.delFile(localURLDirPath, fileNameEncode);

          /** 获取音频数据 */
          const getAudioInfo = (): void => {
            /** 打开 loading */
            this._msg.showLoader('文件处理中请稍后...');
            result.filePath = copyFileRes.path + copyFileRes.name;
            this._showMsg(`返回filePath:${result.filePath}`);
            /** 获取 base64 */
            this._fileProvider.getBase64(copyFileRes.path, copyFileRes.name).then((base64) => {
              result.base64 = base64;
              resovle(result);
              /** 关闭 loading */
              this._msg.hideLoader();
            });
          }

          /** 获取视频数据 */
          const getVideoInfo = (): void => {
            const fileUri = copyFileRes.path + tempMediaName;
            const outputFileName = new Date().getTime().toString();
            const options: TranscodeOptions = {
              fileUri: fileUri,
              outputFileName: outputFileName,
              outputFileType: this._videoEditor.OutputFileType.MPEG4,
              saveToLibrary: false,
              maintainAspectRatio: true,
              deleteInputFile: false,
              // width: 1080,
              // height: 1080,
              width: 640,
              height: 640,
              fps: 24,
            };
            /** 打开 loading */
            this._msg.showLoader('视频压缩中请稍后...');
            /** 视频转换 */
            this._videoEditor.transcodeVideo(options)
              .then((pathTranscodedVideo: string) => {

                this._showMsg(`视频转换成功:transcodeVideo pathTranscodedVideo:${pathTranscodedVideo}`);
                const newFileName = outputFileName + '.mp4';
                const reg: RegExp = new RegExp(newFileName);
                const newPath: string = 'file://' + pathTranscodedVideo.replace(reg, '');

                /** 将压缩的视频拷贝到临时文件夹 */
                this._fileProvider.copyFileToTemp(newPath, newFileName, newFileName).then(
                  (copyTranscodedVideoRes) => {
                    this._showMsg(`将压缩的视频拷贝到临时文件夹:${newPath + newFileName}`);
                    /** 删除转换后的视频 */
                    this._fileProvider.delFile(newPath, newFileName);
                    /** 将压缩的视频临时路径赋给 result.filePath */
                    const copyTranscodedVideoPath = copyTranscodedVideoRes.path;
                    const copyTranscodedVideoName = copyTranscodedVideoRes.name;
                    this._fileProvider.checkFile(copyTranscodedVideoPath, copyTranscodedVideoName).then(
                      () => {
                        this._showMsg(`文件存在:${copyTranscodedVideoPath}, ${copyTranscodedVideoName}`);
                      },
                      () => {
                        this._showMsg(`文件不存在:${copyTranscodedVideoPath}, ${copyTranscodedVideoName}`);
                      }
                    );
                    result.filePath = copyTranscodedVideoPath + copyTranscodedVideoName;
                    this._showMsg(`filePath:${result.filePath}`);
                    /** 获取 base64 */
                    this._fileProvider.getBase64(copyTranscodedVideoPath, copyTranscodedVideoName).then((base64) => {
                      /** 关闭 loading */
                      this._msg.hideLoader();
                      result.base64 = base64;
                      resovle(result);
                    });
                  }
                );
              })
              .catch((err) => {
                /** 关闭 loading */
                this._msg.hideLoader();
                this._showMsg(`视频转码报错:${JSON.stringify(err)}`);
                reject();
              });
          }

          switch (type) {
            case "audio":
              getAudioInfo();
              break;
            case "video":
              getVideoInfo();
              break;
          }

        });
      });
    });
  }



  /**
   * @description 打印debug信息
   * @private
   * @memberof MediaProvider
   */
  private _showMsg = (msg: any): void => {
    if (this._isDebug) {
      alert(JSON.stringify(msg));
    }
  }

}
