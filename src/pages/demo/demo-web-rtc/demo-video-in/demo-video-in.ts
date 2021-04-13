// import adapter from 'webrtc-adapter';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebrtcService } from '../../../../serves/webrtc.service';
// import { SocketIoService } from '../../../../serves/socket-io.service';
// declare const RTCPeerConnection: any;




@Component({
  selector: 'page-demo-video-in',
  templateUrl: 'demo-video-in.html',
})
export class DemoVideoInPage {

  @ViewChild('localVideo') localVideoRef: ElementRef;

  @ViewChild('remoteVideo') remoteVideoRef: ElementRef;

  public offerSDP: string = '';

  public answerSDP: string = '';

  public state: string = 'init';

  // private _localStream: MediaStream;

  // private _pc: RTCPeerConnection;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _rtc: WebrtcService,
    // private _io: SocketIoService,
  ) {
  }

  // async ionViewDidLoad() {
  //   this._rtc.play(this.localVideoRef.nativeElement);

  //   this._localStream = await this._rtc.getUserMedia();

  //   this._io.connect();

  //   this._io.on('joined', (roomId: string, userId: string) => {
  //     this.state = 'joined';
  //     console.log(`event: joined, roomId:${roomId}, userId:${userId}`);
  //     this._creatPeerConnection();
  //     console.log(`state: ${this.state}`);
  //   });

  //   this._io.on('otherjoin', (roomId: string, userId: string) => {
  //     if (this.state === 'joined_unbind') {
  //       this._creatPeerConnection();
  //     }
  //     this.state = 'joined_conn';
  //     console.log(`event: otherjoin, roomId:${roomId}, userId:${userId}`);
  //     console.log(`state: ${this.state}`);
  //   });

  //   this._io.on('full', (roomId: string, userId: string) => {
  //     console.log(`event: full, roomId:${roomId}, userId:${userId}`);
  //     this.state = 'leaved';
  //     console.log(`state: ${this.state}`);
  //   });

  //   this._io.on('leaved', (roomId: string, userId: string) => {
  //     console.log(`event: leaved, roomId:${roomId}, userId:${userId}`);
  //     this.state = 'leaved';
  //     console.log(`state: ${this.state}`);
  //   });

  //   this._io.on('bye', () => {
  //     console.log(`event: bye`);
  //     this.state = 'joined_unbind';
  //     console.log(`state: ${this.state}`);
  //   });

  //   this._io.on('message', async (roomId: string, data: any) => {
  //     console.log(`event: message, roomId:${roomId}, data:${data}`);
  //     if (data.type === 'offer') {
  //       this._pc.setRemoteDescription(new RTCSessionDescription());
  //     } else if (data.type === 'answer') {

  //     } else if (data.type === 'candidate') {

  //     } else {
  //       console.log(`error`);
  //     }
  //   });

  //   this._io.emit('join', '111111');



  // }

  ionViewDidLeave() {
    this._rtc.stop();
  }

  // private _call = async () => {
  //   if (this.state === 'joined_conn') {
  //     if (this._pc) {
  //       const offerOption: RTCOfferOptions = {
  //         offerToReceiveAudio: false,
  //         offerToReceiveVideo: true,
  //       };
  //       const offer: RTCSessionDescriptionInit = await this._pc.createOffer(offerOption);
  //       await this._pc.setLocalDescription(offer);
  //       this._io.emit('message', '111111', offer);
  //     }
  //   }
  // }

  // private _creatPeerConnection = () => {
  //   const pcConfig: RTCConfiguration = {
  //     iceTransportPolicy: "all",
  //     iceServers: [],
  //   };

  //   this._pc = new RTCPeerConnection(pcConfig);
  //   this._pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
  //     console.log(`candidate:`);
  //     console.log(e.candidate);
  //     if (e.candidate) {

  //     }
  //   };

  //   this._pc.ontrack = (e) => {
  //     this.remoteVideoRef.nativeElement.srcObject = e.streams[0];
  //   };


  //   this._localStream.getTracks().forEach(track => {
  //     this._pc.addTrack(track, this._localStream);
  //   });


  // }



}
