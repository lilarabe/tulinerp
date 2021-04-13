import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { IonicStorageService } from '../../serves/ionic-storage.service';
// import { AppGlobalType } from '../../interface/global.interface';
// declare const app_global: AppGlobalType;

@Injectable()
export class LoginProvider {


  constructor(
    private _ionicStorageService: IonicStorageService,
    // private _cookieService: CookieService,
  ) {
    /** 检测 storage 中 是否 存在登录信息 */
    // this._ionicStorageService.get('token').then((res) => {
    //   if (!!res) {
    //     this.isLoginSource.next(true);
    //   }
    // });
  }

  


  public asyncIsLogin = async (): Promise<boolean> => {
    const token: string = await this._ionicStorageService.get('token');
    if(token){
      return Promise.resolve(true);
    }else {
      return Promise.resolve(false);
    }
  }

  /** 登录 */
  private _isLoginSource = new Subject<boolean>();
  public isLogin$ = this._isLoginSource.asObservable();

  public login = async (res) => {
    /*记录登录信息到 Storage*/
    await this._ionicStorageService.set('username', res.payload.username);
    await this._ionicStorageService.set('SAAS_DB_AUTH', res.payload.SAAS_DB_AUTH);
    await this._ionicStorageService.set('company', res.payload.company);
    await this._ionicStorageService.set('Files_Dir', res.payload.Files_Dir);
    await this._ionicStorageService.set('Super_Pass', +res.payload.Super_Pass);
    await this._ionicStorageService.set('Now_SAAS_DB_AUTH', res.payload.Now_SAAS_DB_AUTH);
    await this._ionicStorageService.set('token', res.payload.token).then(() => {
      this._isLoginSource.next(true);
    });

  }

  /** 注销 */
  public logout = async () => {
    
    await this._ionicStorageService.del('username');
    await this._ionicStorageService.del('token');
    await this._ionicStorageService.del('mobile');
    await this._ionicStorageService.del('role');
    // this._cookieService.remove('PHPSESSID');
   
    this._isLoginSource.next(false);

  }

}
