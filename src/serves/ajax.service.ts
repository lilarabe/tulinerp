import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';
import { environment } from '../environments/environment';
import { Observer } from 'rxjs/Observer';
import { Observable } from "rxjs/Observable";
import { ToolsProvider } from "./tools.service";
import { MsgService } from '../serves/msg.service';
import { LoginProvider } from '../providers/login/login';
import { AppGlobalType } from "../interface/global.interface";
import { IonicStorageService } from './ionic-storage.service';
import { PrintMsgService } from '../components/print-msg/print-msg';
declare let app_global: AppGlobalType;


@Injectable()
export class AjaxService {

  private _isDebug: boolean = false;

  private errorData: ResponseDataType = HTTP_ERROR_RES;

  constructor(
    private _http: Http,
    private _tools: ToolsProvider,
    private _msg: MsgService,
    private _ionicStorageService: IonicStorageService,
    private _loginProvider: LoginProvider,
    private _printMsg: PrintMsgService,
  ) {
  }

  public setDebug = (bool: boolean): void => {
    this._isDebug = bool;
  }

  private setOptions = (paramsObj = {}, headersObj = {}): RequestOptions => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append('Content-Type', 'multipart/form-data');
    if (this._tools.isNotNullObject(headersObj)) {
      for (const o in headersObj) {
        headers.append(o, headersObj[o]);
      }
    }
    const params = new URLSearchParams();
    for (const o in paramsObj) {
      params.set(o, paramsObj[o]);
    }
    const options = new RequestOptions({ headers: headers, search: params, withCredentials: true });
    // const options = new RequestOptions({ headers: headers, search: params, withCredentials: false });
    return options;
  }

  /** ?????? storage ??? taken ??? */
  private getStorageInfo = async (obj: AjaxServiceLoadDataType): Promise<any> => {
    const token: string = await this._ionicStorageService.get('token') || '';
    const username: string = await this._ionicStorageService.get('username') || '';
    const SAAS_DB_AUTH: string = await this._ionicStorageService.get('SAAS_DB_AUTH') || '';
    const Super_Pass: string = await this._ionicStorageService.get('Super_Pass') || 0;
    /** token ???????????? */
    if (obj.testToken) {
      if (token !== '') {
        return Promise.resolve({ token, username, SAAS_DB_AUTH, Super_Pass });
      } else {
        this._msg.toast(`?????????`);
        this._tools.printDebugMsg(`${obj.title}??????token??????`, this._isDebug);
        this._loginProvider.logout();
        return Promise.reject({ token, username, SAAS_DB_AUTH, Super_Pass });
      }
    } else {
      return Promise.resolve({ token, username, SAAS_DB_AUTH, Super_Pass });
    }
  }

  /** ?????????????????? */
  private setCacheData = (obj: AjaxServiceLoadDataType, response: ResponseDataType) => {
    const key: string = obj.cacheKey || 'responesCache:' + obj.url + this._tools.param(obj.params);
    const expires: number = +new Date() + 8640000000;
    if (obj.isCachable && obj.method === 'get') {
      this._ionicStorageService.set(key, { expires, response }).then();
    }
  }

  /** ?????????????????? */
  private getCacheData = async (obj: AjaxServiceLoadDataType): Promise<any> => {
    let result: any = null;
    const key: string = obj.cacheKey || 'responesCache:' + obj.url + this._tools.param(obj.params);
    const cacheData = await this._ionicStorageService.get(key);
    if (cacheData === null) {
      result = null;
    } else if (cacheData.expires < +new Date()) {
      await this._ionicStorageService.del(key);
      result = null;
    } else {
      result = cacheData.response;
    }
    return result;
  }

  public loadData = (obj: AjaxServiceLoadDataType): Observable<ResponseDataType> => {
    /** ???????????? ajax loading */
    // obj.isLoading = false;
    /** http?????????????????? */
    let httpStatus: number = 0;
    /*extend*/
    const defaultObj: AjaxServiceLoadDataType = DEFAULTOBJ;
    for (const o in defaultObj) {
      if (this._tools.isUndefined(obj[o])) {
        obj[o] = defaultObj[o];
      }
    }
    obj['method'] = obj['method'].toLowerCase();

    /** beforeFn */
    if (this._tools.isFunction(obj.beforeFn)) {
      obj.beforeFn();
    }

    /** ??????loading */
    const loader = this._msg.loading('???????????????...', obj.loadingCss);
    if (obj.isLoading) {
      loader.present();
    }

    /*??????Response??????????????????*/
    const testResponseData = (data: any): boolean => {
      let result: boolean = true;
      if (!this._tools.isObject(data)) {
        errorMsg('response ?????????');
        result = false;
      } else if (!this._tools.isNumber(data.status)) {
        errorMsg('status ?????????');
        result = false;
      } else if (data.status === 0) {
      } else if (data.status === -1) {
        this._msg.toast('??????????????????????????????');
        this._loginProvider.logout();
      }
      if (data.msg) {
        this._msg.toast(data.msg);
      }
      return result;
    };

    /*??????Require??????????????????*/
    const testRequireData = (): boolean => {
      let result: boolean = true;
      /*?????? title ??????*/
      if (!obj.title) {
        errorMsg('title ??????');
        result = false;
      } else if (!obj.url) {
        errorMsg('uri ??? url ??????');
        result = false;
      }
      return result;
    };

    /*????????????*/
    const errorMsg = (msg: string): void => {
      if (obj.debug) {
        this._msg.toast(`????????????-${obj.title}: ${msg}`);
      }
    };

    /*??????*/
    const handleError = (error: any): any => {
      // alert(`??????:${JSON.stringify(error)}`);
      if (error.name === "TimeoutError") {
        errorMsg('????????????');
      } else if (error.name === "SyntaxError") {
        errorMsg('??????????????????');
      } else if (error.status === 500) {
        errorMsg('?????????500??????');
      } else if (error.status === 404) {
        errorMsg('?????????404??????');
      } else {
        errorMsg('???????????????');
      }
      loadingDismiss(obj.delayLoading);
      const errorData = { ...this.errorData, httpStatus };
      return Observable.of(errorData);
    };

    if (obj['uri']) {
      obj['url'] = app_global.baseUrl + obj['uri'];
    }

    testRequireData();

    const loadingDismiss = (delay: number = 0) => {
      setTimeout(() => {
        loader.dismiss();
      }, delay);
    }

    const getData = (): Observable<any> => {

      const httpGet$ = (): Observable<any> => {
        return this._http.get(obj['url'], this.setOptions(obj['params'], obj.headers))
          .delay(+obj.delay)
          .timeout(obj.timeout)
          .map((res: Response) => {
            httpStatus = res.status ? res.status : httpStatus;
            // let result  = JSON.stringify(res.json()).replace(/%2B/g,'+');
            // return JSON.parse(result);
            return res.json();
          })
          .do((res: any) => {
            testResponseData(res);
            /** afterFn */
            if (this._tools.isFunction(obj.afterFn)) {
              obj.afterFn(res);
            }
            this._printMsg.print(res, `${obj.title}-????????????`, this._isDebug);
          })
          .catch(handleError);
      }

      const observable = Observable.create((observer: Observer<any>) => {
        this.getStorageInfo(obj).then(res => {
          obj.params = { ...obj.params, ...res };
          if (!environment.production) {
            const Mobile_Local_Port = location.port;
            obj.params = { ...obj.params, Mobile_Local_Port };
          }
          this._printMsg.print(obj, `${obj.title}-????????????`, this._isDebug);
          if (obj.isCachable) {
            this.getCacheData(obj).then(cacheData => {
              if (cacheData) {
                observer.next(cacheData);
                loadingDismiss(obj.delayLoading);
              } else {
                httpGet$().subscribe(res => {
                  this.setCacheData(obj, res);
                  observer.next({ ...res, httpStatus });
                  loadingDismiss(obj.delayLoading);
                });
              }
            });
          } else {
            httpGet$().subscribe(res => {
              this.setCacheData(obj, res);
              observer.next({ ...res, httpStatus });
              loadingDismiss(obj.delayLoading);
            });
          }
          // observer.complete();
        }).catch(error => { });
      });

      return observable;
    };

    const postData = (): Observable<any> => {
      const body = new URLSearchParams();

      const httpPost$ = (): Observable<any> => {
        return this._http.post(obj['url'], body, this.setOptions(obj['params'], obj.headers))
          .delay(+obj.delay)
          .timeout(obj.timeout)
          .map((res: Response) => {
            // let result  = JSON.stringify(res.json()).replace(/%2B/g,'+');
            // return JSON.parse(result);
            return res.json();
          })
          .do((res: any) => {
            testResponseData(res);
            /** afterFn */
            if (this._tools.isFunction(obj.afterFn)) {
              obj.afterFn(res);
            }
            this._printMsg.print(res, `${obj.title}-????????????`, this._isDebug);
          })
          .catch(handleError);
      }

      const observable = Observable.create((observer: Observer<any>) => {
        this.getStorageInfo(obj).then(res => {
          obj.params = { ...obj.params, ...res };
          obj.data.data = { ...obj.data.data, ...res };
          body.set('data', JSON.stringify(obj.data).replace(/\+/g, `%2B`));
          if (!environment.production) {
            body.set('Mobile_Local_Port', location.port);
          }
          this._printMsg.print(obj, `${obj.title}-????????????`, this._isDebug);
          httpPost$().subscribe(res => {
            observer.next({ ...res, httpStatus });
            loadingDismiss(obj.delayLoading);
            // observer.complete();
          });
        }).catch(error => { });
      });
      return observable;
    };

    if (obj['method'] === 'get') {
      return getData();
    } else if (obj['method'] === 'post') {
      return postData();
    }
  }



  private httpGet$ = (url: string, options?: RequestOptions): Observable<any> => {
    return this._http.get(url, options).map(res => res.json());
  }

  private httpPost$ = (url: string, body: any, options?: RequestOptions): Observable<any> => {
    return this._http.post(url, body, options).map(res => res.json());
  }

  public load = (obj: AjaxServiceLoadDataType): Observable<any> => {
    /*extend*/
    const defaultObj: AjaxServiceLoadDataType = {
      method: 'get',
      title: '',
      url: '',
      params: {},
      data: {},
      headers: {
        // 'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    for (const o in defaultObj) {
      if (this._tools.isUndefined(obj[o])) {
        obj[o] = defaultObj[o];
      }
    }
    obj['method'] = obj['method'].toLowerCase();
    const method = obj['method'];
    const options = new RequestOptions({ headers: obj['headers'], search: obj['params'] });

    if (method === 'get') {
      return this.httpGet$(obj['url'], options);
    } else if (method === 'post') {
      return this.httpPost$(obj['url'], obj['data'], options);
    }

  }

}

