import { Injectable } from '@angular/core';
import { ToolsProvider } from './tools.service';
import { MsgService } from './msg.service';
import { GeolocationService } from './native/geolocation.service';
declare var BMap: any;


@Injectable()
export class BaiduMapService {

    private _ak: string = `QpScVBissaKAdFYL9YguUetX`;

    private _element: Element;

    private _baiduMap: any;

    private _baiduLocationInfo: BaiduLocationInfo = { lng: 0, lat: 0, address: '' };

    constructor(
        private _tools: ToolsProvider,
        private _msg: MsgService,
        private _location: GeolocationService,
    ) {
        
    }

    public init = async () => {
        this._creatDom();
        await this._load();
    }

    /** 加载百度地图api */
    private _load = async () => {
        window['baiduMapReady'] = this._baiduMapReady;
        const url = `https://api.map.baidu.com/api?v=3.0&ak=${this._ak}&callback=baiduMapReady`;
        try {
            await this._tools.asyncLoadScript(url);
        } catch {
            this._msg.alert(`加载百度地图失败`);
        }
    }
    /** 创建元素 */
    private _creatDom = () => {
        const element = document.createElement("div");
        // document.getElementsByTagName('body')[0].appendChild(element);
        // element.style.width = `100vw`;
        // element.style.height = `100vh`;
        // element.setAttribute(`id`, `tempBaiduMap`);
        this._element = element;
    }
    /** 获取元素 */
    public getDom = () => {
        return this._element;
    }
    /** 获取 BMap 对象 */
    public getBMap = () => {
        return this._baiduMap;
    }
    /** 初始化地图 */
    private _baiduMapReady = () => {
        this._baiduMap = new BMap.Map(this._element);
        this._setMap();
    }
    /** 获取当前定位信息 */
    public getBaiduLocationInfo = async (): Promise<any> => {
        const locationPoint: Point = await this._getLocation();
        const translatePoint: Point = await this._convertor(locationPoint);
        const address = await this.getAddress(translatePoint);
        this._baiduLocationInfo = { lng: translatePoint.lng, lat: translatePoint.lat, address };
        console.log(this._baiduLocationInfo);
        return this._baiduLocationInfo;
    }
    /** 获取定位 */
    private _getLocation = async (): Promise<Point> => {
        return await this._location.getGeolocation();
    }
    /** 转换为百度坐标 */
    private _convertor = async (locationPoint: Point): Promise<Point | any> => {
        return new Promise((resolve) => {
            const point = new BMap.Point(locationPoint.lng, locationPoint.lat);
            const pointArr = [point];
            const convertor = new BMap.Convertor();
            convertor.translate(pointArr, 1, 5, (translateResults) => {
                if (translateResults.status === 0) {
                    resolve(translateResults.points[0]);
                }
            });
        });
    }
    /** 标记坐标点 */
    public markerPoint = (point: Point, lable?: string) => {
        const ggPoint = new BMap.Point(point.lng, point.lat);
        this._baiduMap.centerAndZoom(ggPoint, 15);
        const marker = new BMap.Marker(point);
        this._baiduMap.addOverlay(marker);
        if (lable) {
            const label = new BMap.Label(lable, { offset: new BMap.Size(20, -10) });
            marker.setLabel(label);
            this._baiduMap.setCenter(point);
        }
    }
    /** 设置地图 */
    private _setMap = () => {
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
    }
    /** 获取地址 */
    public getAddress = async (point: Point): Promise<any> => {
        return new Promise((resolve) => {
            const geo = new BMap.Geocoder();
            geo.getLocation(new BMap.Point(point.lng, point.lat), (result) => {
                if (result) {
                    resolve(result.address);
                }
            });
        });
    }
}

export interface Point {
    lng: number;
    lat: number;
}

export interface BaiduLocationInfo {
    lng: number;
    lat: number;
    address: string;
}