import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MsgService } from '../../../serves/msg.service';
import { IonicStorageService } from '../../../serves/ionic-storage.service';
import { FaceDescription } from '../../../components/face/face-description/face-description';



// @IonicPage()
@Component({
  selector: 'page-face-collect',
  templateUrl: 'face-collect.html',
})
export class FaceCollectPage {

  @ViewChild('video') videoRef: ElementRef;
  @ViewChild('videoCanvas') videoCanvasRef: ElementRef;

  constructor(
    private _ionicStorageService: IonicStorageService,
    private _msg: MsgService,
    private _navCtrl: NavController,
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewDidLeave() {
  }

  /** 获取脸部数据 */
  public getFaceDescription = async (faceDesc: FaceDescription) => {
    faceDesc.name = await this._ionicStorageService.get('login-username');
    await this._ionicStorageService.set('userDescriptor', faceDesc);
    console.log(faceDesc);
    this._msg.toast(`人脸采集完成`, 3000);
    this._navCtrl.pop();
  }

}
