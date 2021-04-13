import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebrtcService } from '../../../../serves/webrtc.service';
import { PrintMsgService } from '../../../../components/print-msg/print-msg';
import { TpProvider } from '../../../../providers/tp/tp';


@Component({
  selector: 'page-demo-webrtc-video',
  templateUrl: 'demo-webrtc-video.html',
})
export class DemoWebrtcVideoPage {

  @ViewChild('video') videoRef: ElementRef;

  public tempSrc = 'https://www.w3school.com.cn/i/movie.ogg';

  public videoSetting = {
    video: {
      width: { title: '宽度设置', key: 'width', value: 0, min: 0, max: 1080, step: 120 },
      height: { title: '高度设置', key: 'height', value: 0, min: 0, max: 1080, step: 120 },
      frameRate: { title: '帧频设置', key: 'frameRate', value: 0, min: 10, max: 60, step: 10 },
      facingMode: { title: '摄像头设置', key: 'facingMode', value: 'user' },
    }
  };
  /** 当前设置 */
  public thisSetting = { title: '', key: '', value: 0, min: 0, max: 1, step: 1 };
  public isSettingShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _rtc: WebrtcService,
    private _printMsg: PrintMsgService,
    private _tp: TpProvider,
  ) {
  }

  ionViewDidLoad() {
    this.play();
  }

  /** 验证是否支持 getUserMedia */
  public testSupport = () => {
    if (!this._rtc.isSupport()) {
      alert('不支持 getUserMedia');
    } else {
      alert('支持 getUserMedia');
    }
  }

  /** 展示设备信息 */
  public showDevices = async () => {
    const mediaDeviceInfo: MediaDeviceInfo[] = await this._rtc.enumerateDevices();
    this._printMsg.print(mediaDeviceInfo, '设备信息', true);
  }

  /** 展示视频信息 */
  public showVideoInfo = async () => {
    const mediaInfo: MediaTrackSettings[] = this._rtc.getMediaSettings();
    this._printMsg.print(mediaInfo, '当前视频束', true);
  }

  /** 切换摄像头 */
  public reverseCamera = () => {
    this.videoSetting.video.facingMode.value = this.videoSetting.video.facingMode.value === 'user' ? 'environment' : 'user';
    this._rtc.setVideoConstraints('facingMode', this.videoSetting.video.facingMode.value);
    this.play();
  }

  /** 展示视频轨 */
  public showVideoTracks = () => {
    const result: Array<any> = [];
    const mediaStreamTracks: MediaStreamTrack[] = this._rtc.getVideoTracks();
    mediaStreamTracks.forEach((track: MediaStreamTrack) => {
      const printInfo = {};
      for (const key in track) {
        printInfo[key] = track[key];
      }
      result.push(printInfo);
    });
    this._printMsg.print(result, '当前视频轨', true);
  }

  /** 展示音频轨 */
  public showAudioTracks = () => {
    const result: Array<any> = [];
    const mediaStreamTracks: MediaStreamTrack[] = this._rtc.getAudioTracks();
    mediaStreamTracks.forEach((track: MediaStreamTrack) => {
      const printInfo = {};
      for (const key in track) {
        printInfo[key] = track[key];
      }
      result.push(printInfo);
    });
    this._printMsg.print(result, '当前音频轨', true);
  }

  /** 拍照 */
  public getPicture = () => {
    const canvas = document.createElement("canvas");
    const videoSetting: MediaTrackSettings = this._rtc.getVideoSettings()[0];
    const width:number = videoSetting.width;
    const height:number = videoSetting.height;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(this.videoRef.nativeElement, 0, 0, width, height);
    const base64Code:string = canvas.toDataURL('image/jpeg', 1);
    this._tp.openPreviewImageModal([{src:base64Code}]);
  }

  /** 录制视频 */
  public getVideo = () => {

  }

  /** 设置采集视频束 */
  public setVideoConstraints = (key: string) => {
    this.isSettingShow = true;
    this.thisSetting = this.videoSetting.video[key];
  }

  public setChangeValue = (value: number) => {
    this.thisSetting.value = value;
    this._rtc.setVideoConstraints(this.thisSetting.key, this.thisSetting.value);
    this.play();
  }


  /** 播放 */
  public play = () => {
    this._rtc.getUserMedia().then((mediaStream: MediaStream) => {
      // const videoPlayer: any = document.querySelector('video#videoPlayer');
      const videoPlayer: any = this.videoRef.nativeElement;
      if ("srcObject" in videoPlayer) {
        videoPlayer.srcObject = mediaStream;
      } else {
        const src = window.URL && window.URL.createObjectURL(mediaStream) || mediaStream;
        videoPlayer.src = src;
      }
      videoPlayer.play();
    });
  }



}