export interface AjaxServiceLoadDataType {
  title: string;
  method?: string;
  url?: string;
  uri?: string;
  params?: any;
  data?: any;
  beforeFn?: any;
  afterFn?: any;
  debug?: boolean;
  timeout?: number;
  isLoading?: boolean;
  headers?: any;
  testToken?: boolean;
  isCachable?: boolean;
  cacheKey?: string;
  /** ?????????????????? */
  delay?: number;
  /** ?????? loading  */
  delayLoading?: number;
  /** loading?????????loading?????? */
  loadingCss?: string;
  /** ???????????????????????? */
  isShowDebugMsg?: boolean;
}
/** ???????????? */
const DEFAULTOBJ: AjaxServiceLoadDataType = {
  method: 'post',
  url: '',
  uri: '',
  title: '',
  params: {},
  data: {},
  beforeFn: null,
  afterFn: null,
  debug: false,
  timeout: 10000,
  isLoading: false,
  headers: {},
  testToken: true,
  isCachable: false,
  cacheKey: '',
  delay: 0,
  delayLoading: 0,
  loadingCss: '',
};

export interface ResponseDataType {
  status: number;
  payload: any;
  httpStatus?: number;
}

/**
 * ajax ??????????????????????????????
 */
export const HTTP_ERROR_RES: ResponseDataType = {
  status: -99,
  payload: {},
}