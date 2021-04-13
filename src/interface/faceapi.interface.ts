/** ssd 参数 */
export interface ISsdMobilenetv1Options {
    // minimum confidence threshold
    // default: 0.5
    minConfidence?: number

    // maximum number of faces to return
    // default: 100
    maxResults?: number
}

export interface TinyFaceDetectorOptions {
    // size at which image is processed, the smaller the faster,
    // but less precise in detecting smaller faces, must be divisible
    // by 32, common sizes are 128, 160, 224, 320, 416, 512, 608,
    // for face tracking via webcam I would recommend using smaller sizes,
    // e.g. 128, 160, for detecting smaller faces use larger sizes, e.g. 512, 608
    // default: 416
    inputSize?: number

    // minimum confidence threshold
    // default: 0.5
    scoreThreshold?: number
}

//Box
export interface Box {
    x: number
    y: number
    width: number
    height: number
}

// FaceDetection
export interface FaceDetection {
    score: number
    box: Box
}

// FaceLandmarks
export interface FaceLandmarks {
  positions: any[]
  shift: any
}

// WithFaceDetection
export type WithFaceDetection<TSource> = TSource & {
  detection: FaceDetection
}

// WithFaceLandmarks
export type WithFaceLandmarks<TSource> = TSource & {
  unshiftedLandmarks: FaceLandmarks
  landmarks: FaceLandmarks
  alignedRect: FaceDetection
}