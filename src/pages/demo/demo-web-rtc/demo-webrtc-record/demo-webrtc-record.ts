import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebrtcService } from '../../../../serves/webrtc.service';



@Component({
  selector: 'page-demo-webrtc-record',
  templateUrl: 'demo-webrtc-record.html',
})
export class DemoWebrtcRecordPage {

  public isRecording: boolean = false;

  @ViewChild('video') videoRef: ElementRef;

  @ViewChild('recordvideo') recordVideoRef: ElementRef;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _rtc: WebrtcService,
    ) {
  }

  ionViewDidLoad() {
    this._rtc.play(this.videoRef.nativeElement);
  }

  ionViewDidLeave() {
    this._rtc.stop();
  }

  public startRecord = () => {
    this.isRecording = true;
    this._rtc.videoRecordStart();

  }

  public stopRecord = () => {
    const url = this._rtc.videoRecordStop();
    const outputEl = this.recordVideoRef.nativeElement;
    outputEl.src = url;
    outputEl.play();
    this.isRecording = false;

  }

}
