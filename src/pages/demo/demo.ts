import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IframePage } from "../iframe/iframe";
import { BrowserProvider } from "../../serves/native/browser";
import { AppProvider } from "../../serves/native/app";
import { DemoWxPage } from './demo-wx/demo-wx';
import { CanvasBase64Service } from '../../serves/canvas-base64.service';
import { DemoJpushPage } from './demo-jpush/demo-jpush';
import { DemoDevicePage } from './demo-device/demo-device';
import { DemoFaceApiPage } from './demo-face-api/demo-face-api';
import { DemoVideoPage } from './demo-video/demo-video';
import { DemoWebRtcPage } from './demo-web-rtc/demo-web-rtc';



// @IonicPage({
//   name: 'demo',
//   segment: 'demo'
// })
@Component({
  selector: 'page-demo',
  templateUrl: 'demo.html',
})
export class DemoPage {

  sources = "http://static.videogular.com/assets/audios/videogular.mp3";

  public gridData = {
    cols: 4,
    itemData: [
      {
        colspan: 3,
        rowspan: 1,
        background:'lightpink',
      },
      {
        colspan: 2,
        rowspan: 2,
        background:'lightseagreen',
      },
      {
        colspan: 1,
        rowspan: 1,
        background:'lightyellow',
      },
      {
        colspan: 2,
        rowspan: 3,
        background:'lightslategrey',
      },
      {
        colspan: 1,
        rowspan: 1,
        background:'limegreen',
      },
    ]
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _browserProvider: BrowserProvider,
    private _app: AppProvider,
    private _canvasBase64Service:CanvasBase64Service,
  ) {
  }


  ionViewWillEnter() {
  }

  public getBase64 = (): void => {
    const path:string = 'assets/images/logo.png';
    // const path:string = 'http://da.tulindev.com:81/2.jpg';
    this._canvasBase64Service.getBase64Code(path).then((base64)=>{
      alert(base64);
    });
  }

  public openWebRTC = (): void => {
    this.navCtrl.push(DemoWebRtcPage);
  }


  public pushWxPage = (): void => {
    this.navCtrl.push(DemoWxPage);
  }


  public openFrame = (url: string = "http://www.baidu.com") => {
    this.navCtrl.push(IframePage, { url: url, title: "百度" });
  }

  public nativeBrowser = (url: string = "https://www.baidu.com"): void => {
    this._browserProvider.create(url);
  }

  public launchApp = (appName: string): void => {
    this._app.launchApp(appName).then(() => {

    });
  }


  public pushJpushPage = (): void => {
    this.navCtrl.push(DemoJpushPage);
  }

  public pushDevicePage = (): void => {
    this.navCtrl.push(DemoDevicePage);
  }

  public pushFaceApiPage = ():void => {
    this.navCtrl.push(DemoFaceApiPage);
  }

  public pushVideoPage = ():void => {
    this.navCtrl.push(DemoVideoPage);
  }

}
