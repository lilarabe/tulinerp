import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { ToolsProvider } from '../../serves/tools.service';
import { MsgService } from '../../serves/msg.service';
declare var BMap: any;

const AK: string = 'QpScVBissaKAdFYL9YguUetX';

@Component({
  selector: 'web-baidu-map',
  templateUrl: 'web-baidu-map.html'
})
export class WebBaiduMapComponent {

  private _dismissData: any = null;

  private _latitude: number = 0;

  private _longitude: number = 0;

  private _baiduMap: any = null;

  constructor(
    private _viewCtrl: ViewController,
    private _navParams: NavParams,
    private _tools: ToolsProvider,
    private _msg: MsgService,
  ) {
    console.log(this._navParams.data);
  }

  ionViewWillEnter() {
    this._init();
  }

  private _init = async () => {
    window['baidumapinit'] = this._baidumapinit;
    this._latitude = this._navParams.get('latitude') ? this._navParams.get('latitude') : 0;
    this._longitude = this._navParams.get('longitude') ? this._navParams.get('longitude') : 0;
    const url = `https://api.map.baidu.com/api?v=3.0&ak=${AK}&callback=baidumapinit`;
    try {
      await this._tools.asyncLoadScript(url);
    } catch {
      this._msg.alert(`加载百度地图失败`);
    }
  }

  /** 百度地图初始化 */
  private _baidumapinit = (): void => {
    this._baiduMap = new BMap.Map("baidumap-container");
    /** 如许鼠标放缩 */
    this._baiduMap.enableScrollWheelZoom(true);
    /** 平移缩放控件 */
    this._baiduMap.addControl(new BMap.NavigationControl());
    /** 比例尺 */
    this._baiduMap.addControl(new BMap.ScaleControl());
    /** 缩略地图 */
    // this._baiduMap.addControl(new BMap.OverviewMapControl());
    /** 地图类型 */
    // this._baiduMap.addControl(new BMap.MapTypeControl());
    /** 定位 */
    // this._baiduMap.addControl(new BMap.GeolocationControl());

    // 创建地图实例  
    const ggPoint = new BMap.Point(this._longitude, this._latitude);
    // 创建点坐标  
    this._baiduMap.centerAndZoom(ggPoint, 15);
    const markergg = new BMap.Marker(ggPoint);
    this._baiduMap.addOverlay(markergg);
  }


  /** 关闭 */
  public dismiss = async () => {
    await this._viewCtrl.dismiss(this._dismissData);
  }

}
