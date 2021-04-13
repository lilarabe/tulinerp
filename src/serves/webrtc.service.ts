import { Injectable } from '@angular/core';
import { PrintMsgService } from '../components/print-msg/print-msg';
// import adapter from 'webrtc-adapter';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Platform } from 'ionic-angular';
declare let MediaRecorder: any;

@Injectable()
export class WebrtcService {
    /** 采集视频束 */
    private _constraints: MediaStreamConstraints | any = {
        audio: false,
        video: {
            width: { min: 0, max: 1080 },
            height: { min: 0, max: 1080 },
            /** width/height */
            aspectRatio: { min: 0.3, max: 3 },
            /** 帧频 */
            frameRate: { min: 10, max: 60 },
            /** 摄像头 user environment */
            facingMode: 'user',
        }
    };
    /** 媒体流 */
    private _mediaStream: MediaStream;
    /** 录制 */
    private _mediaRecorder: any;
    /** 录制设置 */
    private _mediaRecorderOption: any = {
        minType: 'video/webm;codecs=vp8',
    };
    /** 录制缓存 */
    private _recorderBuffer: Array<any> = [];

    constructor(
        private _printMsg: PrintMsgService,
        private _androidPermissions: AndroidPermissions,
        private _platform: Platform,
    ) {
        if (this._platform.is('cordova')) {
            this._platform.ready().then(() => {
                this._androidPermissions.requestPermissions([
                    this._androidPermissions.PERMISSION.CAMERA,
                    this._androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
                    this._androidPermissions.PERMISSION.RECORD_AUDIO
                ]);
            });
        }
    }

    /** 检测是否支持 */
    public isSupport = (): boolean => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            return true;
        } else {
            return false;
        }
    }

    /** 设置采集视频束 */
    public setVideoConstraints = (key: string, value: any) => {
        this._constraints.video[key] = value;
    }


    /** 获取媒体数据 */
    public getUserMedia = async (constraints: MediaStreamConstraints = this._constraints): Promise<MediaStream> => {
        try {
            const result: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this._mediaStream = result;
            return result;
        } catch (e) {
            this._printErrorMsg(`获取媒体数据`, e);
        }
    }

    /** 获取设备信息 */
    public enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
        try {
            const result: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
            return result;
        } catch (e) {
            this._printErrorMsg(`获取设备信息`, e);
        }
    }

    /** 获取媒体信息 */
    public getMediaSettings = (): MediaTrackSettings[] => {
        const mediaStreamTracks: MediaStreamTrack[] = this._mediaStream.getTracks();
        const result: Array<MediaTrackSettings> = [];
        mediaStreamTracks.forEach((track: MediaStreamTrack) => {
            const setting: MediaTrackSettings = track.getSettings();
            result.push(setting);
        });
        return result;
    }

    /** 
     * 获取视频信息
     *  */
    public getVideoSettings = (): Array<MediaTrackSettings> => {
        const result: Array<MediaTrackSettings> = [];
        const videoStreamTracks: MediaStreamTrack[] = this._mediaStream.getVideoTracks();
        videoStreamTracks.forEach((track: MediaStreamTrack) => {
            const setting: MediaTrackSettings = track.getSettings();
            result.push(setting);
        });
        return result;
    }

    /** 获取视频轨 */
    public getVideoTracks = (): MediaStreamTrack[] => {
        const result: Array<MediaStreamTrack> = this._mediaStream.getVideoTracks();
        return result;
    }

    /** 获取音频轨 */
    public getAudioTracks = (): MediaStreamTrack[] => {
        const result: Array<MediaStreamTrack> = this._mediaStream.getAudioTracks();
        return result;
    }

    /** 播放
     * @param videoPlayer:video的dom
     */
    public play = async (videoPlayer) => {
        try {
            const mediaStream: MediaStream = await this.getUserMedia();
            if ("srcObject" in videoPlayer) {
                videoPlayer.srcObject = mediaStream;
            } else {
                const src = window.URL && window.URL.createObjectURL(mediaStream) || mediaStream;
                videoPlayer.src = src;
            }
            videoPlayer.play();
        } catch {
            this._printErrorMsg(`播放错误`, '播放错误');
        }
    }

    /** 停止 */
    public stop = () => {
        const mediaStreamTracks: Array<MediaStreamTrack> = this.getVideoTracks();
        mediaStreamTracks.forEach((track: MediaStreamTrack) => {
            track.stop();
        });
    }

    /** 视频录制开始 */
    public videoRecordStart = () => {
        try {
            this._mediaRecorder = new MediaRecorder(this._mediaStream, this._mediaRecorderOption);
            console.log(this._mediaRecorder);
            if (!this._isTypeSupportedMediaRecord(this._mediaRecorderOption.minType)) {
                this._printErrorMsg(`minType 不支持`, {});
                return;
            }
        } catch (e) {
            this._printErrorMsg(`MediaRecorder`, e);
        }

        this._mediaRecorder.ondataavailable = (e) => {
            this._recorderBuffer.push(e.data);
        }
        /** 事件片(毫秒) */
        const ms: number = 1000;
        this._mediaRecorder.start(ms);
    }

    /** 视频录制停止 */
    public videoRecordStop = (): string => {
        this._mediaRecorder.stop();
        const blob = new Blob(this._recorderBuffer, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        return url;
    }

    /** 录制视频格式支持 */
    private _isTypeSupportedMediaRecord = (testType: string): boolean => {
        const types: Array<string> = [
            'video/mp4',
            'video/webm',
            'video/webm;codecs=vp8',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8.0',
            'video/webm;codecs=vp9.0',
            'video/webm;codecs=h264',
            'video/webm;codecs=H264',
            'video/webm;codecs=avc1',
            'video/webm;codecs=vp8,opus',
            'video/WEBM;codecs=VP8,OPUS',
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,vp9,opus',
            'video/webm;codecs=h264,opus',
            'video/webm;codecs=h264,vp9,opus',
            'video/x-matroska;codecs=avc1',
            'audio/webm',
            'audio/webm;codecs=opus',
        ];

        for (var i in types) {
            console.log("Is " + types[i] + ":" + (MediaRecorder.isTypeSupported(types[i]) ? "yes" : "no"));
        }

        return MediaRecorder.isTypeSupported(testType);
    }

    /** 下载视频 */



    /** 打印错误数据 */
    private _printErrorMsg = (title: string, msg: any): void => {
        const message: string = `${title}-出错:${msg}`;
        console.log(`${title}出错:`);
        console.log(msg);
        alert(message);
        this._printMsg.print(msg, message, true);
    }

}