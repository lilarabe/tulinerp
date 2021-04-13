import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { AjaxService, ResponseDataType } from './ajax.service';


@Injectable()
export class FormValidatorsService {

  constructor(
    private _ajax: AjaxService,
  ) {
  }

  /**
   * 非空校验
   * @memberof FormValidatorsService
   */
  public required = (formControl: FormControl): any => {
    const value = formControl.value || '';
    let valid: boolean = !!value;
    if(Array.isArray(value) && value.length === 0){
      valid = false;
    }
    return valid ? null : { errorType: `required`, required: true };
  }


  /**
   * @description 手机号码校验器
   * @memberof FormValidatorsService
   */
  public mobile = (mobile: FormControl): any => {
    const val = mobile.value || '';
    const reg = /^1[3|5|7|8]\d{9}$/;
    const valid: boolean = reg.test(val);
    return valid ? null : { errorType: `mobile`, mobile: true };
  }

  /** email 验证 */
  public email = (email: FormControl): any => {
    const val = email.value || '';
    const reg = /^[a-z|A-Z|0-9]{2,}@$/;
    const valid: boolean = reg.test(val);
    return valid ? null : { errorType: `email`, email: true };
  }

  /** 强行设置错误 */
  public error = (error: FormControl): any => {
    return { errorType: `error`, error: true };
  }




  /**
   * @description 密码长度校验
   * @memberof FormValidatorsService
   */
  public passwordLength = (password: FormControl): any => {
    const value: string = password.value || '';
    const valid: boolean = !!(value.length >= 6 && value.length <= 32);
    return valid ? null : { errorType: `passwordLength`, passwordLength: true };
  }



  /**
   * @description 密码相同校验
   * @memberof FormValidatorsService
   */
  public passwordEqual = (formGroup: FormGroup): any => {
    const password: FormControl = formGroup.get('password') as FormControl;
    const passwordConfirm: FormControl = formGroup.get('passwordConfirm') as FormControl;
    const valid: boolean = password.value === passwordConfirm.value;
    return valid ? null : { errorType: `passwordEqual`, passwordEqual: true };
  }


  public asyncOnlyOne = (formControl: FormControl): Observable<ResponseDataType> => {
    const value = formControl.value || '';
    return this._ajax.loadData({
      title: '异步:唯一验证',
      method: 'get',
      // url: 'assets/data/valid.data.json',
      uri: 'checkunique.php',
      params: { ...this._asyncOnlyParams, value },
    });
  }

  /**
   * @description 异步唯一验证
   * @memberof FormValidatorsService
   */
  public asyncOnly = (formControl: FormControl): Observable<any> => {

    return formControl
      .valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap(() => {
        const value = formControl.value || '';
        console.log(value);
        return this._ajax.loadData({
          title: '异步:唯一验证',
          method: 'get',
          // url: 'assets/data/valid.data.json',
          uri: 'checkunique.php',
          params: { ...this._asyncOnlyParams, value },
        });
      })
      .map((res) => {
        const valid: boolean = !!res.payload.valid;
        const result: any = valid ? null : { errorType: `asyncOnly`, errorMsg: res.payload.errorMsg, asyncOnly: true };
        return result;
      })
      .do(() => {
      })
      .catch(() => {
        return Observable.of(null);
      })
      .first();
  }
  /** 异步唯一验证 promis */
  public asyncOnlyPromis = (formControl: FormControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve, reject) => {
      formControl
        .valueChanges
        .debounceTime(1000)
        .distinctUntilChanged()
        .flatMap(() => {
          const value = formControl.value || '';
          console.log(value);
          return this._ajax.loadData({
            title: '异步:唯一验证',
            method: 'get',
            // url: 'assets/data/valid.data.json',
            uri: 'checkunique.php',
            params: { ...this._asyncOnlyParams, value },
          });
        })
        .do(() => {
          console.log(1);
          const value = formControl.value || '';
          this._ajax.loadData({
            title: '异步:唯一验证',
            method: 'get',
            // url: 'assets/data/valid.data.json',
            uri: 'checkunique.php',
            params: { ...this._asyncOnlyParams, value },
          }).subscribe((res) => {
            const valid: boolean = !!res.payload.valid;
            const result: any = valid ? null : { errorType: `asyncOnly`, errorMsg: res.payload.errorMsg, asyncOnly: true };
            resolve(result);
            // if (valid) {
            //   resolve(null);
            // } else {
            //   reject({ errorType: `asyncOnly`, errorMsg: res.payload.errorMsg, asyncOnly: true });
            // }
          });
        });
    });
  }


  /**
   * @description 异步唯一验证: set get params
   * @memberof FormValidatorsService
   */
  private _asyncOnlyParams: any = {};
  /** 异步唯一验证: set params */
  public setAsyncOnlyParams(params: any) {
    this._asyncOnlyParams = params;
  }

}
