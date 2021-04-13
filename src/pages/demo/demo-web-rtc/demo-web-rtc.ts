import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DemoWebrtcVideoPage } from './demo-webrtc-video/demo-webrtc-video';
import { WebrtcService } from '../../../serves/webrtc.service';




@Component({
  selector: 'page-demo-web-rtc',
  templateUrl: 'demo-web-rtc.html',
})
export class DemoWebRtcPage {

  public mediaDeviceInfo: Array<MediaDeviceInfo> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _rtc: WebrtcService,
  ) {
  }

  public toVideoDemo = () => {
    this.navCtrl.push(DemoWebrtcVideoPage);
  }

  ionViewDidLoad() {
    this._rtc.enumerateDevices().then((res: MediaDeviceInfo[]) => {
      this.mediaDeviceInfo = res;
    });
  }

}
