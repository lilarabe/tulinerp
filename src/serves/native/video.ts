import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VideoEditor, TranscodeOptions, VideoInfo, CreateThumbnailOptions } from '@ionic-native/video-editor';
import { MediaCapture, CaptureVideoOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { MsgService } from '../msg.service';
import { UploadFileInfoType } from "../../interface/file.interface";
import { FileProvider } from './file';
import { ToolsProvider } from '../tools.service';


@Injectable()
export class VideoService {

    private _isAndroid: boolean = this._platform.is('android');

    constructor(
        private _camera: Camera,
        private _msg: MsgService,
        private _videoEditor: VideoEditor,
        private _platform: Platform,
        private _fileProvider: FileProvider,
        private _tools: ToolsProvider,
        private _mediaCapture: MediaCapture,
    ) {
    }

    /** 获取拍摄的视频 */
    public getMetaVideoCamera = async (): Promise<string> => {
        let resultVideoPath: string = ``;
        /** 视频参数 */
        const videoOptions: CaptureVideoOptions = {
            limit: 1,
            quality: 1,
        }
        try {
            const mediaFile: MediaFile[] | CaptureError = await this._mediaCapture.captureVideo(videoOptions);
            if (Array.isArray(mediaFile) && mediaFile.length > 0) {
                const capturedFile: MediaFile = mediaFile[0];
                capturedFile.fullPath = this._fillPath(capturedFile.fullPath);
                const path: string = this._tools.getFilePathAndName(capturedFile.fullPath).filePath;
                const name: string = this._tools.getFilePathAndName(capturedFile.fullPath).fileName;
                await this._fileProvider.checkFile(path, name);
                resultVideoPath = `${path}${name}`;
                return Promise.resolve(resultVideoPath);
            } else {
                return Promise.reject(``);
            }

        } catch (err) {
            // this._msg.alert(`获取拍摄的视频失败:${err}`);
            resultVideoPath = '';
            return Promise.reject(``);
        }

    }
    /** 从相册中获取视频路径
     * @returns 相处中视频路径
     */
    public getMetaVideoPhotoLibrary = async (): Promise<string> => {
        /** CameraOptions 相机设置的可选参数 */
        const cameraOptions: CameraOptions = {
            /** 返回值的格式：获取视频的URl */
            destinationType: this._camera.DestinationType.FILE_URI,
            /** 选择media类型 */
            mediaType: this._camera.MediaType.VIDEO,
            /** 获取图片的来源 PHOTOLIBRARY CAMERA */
            sourceType: this._camera.PictureSourceType.PHOTOLIBRARY,
            /** 是否保存到相册 */
            saveToPhotoAlbum: false,
        };
        try {
            const resultVideoPath =  await this._camera.getPicture(cameraOptions);
            return Promise.resolve(resultVideoPath);
        } catch (err) {
            // this._msg.alert(`获取相册视频文件错误`);
            return Promise.reject(``);
        }
    }
    /** 获取视频信息 
     * @param fileUri:视频路径
     * @returns 视频 大小，尺寸，时长等等
     */
    public getVideoInfo = async (fileUri: string): Promise<VideoInfo> => {
        if (this._isAndroid) {
            fileUri = this._fillPath(fileUri);
        }
        try {
            return await this._videoEditor.getVideoInfo({ fileUri });
        } catch (err) {
            this._msg.alert(`获取视频信息错误:${err}`);
            return { width: 0, height: 0, orientation: 'portrait', duration: 0, size: 0, bitrate: 0 };
        }

    }
    /** 获取视频截图信息
     * @param fileUri:视频路径
     * @returns 缩略图路径，base64
     */
    public getVideopThumbnailInfo = async (fileUri: string): Promise<UploadFileInfoType> => {
        const result: UploadFileInfoType = {};
        if (this._isAndroid) {
            fileUri = this._fillPath(fileUri);
        }
        const quality: number = 50;
        const outputFileName: string = `videoThumbnail${+new Date()}`;
        const options: CreateThumbnailOptions = { fileUri, outputFileName, quality };
        let path: string = ``;
        try {
            path = await this._videoEditor.createThumbnail(options);
            path = this._fillPath(path);
        } catch (err) {
            path = '';
            this._msg.alert(`获取视频截图错误`);
        }
        const base64: string = await this._fileProvider.getBase64ByPath(path);
        result.base64 = base64;
        result.filePath = path;
        return result;
    }
    /** 复制视屏文件到临时文件夹
     * @param 视频路径
     * @returns { path: string, name: string }
     */
    public copyVideoToTemp = async (videoFullPath: string): Promise<{ path: string, name: string }> => {
        let { filePath, fileName } = this._tools.getFilePathAndName(videoFullPath);
        if (this._isAndroid) {
            filePath = this._fillPath(filePath);
        }
        /** 文件的后缀名 */
        const suffix: string = fileName.replace(/[\D|\d]+\.([\w|\d]+)/, '$1');
        const outputFileName: string = `metaVideo${+new Date()}.${suffix}`;
        try {
            return await this._fileProvider.copyFileToTemp(filePath, fileName, outputFileName);
        } catch (err) {
            this._msg.alert(`复制视屏文件错误`);
            return { path: ``, name: `` };
        }
    }
    /** 视频转换
     * @param fileUri 视频地址
     * @returns 如果转换成功返回转换后的视频地址，失败返回原视频地址。
     */
    public transVideo = async (fileUri: string): Promise<string> => {
        let newFilePath: string = ``;
        if (this._isAndroid) {
            fileUri = this._fillPath(fileUri);
        }
        const outputFileName = `transVideo${+new Date()}`;
        /** 视频转码的配置文件 */
        const options: TranscodeOptions = {
            /** 导入视频路径 */
            fileUri,
            /** 文件输出名称 */
            outputFileName,
            /** 文件输出类型 M4V MPEG4 M4A QUICK_TIME */
            outputFileType: this._videoEditor.OutputFileType.MPEG4,
            /** 是否保存到相册 */
            saveToLibrary: false,
            /** 是否删除原始视频 */
            deleteInputFile: false,
            maintainAspectRatio: true,
            width: 640,
            height: 640,
            fps: 24,
        };
        /** 如果转换成功，返回转换后视频的文件信息。失败，返回原视频数据 */
        try {
            /** 转换后的视屏路径 */
            newFilePath = await this._videoEditor.transcodeVideo(options);
        }
        catch (e) {
            /** 如果转换失败，将处理原视频*/
            newFilePath = fileUri;
        }
        return newFilePath;
    }
    /** 获取视频的Base64
     * @param 视频地址
     * @returns video base64
     */
    public getVideoBase64 = async (videoFullPath: string): Promise<string> => {
        videoFullPath = this._fillPath(videoFullPath);
        try {
            return await this._fileProvider.getBase64ByPath(videoFullPath);
        } catch (err) {
            this._msg.alert(`获取视频的Base64错误`);
            return '';
        }
    }

    /** 填充路径 */
    private _fillPath = (filePath: string): string => {
        return /^file:\/\/[\d|\D]+/i.test(filePath) ? filePath : `file://${filePath}`;
    }
}
