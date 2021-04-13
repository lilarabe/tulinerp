import { Component } from '@angular/core';
import { MsgService } from '../../../serves/msg.service';
import { IonicStorageService } from '../../../serves/ionic-storage.service';
import { FaceDescription } from '../../../components/face/face-description/face-description';
import { FaceApiService } from '../../../serves/face-api.service';
// declare var faceapi: any;


// @IonicPage()
@Component({
  selector: 'page-face-matching',
  templateUrl: 'face-matching.html',
})
export class FaceMatchingPage {

  public isShow: boolean = true;

  public src1: string = '';
  public src2: string = '';

  constructor(
    private _msg: MsgService,
    private _ionicStorageService: IonicStorageService,
    private _faceApiService: FaceApiService,
  ) {
  }

  ionViewDidLoad() {
  }

  ionViewDidLeave() {
  }

  /** 获取脸部数据 */
  public getFaceDescription = async (faceDesc: FaceDescription) => {
    const startTime = +new Date();
    this.isShow = false;
    this._msg.toast(`人脸采集完成`, 2000);
    const userDescriptor = await this._ionicStorageService.get('userDescriptor');
    const imgEl1 = new Image();
    const imgEl2 = new Image();
    imgEl1.src = userDescriptor.base64;
    imgEl2.src = faceDesc.base64;
    
    // imgEl1.src = './assets/images/face/p1.jpg';
    // imgEl2.src = './assets/images/face/p4.jpg';

    this.src1 = imgEl1.src;
    this.src2 = imgEl2.src;

    const bestMatch = await this._faceApiService.twoPicMatch(imgEl1, imgEl2, userDescriptor.name);
    console.log(bestMatch);
    /** 差距 0~1 */
    let distance: number = 1;
    if(bestMatch){
      distance = bestMatch.distance;
    }
    const endTime = +new Date();
    alert(`耗时:${endTime - startTime}ms`);
    alert(`差距:${distance}`);
    if(distance < 0.5){
      alert(`匹配成功`);
    } else {
      alert(`匹配失败`);
    }
  }



}
