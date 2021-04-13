import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { EditItemComponent } from "../edit-item/edit-item";
import { WebBaiduMapComponent } from "../../web-baidu-map/web-baidu-map";
import { GeolocationService } from '../../../serves/native/geolocation.service';
import { BaiduMapService } from '../../../serves/baidu-map.service';
import { MsgService } from '../../../serves/msg.service';


@Component({
  selector: 'edit-gps',
  templateUrl: 'edit-gps.html'
})
export class EditGpsComponent extends EditItemComponent {

  public address: string = '';

  public action: string = '';

  public latitude: number = 0;

  public longitude: number = 0;

  constructor(
    protected validators: FormValidatorsService,
    private _modalCtrl: ModalController,
    private _geolocationService: GeolocationService,
    private _baiduMapService: BaiduMapService,
    private _msg: MsgService,
  ) {
    super(validators);
    this._geolocationService.getGeolocation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.action = this.requireData.action;
      if (this.action === `add`) {
        this._baiduMapService.getBaiduLocationInfo().then((res) => {
          this.address = res.address;
          this.latitude = res.lat;
          this.longitude = res.lng;
          this.formControl.setValue({
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
          });
        });
      } else {
        if(typeof this.formControl.value==='string'){
          const realValue = this.formControl.value.split(',');
          this.formControl.setValue({
            latitude: realValue[0],
            longitude:  realValue[1],
            address:  realValue[2],
          });
        }
        this.address = this.formControl.value.address;
      }
    });
  }


  /** 开启百度地图页面 */
  public presentWebBaiduMapPage = async () => {
    const value = this.formControl.value;
    const baiduMapPage = WebBaiduMapComponent;
    let latitude = (value && value.latitude) ? value.latitude : 0;
    let longitude = (value && value.longitude) ? value.longitude : 0;
    if (latitude === 0 || longitude === 0) {
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
