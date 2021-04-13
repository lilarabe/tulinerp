import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { WebrtcService } from '../../../serves/webrtc.service';
import { FaceApiService } from '../../../serves/face-api.service';
declare var faceapi: any;


@Component({
  selector: 'face-description',
  templateUrl: 'face-description.html'
})
export class FaceDescriptionComponent {

  @ViewChild('video') videoRef: ElementRef;
  @ViewChild('videoCanvas') videoCanvasRef: ElementRef;
  /** 采集结果事件 */
  @Output() resultEvent: EventEmitter<FaceDescription> = new EventEmitter();

  private _facingMode: string = 'user';

  /** 用户面部特征 */
  private _userDescriptor: FaceDescription = {
    descriptor: [],
    gender: '',
    age: 0,
    score: 0,
    base64: '',
    name: '',
  };

  constructor(
    private _rtc: WebrtcService,
    private _faceApiService: FaceApiService,
  ) {
  }

  ngOnInit() {
    this._faceCollect();
    this._play();
  }

  ngOnDestroy() {
    this._rtc.stop();
  }

  /** 播放 */
  private _play = () => {
    this._rtc.play(this.videoRef.nativeElement);
  }

  /** 采集 */
  private _faceCollect = async () => {
    await this._faceApiService.loadModel();
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const canvas = this.videoCanvasRef.nativeElement;
    const videoEl = this.videoRef.nativeElement;
    canvas.width = videoEl.width;
    canvas.height = videoEl.height;
    let count: number = 0;

    const inputEl = videoEl;

    const fetchDescriptor = async () => {

      count++;
      /** 探测结果 */
      let detectResult = await faceapi.detectAllFaces(inputEl, options)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      const displaySize = faceapi.matchDimensions(canvas, inputEl, true);
      const resizedResults = faceapi.resizeResults(detectResult, displaySize);
      faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detectResult, displaySize));

      const minProbability = 0.05;
      faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability);


      if (detectResult.length === 1 && detectResult[0].detection.score > 0.8) {

        // const detections = await faceapi.detectAllFaces(inputEl, options)
        // const canvasImages = await faceapi.extractFaces(inputEl, detections);
        // const base64Code: string = canvasImages[0].toDataURL('image/jpeg', 1);

        canvas.getContext("2d").drawImage(inputEl, 0, 0, canvas.width, canvas.height);
        const base64Code: string = canvas.toDataURL('image/jpeg', 1);

        const result: FaceDescription = {
          descriptor: detectResult[0].descriptor,
          gender: detectResult[0].gender,
          age: detectResult[0].age,
          score: detectResult[0].detection.score,
          base64: base64Code,
          count: count
        };

        this._userDescriptor = result;
        this._rtc.stop();
        return;

      } else {
        detectResult = null;
        await fetchDescriptor();
      }

    }

    await fetchDescriptor();

    this.resultEvent.emit(this._userDescriptor);

  }
  

  /** 切换摄像头 */
  public reverseCamera = () => {
    this._facingMode = this._facingMode === 'user' ? 'environment' : 'user';
    this._rtc.setVideoConstraints('facingMode', this._facingMode);
    this._play();
  }

}

/** 用户面部特征 */
export interface FaceDescription {
  /** 特征ID */
  descriptor?: any,
  /** 性别 */
  gender?: 'male' | 'female' | '',
  /** 年龄 */
  age?: number,
  /** 相似度 0~1 */
  score?: number,
  /** base64 */
  base64?: string,
  /** name */
  name?: string,
  /** 采集次数 */
  count?: number,
}
