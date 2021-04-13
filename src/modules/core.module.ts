import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { ToolsProvider } from '../serves/tools.service';
import { FormValidatorsService } from '../serves/form-validators.service';
import { LocalStorageService } from '../serves/local-storage.service';
import { SessionStorageService } from '../serves/session-storage.service';
import { AjaxService } from '../serves/ajax.service';
import { StringCodeService } from '../serves/string-code.service';
import { FileUpLoaderService } from '../serves/file-up-loader.service';
import { CanvasBase64Service } from '../serves/canvas-base64.service';
import { IndexedDbService } from '../serves/indexed-db.service';
import { LoginProvider } from '../providers/login/login';
import { CookieService } from '../serves/cookie.service';
import { TpProvider } from '../providers/tp/tp';
import { WebSocketService } from '../serves/websocket.service';
import { MsgService } from '../serves/msg.service';
import { I18nService } from '../serves/i18n.service';
import { HotCodeService } from '../serves/native/hot-code.service';
import { FileProvider } from '../serves/native/file';
import { MediaProvider } from '../serves/native/media';
import { BrowserProvider } from "../serves/native/browser";
import { AppProvider } from "../serves/native/app";
import { WxV3NativeProvider } from "../serves/native/wx-v3";
import { DownloadService } from '../serves/native/download.service';
import { PhotoLibraryService } from '../serves/native/photoLibrary.service';
import { ApprovalProvider } from '../providers/approval/approval';
import { IonicStorageService } from '../serves/ionic-storage.service';
import { DebugService } from '../serves/debug.service';
import { PrintMsgService } from '../components/print-msg/print-msg';
import { ChineseMoneyFormatService } from '../serves/chinese-money-format.service';
import { JpushService } from '../serves/native/jpush';
import { DeviceService } from '../serves/native/device';
import { FaceApiService } from '../serves/face-api.service';
import { OpenBrowserProvider } from '../providers/open-browser/open-browser';
import { GeolocationService } from '../serves/native/geolocation.service';
import { ServiceWorkerService } from '../serves/service-worker.service';
import { SseService } from '../serves/sse.service';
import { VideoService } from '../serves/native/video';
import { BaiduMapService } from '../serves/baidu-map.service';
import { WebrtcService } from '../serves/webrtc.service';
import { SocketIoService } from '../serves/socket-io.service';
import { WxJsSdkService } from '../serves/wx-js-sdk.service';
import { WxService } from '../serves/wx.service';
import { DataInformService } from '../providers/multifile/dataInform.service';


@NgModule({
  providers: [
    ToolsProvider,
    FormValidatorsService,
    LocalStorageService,
    SessionStorageService,
    AjaxService,
    StringCodeService,
    FileUpLoaderService,
    CanvasBase64Service,
    IndexedDbService,
    LoginProvider,
    CookieService,
    TpProvider,
    WebSocketService,
    MsgService,
    I18nService,
    HotCodeService,
    FileProvider,
    MediaProvider,
    BrowserProvider,
    AppProvider,
    WxV3NativeProvider,
    DownloadService,
    PhotoLibraryService,
    ApprovalProvider,
    IonicStorageService,
    DebugService,
    PrintMsgService,
    ChineseMoneyFormatService,
    JpushService,
    DeviceService,
    FaceApiService,
    OpenBrowserProvider,
    GeolocationService,
    ServiceWorkerService,
    SseService,
    VideoService,
    BaiduMapService,
    WebrtcService,
    SocketIoService,
    WxJsSdkService,
    WxService,
    DataInformService,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    sanitizer: DomSanitizer) {
    if (parentModule) {
      throw new Error('CoreModule 已经装载，请仅在 AppModule 中引入该模块。');
    }
  }
}
