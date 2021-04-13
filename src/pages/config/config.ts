import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigDebugPage } from './config-debug/config-debug';
import { ConfigStoragePage } from './config-storage/config-storage';
import { DemoPage } from '../demo/demo';
import { ConfigHotcodePage } from './config-hotcode/config-hotcode';
import { ConfigJpushPage } from './config-jpush/config-jpush';
import { DemoWebrtcVideoPage } from '../demo/demo-web-rtc/demo-webrtc-video/demo-webrtc-video';
import { FaceCollectPage } from '../face/face-collect/face-collect';
import { FaceMatchingPage } from '../face/face-matching/face-matching';
import { DemoWebrtcRecordPage } from '../demo/demo-web-rtc/demo-webrtc-record/demo-webrtc-record';
import { DemoVideoInPage } from '../demo/demo-web-rtc/demo-video-in/demo-video-in';
import { DemoVideoOutPage } from '../demo/demo-web-rtc/demo-video-out/demo-video-out';


// @IonicPage({
//   name: 'config',
//   segment: 'config'
// })
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(private _navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  public pushConfigDebug = () => {
    this._navCtrl.push(ConfigDebugPage);
  }

  public pushConfigStorage = () => {
    this._navCtrl.push(ConfigStoragePage);
  }

  public pushDemoPage = () => {
    this._navCtrl.push(DemoPage);
  }

  public pushHotCode = () => {
    this._navCtrl.push(ConfigHotcodePage);
  }

  public pushJpush = () => {
    this._navCtrl.push(ConfigJpushPage);
  }

  public pushVideo = () => {
    this._navCtrl.push(DemoWebrtcVideoPage);
  }

  public pushFaceCollect = () => {
    this._navCtrl.push(FaceCollectPage);
  }

  public pushFaceMatching = () => {
    this._navCtrl.push(FaceMatchingPage);
  }

  public pushVideoRecord = () => {
    this._navCtrl.push(DemoWebrtcRecordPage);
  }

  public pushVideoIn = () => {
    this._navCtrl.push(DemoVideoInPage);
  }

  public pushVideoOut = () => {
    this._navCtrl.push(DemoVideoOutPage);
  }

}
