
import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  constructor() {    
  }

  public set = (key: string, value: any, expires: number = 1000*60*60*24*365*10): void => {
    const expiresDate = new Date(+new Date() + expires);
    document.cookie = `${key}=${value};expires=${expiresDate.toUTCString()};path=/`;
  }

  public get = (key: string): string => {
    let result: string = '';
    const reg: RegExp = new RegExp(`${key}=([\\w|\\d]+)`, 'i');
    if (document.cookie.match(reg)) {
      result = document.cookie.match(reg)[1];
    } 
    return result;
  }

  public remove = (key: string): void => {
    const expiresDate = new Date(+new Date() - 1);
    document.cookie = `${key}=;expires=${expiresDate.toUTCString()}`;
  }

}
