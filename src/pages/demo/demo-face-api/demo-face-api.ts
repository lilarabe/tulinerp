import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PrintMsgService } from '../../../components/print-msg/print-msg';
import { FaceApiService } from '../../../serves/face-api.service';
declare var faceapi;



@Component({
  selector: 'page-demo-face-api',
  templateUrl: 'demo-face-api.html',
})
export class DemoFaceApiPage {

  private _debug: boolean = true;

  @ViewChild('img') imgRef: ElementRef;
  @ViewChild('canvas') canvasRef: ElementRef;

  @ViewChild('img1') imgRef1: ElementRef;
  @ViewChild('canvas1') canvasRef1: ElementRef;

  @ViewChild('img2') imgRef2: ElementRef;
  @ViewChild('canvas2') canvasRef2: ElementRef;

  public base64Code: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _printMsgService: PrintMsgService,
    private _faceApiService: FaceApiService,
  ) {
    this._faceApiService.loadModel();
  }

  ionViewDidLoad() {
    this._run();
  }

  private _updateResults = async () => {
    if (!this._isFaceDetectionModelLoaded()) {
      return;
    }
    // ssd_mobilenetv1 options
    let minConfidence = 0.5
    // tiny_face_detector options
    // let inputSize = 512
    // let scoreThreshold = 0.5
    //mtcnn options
    // let minFaceSize = 20

    const inputImgEl = this.imgRef.nativeElement;
    // this._printMsgService.print(inputImgEl, 'face-api input', this._debug);
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence });
    // const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
    // const options = new faceapi.MtcnnOptions({ minFaceSize });
    // console.log(options);
    // this._printMsgService.print(options, 'face-api options', this._debug);
    const results = await faceapi.detectAllFaces(inputImgEl, options);
    // this._printMsgService.print(results, 'face-api结果', this._debug);
  
    
    const canvas = this.canvasRef.nativeElement;
    faceapi.matchDimensions(canvas, inputImgEl);
    const resizedResults = faceapi.resizeResults(results, inputImgEl);
    faceapi.draw.drawDetections(canvas, resizedResults);

    
    const startTime = +new Date();
    const input1 = this.imgRef1.nativeElement;
    const results1 = await faceapi.detectAllFaces(input1, options).withFaceLandmarks().withFaceDescriptors();
    const canvas1 = this.canvasRef1.nativeElement;
    faceapi.matchDimensions(canvas1, input1);
    const resizedResults1 = faceapi.resizeResults(results1, input1);
    faceapi.draw.drawDetections(canvas1, resizedResults1);
    console.log(results1);
    if (!results1.length) {
      return;
    }
    const faceMatcher = new faceapi.FaceMatcher(results1);
    console.log(faceMatcher);

    const input2 = this.imgRef2.nativeElement;
    const results2 = await faceapi.detectAllFaces(input2, options).withFaceLandmarks().withFaceDescriptors();
    console.log(results2);
    const endTime = +new Date();
    if (results2) {
      const bestMatch = faceMatcher.findBestMatch(results2[0].descriptor)
      console.log(bestMatch);
    }

    results2.forEach(fd => {
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
      console.log(bestMatch.toString())
    })

    this._printMsgService.print(`人脸对比耗时:${endTime - startTime}ms`,'',this._debug);


  }

  private _run = async () => {
    const MODEL_URL = 'http://hotcode.tulindev.com:85/assets/face_weights';
    // const MODEL_URL = 'https://hotfix.quanzhuejia.com/assets/face_weights';
    // const MODEL_URL = './assets/face_weights';
    console.log(faceapi.nets);
    const startTime = +new Date();
    this._printMsgService.print('开始加载文件','',this._debug);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    const endTime = +new Date();
    this._printMsgService.print(`加载文件完成耗时：${endTime - startTime}ms`,'',this._debug);

    // const MODEL_PATH = './assets/face_weights';
    // await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    // await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH)
    // await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    
    // await faceapi.loadFaceDetectionModel(MODEL_URL);
    // await faceapi.loadFaceLandmarkModel(MODEL_URL);
    // await faceapi.loadFaceRecognitionModel(MODEL_URL);
    // await faceapi.loadAgeGenderModel(MODEL_URL);
    // await faceapi.loadTinyYolov2Model(MODEL_URL);
    // start processing image
    this._updateResults();
  }

  private _isFaceDetectionModelLoaded = (): boolean => {
    return !!this._getCurrentFaceDetectionNet().params;
  }

  private _getCurrentFaceDetectionNet = () => {
    return faceapi.nets.ssdMobilenetv1;
  }


}
