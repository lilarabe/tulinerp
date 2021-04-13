import { NgModule } from '@angular/core';

/** 设备 */
import { Device } from '@ionic-native/device';
/* 极光推送 */
import { JPush } from '@jiguang-ionic/jpush';
/* 热更新 */
import { HotCodePush } from '@ionic-native/hot-code-push';
/* 地理定位 */
import { Geolocation } from '@ionic-native/geolocation';
/* 屏幕方向 */
import { ScreenOrientation } from '@ionic-native/screen-orientation';
/* 网络 */
//import { Network } from '@ionic-native/network';
/* 视频，音频 */
import { MediaCapture } from '@ionic-native/media-capture';
/* 文件 */
import { File } from '@ionic-native/file';
/* 音频 */
// import { Media } from '@ionic-native/media';
/** 视频编辑 */
import { VideoEditor } from '@ionic-native/video-editor';
/** base64 */
// import { Base64 } from '@ionic-native/base64';
/** 文件传输 */
import { FileTransfer } from '@ionic-native/file-transfer';
/** 应用版本 */
//import { AppVersion } from '@ionic-native/app-version';
/** 文件打开 */
import { FileOpener } from '@ionic-native/file-opener';
/** 启用浏览器 */
import { InAppBrowser } from '@ionic-native/in-app-browser';
/** 相机 */
import { Camera } from '@ionic-native/camera';
/** 主题化浏览器 */
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
/** 验证是否安装其他的app */
import { AppAvailability } from '@ionic-native/app-availability';
/** 微信分享，支付等 */
import { WechatChenyu } from "wechat-chenyu";
/** 相册操作 */
// import { PhotoLibrary } from '@ionic-native/photo-library';
/** 二维码 */
import { QRScanner } from '@ionic-native/qr-scanner';
/** 诊断 */
// import { Diagnostic } from '@ionic-native/diagnostic';
/** 相机预览 */
// import { CameraPreview } from '@ionic-native/camera-preview';
/** 键盘 */
// import { Keyboard } from '@ionic-native/keyboard';
/** android 权限 */
import { AndroidPermissions } from '@ionic-native/android-permissions';




@NgModule({
  providers: [
    Device,
    JPush,
    HotCodePush,
    Geolocation,
    ScreenOrientation,
    // Network,
    Camera,
    MediaCapture,
    File,
    //  Media,
    VideoEditor,
    // Base64,
    FileTransfer,
    // AppVersion,
    FileOpener,
    InAppBrowser,
    ThemeableBrowser,
    AppAvailability,
    WechatChenyu,
    // PhotoLibrary,
    QRScanner,
    // Diagnostic,
    // CameraPreview,
    // Keyboard,
    AndroidPermissions,
  ],
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class NativeModule { }
