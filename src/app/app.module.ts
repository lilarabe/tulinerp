import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CoreModule } from '../modules/core.module';
import { SharedModule } from '../modules/shared.module';
import { NativeModule } from '../modules/native.module';

import { ComponentsModule } from '../components/components.module';

import { EditProvider } from '../providers/edit/edit';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ChartProvider } from '../providers/chart/chart';
import { DetailProvider } from '../providers/detail/detail';
import { ListProvider } from '../providers/list/list';
import { ApprovalProvider } from '../providers/approval/approval';
import { EditFormulaProvider } from '../providers/edit/edit-formula';
import { ToggleCompanyProvider } from '../providers/toggle-company/toggle-company';
import { EditRulesProvider } from '../providers/edit/edit-rules';
import { DetailRulesProvider } from '../providers/detail/detail-rules';
import { DetailFormulaProvider } from '../providers/detail/detail-formula';
import { DetailFieldsDisplayProvider } from '../providers/detail/detail-fields-display';
import { EditFieldsDisplayProvider } from '../providers/edit/edit-fields-display';
import { MenuProvider } from '../providers/menu/menu';



/** pages */
import { MenuPage } from '../pages/menu/menu';
import { ChartPage } from '../pages/chart/chart';
import { ConfigDebugPage } from '../pages/config/config-debug/config-debug';
import { ConfigHotcodePage } from '../pages/config/config-hotcode/config-hotcode';
import { ConfigJpushPage } from '../pages/config/config-jpush/config-jpush';
import { ConfigStoragePage } from '../pages/config/config-storage/config-storage';
import { ConfigPage } from '../pages/config/config';
import { DemoDevicePage } from '../pages/demo/demo-device/demo-device';
import { DemoFaceApiPage } from '../pages/demo/demo-face-api/demo-face-api';
import { DemoJpushPage } from '../pages/demo/demo-jpush/demo-jpush';
import { DemoVideoPage } from '../pages/demo/demo-video/demo-video';
import { DemoVideoInPage } from '../pages/demo/demo-web-rtc/demo-video-in/demo-video-in';
import { DemoVideoOutPage } from '../pages/demo/demo-web-rtc/demo-video-out/demo-video-out';
import { DemoWebrtcRecordPage } from '../pages/demo/demo-web-rtc/demo-webrtc-record/demo-webrtc-record';
import { DemoWebrtcVideoPage } from '../pages/demo/demo-web-rtc/demo-webrtc-video/demo-webrtc-video';
import { DemoWebRtcPage } from '../pages/demo/demo-web-rtc/demo-web-rtc';
import { DemoWxPage } from '../pages/demo/demo-wx/demo-wx';
import { DemoPage } from '../pages/demo/demo';
import { DetailPage } from '../pages/detail/detail';
import { DetailListPage } from '../pages/detail/detail-list/detail-list';
import { EditPage } from '../pages/edit/edit';
import { FaceCollectPage } from '../pages/face/face-collect/face-collect';
import { FaceMatchingPage } from '../pages/face/face-matching/face-matching';
import { HomePage } from '../pages/home/home';
import { IframePage } from '../pages/iframe/iframe';
import { InformDetailsPage } from '../pages/inform/inform-details/inform-details';
import { InformPage } from '../pages/inform/inform';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MessageListPage } from '../pages/message-list/message-list';
import { SelectPage } from '../pages/select/select';
import { MultilevelPage } from '../pages/multilevel/multilevel';
import { UserInfoPage } from '../pages/user/user-info/user-info';
import { UserPasswordPage } from '../pages/user/user-password/user-password';
import { UserSettingPage } from '../pages/user/user-setting/user-setting';
import { UserTogglePage } from '../pages/user/user-toggle/user-toggle';
import { UserPage } from '../pages/user/user';
import { WorkflowListPage } from '../pages/workflow/workflow-list/workflow-list';
import { WorkflowPage } from '../pages/workflow/workflow';
import { ChartDetailPage } from '../pages/chart/chart-detail/chart-detail';
import { TabsPage } from '../pages/tabs/tabs';




@NgModule({
  declarations: [
    MyApp,
    /** pages */
    MenuPage,
    ChartPage,
    ConfigDebugPage,
    ConfigHotcodePage,
    ConfigJpushPage,
    ConfigStoragePage,
    ConfigPage,
    DemoDevicePage,
    DemoFaceApiPage,
    DemoJpushPage,
    DemoVideoPage,
    DemoVideoInPage,
    DemoVideoOutPage,
    DemoWebrtcRecordPage,
    DemoWebrtcVideoPage,
    DemoWebRtcPage,
    DemoWxPage,
    DemoPage,
    DetailPage,
    EditPage,
    FaceCollectPage,
    FaceMatchingPage,
    HomePage,
    IframePage,
    InformDetailsPage,
    InformPage,
    ListPage,
    LoginPage,
    MessageListPage,
    SelectPage,
    MultilevelPage,
    UserInfoPage,
    UserPasswordPage,
    UserSettingPage,
    UserTogglePage,
    UserPage,
    WorkflowListPage,
    WorkflowPage,
    ChartDetailPage,
    TabsPage,
    DetailListPage,
  ],
  entryComponents: [
    MyApp,
    /** pages */
    MenuPage,
    ChartPage,
    ConfigDebugPage,
    ConfigHotcodePage,
    ConfigJpushPage,
    ConfigStoragePage,
    ConfigPage,
    DemoDevicePage,
    DemoFaceApiPage,
    DemoJpushPage,
    DemoVideoPage,
    DemoVideoInPage,
    DemoVideoOutPage,
    DemoWebrtcRecordPage,
    DemoWebrtcVideoPage,
    DemoWebRtcPage,
    DemoWxPage,
    DemoPage,
    DetailPage,
    EditPage,
    FaceCollectPage,
    FaceMatchingPage,
    HomePage,
    IframePage,
    InformDetailsPage,
    InformPage,
    ListPage,
    LoginPage,
    MessageListPage,
    SelectPage,
    MultilevelPage,
    UserInfoPage,
    UserPasswordPage,
    UserSettingPage,
    UserTogglePage,
    UserPage,
    WorkflowListPage,
    WorkflowPage,
    ChartDetailPage,
    TabsPage,
    DetailListPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    ComponentsModule,
    NativeModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'ios',//  在整个应用程序中为所有图标使用的模式。可用选项："ios"，"md"
      mode: 'ios',//在整个应用程序中使用的模式。
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'ios-transition',
      // pageTransition: 'md-transition',
      /** 子页是否隐藏 tabs */
      tabsHideOnSubPages: true,
      preloadModules: true,
      scrollAssist: true, // 开启软键盘
      autoFocusAssist: true,// 开启软键盘
    }),
    IonicStorageModule.forRoot({
      // driverOrder: ['indexeddb', 'websql', 'localstorage']
    }),
  ],
  bootstrap: [IonicApp],
  
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EditProvider,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    },
    ChartProvider,
    DetailProvider,
    ListProvider,
    ApprovalProvider,
    EditFormulaProvider,
    ToggleCompanyProvider,
    EditRulesProvider,
    DetailRulesProvider,
    DetailFormulaProvider,
    DetailFieldsDisplayProvider,
    EditFieldsDisplayProvider,
    MenuProvider,
    // OpenBrowserProvider,
  ]
})
export class AppModule { }
