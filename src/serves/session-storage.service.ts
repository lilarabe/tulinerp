
import {Injectable} from '@angular/core';

@Injectable()
export class SessionStorageService {

  /*sessionStorage*/
  private storage: any;
  /*是否支持localStorage*/
  private isSupported: boolean;

  /*验证sessionStorage*/
  private test = (): boolean => {
    let result = false;
    try {
      window.sessionStorage.setItem('testKey', 'testValue');
      window.sessionStorage.removeItem('testKey');
      this.storage = window.sessionStorage;
      result = true;
    } catch (e) {
      console.error('浏览器不支持localStorage');
      this.storage = {};
      result = false;
    }
    return result;
  }

  constructor() {
    this.isSupported = this.test();
  }

  /*清除sessionStorage*/
  public clear = (): boolean => {
    let result: boolean;
    if (this.isSupported) {
      this.storage.clear();
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  /*清除指定 key*/
  public remove = (key: string): boolean => {
    let result: boolean;
    if (this.isSupported) {
      this.storage.removeItem(key);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  /* 设置 key */
  public set = (key: string, data: any, v: any = '1.000'): boolean => {
    let result: boolean;
    if (this.isSupported) {
      /*当前时间戳*/
      const time: number = +new Date();
      /*数据大小*/
      const size: number = JSON.stringify(data).length;
      /*存储的数据*/
      const obj: object = {
        time: time,
        size: size,
        v: v,
        data: data
      };
      this.storage.setItem(key, JSON.stringify(obj));
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  /*获取 key*/
  public get = (key: string): any => {
    let result: any;
    if (this.isSupported && JSON.parse(this.storage.getItem(key))) {
      result = JSON.parse(this.storage.getItem(key));
    } else {
      result = false;
    }
    return result;
  }
}
