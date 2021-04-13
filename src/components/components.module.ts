import { NgModule } from '@angular/core';
import { SharedModule } from '../modules/shared.module';
/** 编辑页组件 */

import { EditorSegmentComponent } from './editor/editor-segment/editor-segment';
import { EditorTabsComponent } from './editor/editor-tabs/editor-tabs';

import { EditPublicLableComponent } from './edit-items/public/edit-public-lable/edit-public-lable';
import { EditItemsComponent } from './edit-items/edit-items';
import { EditItemComponent } from './edit-items/edit-item/edit-item';
import { EditMobileComponent } from './edit-items/edit-mobile/edit-mobile';
import { EditInputComponent } from './edit-items/edit-input/edit-input';
import { EditSelectComponent } from './edit-items/edit-select/edit-select';
import { EditDateComponent } from './edit-items/edit-date/edit-date';
import { EditToggleComponent } from './edit-items/edit-toggle/edit-toggle';
import { EditCameraComponent } from './edit-items/edit-camera/edit-camera';
import { EditSheetlinkComponent } from './edit-items/edit-sheetlink/edit-sheetlink';
import { EditHiddenComponent } from './edit-items/edit-hidden/edit-hidden';
import { EditTextareaComponent } from './edit-items/edit-textarea/edit-textarea';
import { EditAutocompleteComponent } from './edit-items/edit-autocomplete/edit-autocomplete';
import { EditAutocompleteSelectComponent } from './edit-items/edit-autocomplete/edit-autocomplete-select/edit-autocomplete-select';
import { EditDatetimeComponent } from './edit-items/edit-datetime/edit-datetime';
import { EditRadioboxComponent } from './edit-items/edit-radiobox/edit-radiobox';
import { EditSignComponent } from './edit-items/edit-sign/edit-sign';
import { EditCardComponent } from './edit-items/edit-card/edit-card';
import { EditMultiselectComponent } from './edit-items/edit-multiselect/edit-multiselect';
import { EditTextareaEditComponent } from './edit-items/edit-textarea/edit-textarea-edit/edit-textarea-edit';
import { EditAudioComponent } from './edit-items/edit-audio/edit-audio';
import { EditVideoComponent } from './edit-items/edit-video/edit-video';
import { EditTagselectComponent } from './edit-items/edit-tagselect/edit-tagselect';
import { EditTagmultiselectComponent } from './edit-items/edit-tagmultiselect/edit-tagmultiselect';
import { EditMultisheetlinkComponent } from './edit-items/edit-multisheetlink/edit-multisheetlink';
import { EditMultisheetlinkSelectComponent } from './edit-items/edit-multisheetlink/edit-multisheetlink-select/edit-multisheetlink-select';
import { EditMultisheetlinkSelectItemsComponent } from './edit-items/edit-multisheetlink/edit-multisheetlink-select-items/edit-multisheetlink-select-items';
import { EditPublicStateComponent } from './edit-items/public/edit-public-state/edit-public-state';
import { EditFileComponent } from './edit-items/edit-file/edit-file';
import { EditGpsComponent } from './edit-items/edit-gps/edit-gps';
import { EditIntComponent } from './edit-items/edit-int/edit-int';
import { EditDecimalComponent } from './edit-items/edit-decimal/edit-decimal';
import { EditCurrencyComponent } from './edit-items/edit-currency/edit-currency';
import { EditFaceidComponent } from './edit-items/edit-faceid/edit-faceid';
import { EditMultifileComponent } from './edit-items/edit-multifile/edit-multifile';
import { EditMultiimageComponent } from './edit-items/edit-multiimage/edit-multiimage';
import { EditPublicClearComponent } from './edit-items/public/edit-public-clear/edit-public-clear';
import { EditMultilevelComponent } from './edit-items/edit-multilevel/edit-multilevel';
import { MultilevelSelectComponent } from './edit-items/edit-multilevel/multilevel-select/multilevel-select';
/** cordova 组件 */
import { NativeCameraComponent } from './native/native-camera/native-camera';
import { NativeAudioComponent } from './native/native-audio/native-audio';
import { NativeVideoComponent } from './native/native-video/native-video';
import { NativeQrScannerComponent } from './native/native-qr-scanner/native-qr-scanner';
import { NativeQrScannerModalComponent } from './native/native-qr-scanner/native-qr-scanner-modal/native-qr-scanner-modal';
/** 列表页组件 */
import { ListFilterComponent } from './list-filter/list-filter';
import { FilterItemComponent } from './list-filter/filter-item/filter-item';
import { FilterSelectComponent } from './list-filter/filter-select/filter-select';
import { FilterNumberComponent } from './list-filter/filter-number/filter-number';
import { FilterDateComponent } from './list-filter/filter-date/filter-date';
import { ListSearchComponent } from './list/list-search/list-search';
import { ListNextPageComponent } from './list/list-next-page/list-next-page';
import { ListNumComponent } from './list/list-num/list-num';
/** 详情页组件 */
import { DetailTextComponent } from './detail-items/detail-text/detail-text';
import { DetailImageComponent } from './detail-items/detail-image/detail-image';
import { DetailItemComponent } from './detail-items/detail-item/detail-item';
import { DetailItemsComponent } from './detail-items/detail-items';
import { DetailPicturesComponent } from './detail-pictures/detail-pictures';
import { DetailToggleComponent } from './detail-items/detail-toggle/detail-toggle';
import { DetailMoreDataComponent } from './detail-more-data/detail-more-data';
import { DetailMoreDataItemsComponent } from './detail-more-data/detail-more-data-items/detail-more-data-items';
import { DetailMoreItemComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-item';
import { DetailMoreImageComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-image/detail-more-image';
import { DetailMoreFileComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-file/detail-more-file';
import { DetailMoreLocationComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-location/detail-more-location';
import { DetailMoreVideoComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-video/detail-more-video';
import { DetailMoreDefaultComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-default/detail-more-default';
import { DetailMoreToggleComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-toggle/detail-more-toggle';
import { DetailMoreCurrencyComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-currency/detail-more-currency';
import { DetailMoreMultifileComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-multifile/detail-more-multifile';
import { DetailMoreMultiimageComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-multiimage/detail-more-multiimage';
import { DetailMoreMultilevelComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-multilevel/detail-more-multilevel';
/** 列表页 详情页 组件 */
import { DisplayItemsComponent } from './display-items/display-items';
import { DisplayTitleComponent } from './display-items/display-title/display-title';
import { DisplayItemComponent } from './display-items/display-item/display-item';
import { DisplayDefaultComponent } from './display-items/display-default/display-default';
import { DisplayDateComponent } from './display-items/display-date/display-date';
import { DisplayDatetimeComponent } from './display-items/display-datetime/display-datetime';
import { DisplayMobileComponent } from './display-items/display-mobile/display-mobile';
import { DisplayTagComponent } from './display-items/display-tag/display-tag';
import { DetailBaseComponent } from './detail-base/detail-base';
import { DisplayImageComponent } from './display-items/display-image/display-image';
import { DisplayDescComponent } from './display-items/display-desc/display-desc';
import { DisplayToggleComponent } from './display-items/display-toggle/display-toggle';
import { DisplayDescShowComponent } from './display-items/display-desc/display-desc-show/display-desc-show';
import { DisplayFileComponent } from './display-items/display-file/display-file';
import { ListItemsComponent } from './list/list-items/list-items';
import { ListItemTitleComponent } from './list/list-items/list-item-title/list-item-title';
import { ListItemDefaultComponent } from './list/list-items/list-item-default/list-item-default';
import { ListItemImageComponent } from './list/list-items/list-item-image/list-item-image';
import { ListItemDescComponent } from './list/list-items/list-item-desc/list-item-desc';
import { ListItemFileComponent } from './list/list-items/list-item-file/list-item-file';
import { ListItemTagComponent } from './list/list-items/list-item-tag/list-item-tag';
import { ListItemStatusComponent } from './list/list-items/list-item-status/list-item-status';
import { ListItemToggleComponent } from './list/list-items/list-item-toggle/list-item-toggle';
import { ListItemCurrencyComponent } from './list/list-items/list-item-currency/list-item-currency';
/** ionic 组件 */
import { DefaultTabsComponent } from './ionic/default-tabs/default-tabs';
import { DefaultGroupComponent } from './ionic/default-group/default-group';
import { PreviewImageComponent } from './ionic/preview-image/preview-image';
import { RangeBoxComponent } from './ionic/range-box/range-box';
/** 通用组件 */
import { AppGridListComponent } from './app/app-grid-list/app-grid-list';
import { AppGridTileComponent } from './app/app-grid-list/app-grid-tile/app-grid-tile';
import { AppImageUploadComponent } from './app/app-image-upload/app-image-upload';
import { AppFileUploadComponent } from './app/app-file-upload/app-file-upload';
import { AppAudioPlayerComponent } from './app/app-audio-player/app-audio-player';
import { AppVideoPlayerComponent } from './app/app-video-player/app-video-player';
import { AppSwiperComponent } from './app/app-swiper/app-swiper';
import { AppTextareaComponent } from './app/app-textarea/app-textarea';
import { StepsComponent } from './add/steps/steps';
import { StepComponent } from './add/steps/step/step';
import { AppMultifileUploadComponent } from './app/app-multifile-upload/app-multifile-upload';
import { AppImagesUploadComponent } from './app/app-images-upload/app-images-upload';
/** 其他 */
import { ChartComponent } from './chart/chart';
import { SelectItemsComponent } from './select-items/select-items';
import { GridListComponent } from './grid-list/grid-list';
import { DetailChildComponent } from './detail-child/detail-child';
import { NavMenuComponent } from './nav-menu/nav-menu';
import { ApprovalLogComponent } from './approval-log/approval-log';
import { PrintMsgComponent } from './print-msg/print-msg';
import { ReadMoreComponent } from './read-more/read-more';
/** 用户中心 */
import { UserToggleCompanyComponent } from './user/user-toggle-company/user-toggle-company';
import { WebBaiduMapComponent } from './web-baidu-map/web-baidu-map';
import { ChatComponent } from './chat/chat';
import { FaceDescriptionComponent } from './face/face-description/face-description';
/** style */
import { CardComponent } from './style/card/card';
import { CardHeaderComponent } from './style/card/card-header/card-header';
import { CardBodyComponent } from './style/card/card-body/card-body';
import { TabsComponent } from './detail/tabs/tabs';
import { TabComponent } from './detail/tabs/tab/tab';
import { DetailListComponent } from './detail/detail-list/detail-list';
import { DetailAddComponent } from './detail/detail-add/detail-add';
import { DetailChildrenComponent } from './detail/detail-children/detail-children';
/** 微信 */
import { WxWorkPcComponent } from './wx/wx-work-pc/wx-work-pc';
import { DetailGridComponent } from './detail/detail-grid/detail-grid';


import { DisplayMultiimageComponent } from './display-items/display-multiimage/display-multiimage';
import { DisplayMultifileComponent } from './display-items/display-multifile/display-multifile';
import { ListItemMultifileComponent } from './list/list-items/list-item-multifile/list-item-multifile';
import { ListItemMultiimageComponent } from './list/list-items/list-item-multiimage/list-item-multiimage';
import { ListSelectComponent } from './list/list-select/list-select';
import { DetailMoreDateComponent } from './detail-more-data/detail-more-data-items/detail-more-items/detail-more-date/detail-more-date';
import { ListItemDateComponent } from './list/list-items/list-item-date/list-item-date';








/**
 * @description 所有组件声明
 * @author da
 * @export
 * @class ComponentsModule
 */
@NgModule({
    declarations: [
        ChartComponent,
        DisplayItemsComponent,
        DisplayTitleComponent,
        DisplayItemComponent,
        DisplayDefaultComponent,
        DisplayDateComponent,
        DisplayDatetimeComponent,
        DisplayMobileComponent,
        DisplayTagComponent,
        DetailBaseComponent,
        DisplayImageComponent,
        PreviewImageComponent,
        DisplayDescComponent,
        EditItemsComponent,
        EditItemComponent,
        EditInputComponent,
        EditSelectComponent,
        EditDateComponent,
        EditToggleComponent,
        EditCameraComponent,
        EditSheetlinkComponent,
        EditHiddenComponent,
        SelectItemsComponent,
        GridListComponent,
        DefaultTabsComponent,
        DetailTextComponent,
        DetailImageComponent,
        DetailItemComponent,
        DetailItemsComponent,
        DefaultGroupComponent,
        DetailChildComponent,
        AppGridListComponent,
        AppGridTileComponent,
        EditMobileComponent,
        EditTextareaComponent,
        EditAutocompleteComponent,
        EditDatetimeComponent,
        EditRadioboxComponent,
        EditSignComponent,
        EditAutocompleteSelectComponent,
        EditCardComponent,
        EditMultiselectComponent,
        EditTextareaEditComponent,
        NativeCameraComponent,
        DetailPicturesComponent,
        AppImageUploadComponent,
        DetailToggleComponent,
        DisplayToggleComponent,
        ListFilterComponent,
        FilterItemComponent,
        FilterSelectComponent,
        FilterNumberComponent,
        FilterDateComponent,
        EditAudioComponent,
        AppFileUploadComponent,
        AppAudioPlayerComponent,
        EditVideoComponent,
        AppVideoPlayerComponent,
        NativeAudioComponent,
        NativeVideoComponent,
        EditTagselectComponent,
        EditTagmultiselectComponent,
        AppSwiperComponent,
        NavMenuComponent,
        ApprovalLogComponent,
        EditMultisheetlinkComponent,
        EditMultisheetlinkSelectComponent,
        EditMultisheetlinkSelectItemsComponent,
        DetailMoreDataComponent,
        DetailMoreDataItemsComponent,
        EditPublicLableComponent,
        EditPublicStateComponent,
        DisplayDescShowComponent,
        PrintMsgComponent,
        UserToggleCompanyComponent,
        AppTextareaComponent,
        EditFileComponent,
        NativeQrScannerComponent,
        NativeQrScannerModalComponent,
        EditGpsComponent,
        WebBaiduMapComponent,
        DisplayFileComponent,
        ChatComponent,
        DetailMoreItemComponent,
        DetailMoreImageComponent,
        DetailMoreFileComponent,
        DetailMoreLocationComponent,
        DetailMoreVideoComponent,
        DetailMoreDefaultComponent,
        ListSearchComponent,
        DetailMoreToggleComponent,
        ListItemsComponent,
        ListItemTitleComponent,
        ListItemDefaultComponent,
        ListItemImageComponent,
        ListItemDescComponent,
        ListItemFileComponent,
        ListItemTagComponent,
        ListItemStatusComponent,
        ListItemToggleComponent,
        ReadMoreComponent,
        ListNextPageComponent,
        ListNumComponent,
        EditIntComponent,
        EditDecimalComponent,
        RangeBoxComponent,
        FaceDescriptionComponent,
        EditCurrencyComponent,
        ListItemCurrencyComponent,
        DetailMoreCurrencyComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        StepsComponent,
        StepComponent,
        TabsComponent,
        TabComponent,
        DetailListComponent,
        DetailAddComponent,
        DetailChildrenComponent,
        WxWorkPcComponent,
        EditFaceidComponent,
        AppMultifileUploadComponent,
        AppImagesUploadComponent,
        EditMultifileComponent,
        EditorSegmentComponent,
        EditorTabsComponent,
        DetailGridComponent,
        EditMultiimageComponent,
        DisplayMultiimageComponent,
        DisplayMultifileComponent,
        DetailMoreMultifileComponent,
        DetailMoreMultiimageComponent,
        ListItemMultifileComponent,
        ListItemMultiimageComponent,
        EditPublicClearComponent,
        EditMultilevelComponent,
        MultilevelSelectComponent,
        ListSelectComponent,
        DetailMoreMultilevelComponent,
    DetailMoreDateComponent,
    ListItemDateComponent,

    ],
    imports: [
        SharedModule,
    ],
    exports: [
        ChartComponent,
        DisplayItemsComponent,
        DisplayTitleComponent,
        DisplayItemComponent,
        DisplayDefaultComponent,
        DisplayDateComponent,
        DisplayDatetimeComponent,
        DisplayMobileComponent,
        DisplayTagComponent,
        DetailBaseComponent,
        DisplayImageComponent,
        PreviewImageComponent,
        DisplayDescComponent,
        EditItemsComponent,
        EditItemComponent,
        EditInputComponent,
        EditSelectComponent,
        EditDateComponent,
        EditToggleComponent,
        EditCameraComponent,
        EditSheetlinkComponent,
        EditHiddenComponent,
        SelectItemsComponent,
        GridListComponent,
        DefaultTabsComponent,
        DetailTextComponent,
        DetailImageComponent,
        DetailItemComponent,
        DetailItemsComponent,
        DefaultGroupComponent,
        DetailChildComponent,
        AppGridListComponent,
        AppGridTileComponent,
        EditMobileComponent,
        EditTextareaComponent,
        EditAutocompleteComponent,
        EditDatetimeComponent,
        EditRadioboxComponent,
        EditSignComponent,
        EditAutocompleteSelectComponent,
        EditCardComponent,
        EditMultiselectComponent,
        EditTextareaEditComponent,
        NativeCameraComponent,
        DetailPicturesComponent,
        AppImageUploadComponent,
        DetailToggleComponent,
        DisplayToggleComponent,
        ListFilterComponent,
        FilterItemComponent,
        FilterSelectComponent,
        FilterNumberComponent,
        FilterDateComponent,
        EditAudioComponent,
        AppFileUploadComponent,
        AppAudioPlayerComponent,
        EditVideoComponent,
        AppVideoPlayerComponent,
        NativeAudioComponent,
        NativeVideoComponent,
        EditTagselectComponent,
        EditTagmultiselectComponent,
        AppSwiperComponent,
        NavMenuComponent,
        ApprovalLogComponent,
        EditMultisheetlinkComponent,
        EditMultisheetlinkSelectComponent,
        EditMultisheetlinkSelectItemsComponent,
        DetailMoreDataComponent,
        DetailMoreDataItemsComponent,
        EditPublicLableComponent,
        EditPublicStateComponent,
        DisplayDescShowComponent,
        PrintMsgComponent,
        UserToggleCompanyComponent,
        AppTextareaComponent,
        EditFileComponent,
        NativeQrScannerComponent,
        NativeQrScannerModalComponent,
        EditGpsComponent,
        WebBaiduMapComponent,
        DisplayFileComponent,
        ChatComponent,
        DetailMoreItemComponent,
        DetailMoreImageComponent,
        DetailMoreFileComponent,
        DetailMoreLocationComponent,
        DetailMoreVideoComponent,
        DetailMoreDefaultComponent,
        ListSearchComponent,
        DetailMoreToggleComponent,
        ListItemsComponent,
        ListItemTitleComponent,
        ListItemDefaultComponent,
        ListItemImageComponent,
        ListItemDescComponent,
        ListItemFileComponent,
        ListItemTagComponent,
        ListItemStatusComponent,
        ListItemToggleComponent,
        ReadMoreComponent,
        ListNextPageComponent,
        ListNumComponent,
        EditIntComponent,
        EditDecimalComponent,
        RangeBoxComponent,
        FaceDescriptionComponent,
        EditCurrencyComponent,
        ListItemCurrencyComponent,
        DetailMoreCurrencyComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        StepsComponent,
        StepComponent,
        TabsComponent,
        TabComponent,
        DetailListComponent,
        DetailAddComponent,
        DetailChildrenComponent,
        WxWorkPcComponent,
        EditFaceidComponent,
        AppMultifileUploadComponent,
        AppImagesUploadComponent,
        EditMultifileComponent,
        EditorSegmentComponent,
        EditorTabsComponent,
        DetailGridComponent,
        EditMultiimageComponent,
        DisplayMultiimageComponent,
        DisplayMultifileComponent,
        DetailMoreMultifileComponent,
        DetailMoreMultiimageComponent,
        ListItemMultifileComponent,
        ListItemMultiimageComponent,
        EditPublicClearComponent,
        EditMultilevelComponent,
        MultilevelSelectComponent,
        ListSelectComponent,
        DetailMoreMultilevelComponent,
    DetailMoreDateComponent,
    ListItemDateComponent,
    ],
    entryComponents: [
        PreviewImageComponent,
        EditAutocompleteSelectComponent,
        EditTextareaEditComponent,
        ListFilterComponent,
        AppSwiperComponent,
        EditMultisheetlinkSelectComponent,
        DisplayDescShowComponent,
        PrintMsgComponent,
        NativeQrScannerModalComponent,
        WebBaiduMapComponent,
        ChatComponent,
        ReadMoreComponent,
    ],
})
export class ComponentsModule { }
