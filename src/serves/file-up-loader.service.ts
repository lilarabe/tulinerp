import {Injectable} from '@angular/core';

@Injectable()
export class FileUpLoaderService {

  constructor(
  ) {
  }

  public getBase64Code = (file: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (typeof FileReader === 'undefined') {
        reject('你的浏览器不支持FileReader接口！');
      }
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onerror = function () {
        reject('FileReader error！');
      };
      fileReader.onloadstart = function () {
      };

      fileReader.onprogress = function (e) {
      };

      fileReader.onload = function (e) {
      };

      fileReader.onloadend = function (e) {
        const base64 = this.result;
        resolve(base64);
      };

    });
  }

}
