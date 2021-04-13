import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { WebBaiduMapComponent } from "../../../../web-baidu-map/web-baidu-map";
import { ModalController } from 'ionic-angular';
import { MsgService } from '../../../../../serves/msg.service';


@Component({
  selector: 'detail-more-location',
  templateUrl: 'detail-more-location.html'
})
export class DetailMoreLocationComponent extends DetailMoreItemComponent {

  constructor(
    private _modalCtrl: ModalController,
    private _msg: MsgService,
  ) {
    super();
  }

  /** 开启百度地图页面 */
  public presentWebBaiduMapPage = async (value: { latitude, longitude, address }) => {

    const baiduMapPage = WebBaiduMapComponent;
    let latitude = (value && value.latitude) ? value.latitude : 0;
    let longitude = (value && value.longitude) ? value.longitude : 0;

    if (latitude === 0 || longitude === 0) {
      console.log(`数据不完整，不可开启百度地图。`);
      const at = await this._msg.confirmAsync("未能获取到位置信息，仍要打开地图吗？");
      if (at) {
        latitude = '39.90960456049752';
        longitude = '116.404282409668';
      } else {
        return;
      }
    }
    const params: any = { latitude, longitude };

    const modal = this._modalCtrl.create(baiduMapPage, params);
    await modal.present();

    /** 关闭 modal 赋值 */
    modal.onDidDismiss((value: string) => {
      console.log(value);
    });
  }

}
