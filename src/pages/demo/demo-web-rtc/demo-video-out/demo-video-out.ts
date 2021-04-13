import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { WebrtcService } from '../../../../serves/webrtc.service';
// import { SocketIoService } from '../../../../serves/socket-io.service';



@Component({
  selector: 'page-demo-video-out',
  templateUrl: 'demo-video-out.html',
})
export class DemoVideoOutPage {

  @ViewChild('video') videoRef: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private _rtc: WebrtcService,
    // private _io: SocketIoService,
  ) {
  }

  // ionViewDidLoad() {

  //   const remotePc = new RTCPeerConnection({});

  //   this._io.connect();

  //   this._io.on('joined', (roomId: string, socketId: string) => {
  //     console.log(`加入房间成功.roomId:${roomId}, socketId:${socketId}`);
  //   });

  //   this._io.on('ready', async (roomId: string) => {
  //     console.log(`人齐了.roomId:${roomId}`);



  //     remotePc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
  //       console.log('candidate');
  //       console.log(e);
  //     };

  //     remotePc.ontrack = (e: RTCTrackEvent | any) => {
  //       const streams = e.streams;
  //       this.videoRef.nativeElement.srcObject = streams[0];
  //     };

  //   });

  //   this._io.on('offer', async (offer: RTCSessionDescriptionInit) => {
  //     console.log(offer);
  //     await remotePc.setRemoteDescription(new RTCSessionDescription(offer));
  //     const answer: RTCSessionDescriptionInit = await remotePc.createAnswer();
  //     this._io.emit('answer', answer);
  //   });

  //   this._io.emit('join', '111111');
  // }

  ionViewDidLeave() {
  }

}
