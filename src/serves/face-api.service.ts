import { Injectable } from '@angular/core';
import { MsgService } from './msg.service';
import { ISsdMobilenetv1Options } from '../interface/faceapi.interface';
// import { TinyFaceDetectorOptions } from '../interface/faceapi.interface';


declare let faceapi: any;
/** 模块加载地址 */
const MODEL_URL: string = 'http://hotcode.tulindev.com:85/assets/face_weights';
// const MODEL_URL = 'https://hotfix.quanzhuejia.com/assets/face_weights';
/** 解析器类型: ssd_mobilenetv1 tiny_face_detector mtcnn */
let selectedFaceDetector: string = 'ssd_mobilenetv1';

/**
 * face-api.js 人脸识别
 */
@Injectable()
export class FaceApiService {

    private _ssdOptions: ISsdMobilenetv1Options = { minConfidence: 0.5 };

    // private _tinyOptions: TinyFaceDetectorOptions = { inputSize: 320 };


    constructor(
        private _msg: MsgService,
    ) {
    }

    /** 加载模块 */
    public loadModel = async (): Promise<boolean> => {
        const loader = this._msg.loading('模块加载中...');
        loader.present();
        try {
            const startTime: number = +new Date();
            if (selectedFaceDetector === 'ssd_mobilenetv1') {
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            } else if (selectedFaceDetector === 'tiny_face_detector') {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            } else if (selectedFaceDetector === 'mtcnn') {

            } else {
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            }
            /** 面部标识 */
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            /** 人脸识别 */
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            /** 年龄性别 */
            await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
            /** 表情 */
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            const endTime: number = +new Date();
            loader.dismiss();
            this._msg.toast(`加载模块耗时：${endTime - startTime}ms`);
            return Promise.resolve(true);
        } catch {
            loader.dismiss();
            this._msg.toast(`加载模块失败`);
            return Promise.reject(false);
        }

    }

    /** 获取媒体中所有人脸数据
     * @param inputEl: video/image dom
     */
    public detectAllFaces = async (inputEl) => {
        const detectResult = await faceapi.detectAllFaces(inputEl, this._ssdOptions);
        return detectResult;
    }

    /** 两张图片对比 
     * @param img1 : 图片1 dom
     * @param img2 : 图片2 dom
     * @param lable : lable
    */
    public twoPicMatch = async (img1, img2, lable: string = '') => {

        // const startTime = +new Date();
        const singleResult1 = await faceapi.detectSingleFace(img1)
            .withFaceLandmarks()
            .withFaceDescriptor();

        const singleResult2 = await faceapi.detectSingleFace(img2)
            .withFaceLandmarks()
            .withFaceDescriptor();

        const labeledDescriptors = [
            new faceapi.LabeledFaceDescriptors(lable, [singleResult1.descriptor])
        ];

        if (singleResult1 && singleResult2) {
            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            const bestMatch = faceMatcher.findBestMatch(singleResult2.descriptor);
            return bestMatch;
        } else {
            return null;
        }
    }

    /** 是否模块以加载 */
    public isModelLoaded = (): boolean => {
        return !!this._getCurrentFaceDetectionNet().params;
    }

    private _getCurrentFaceDetectionNet = () => {
        return faceapi.nets.ssdMobilenetv1;
    }

}