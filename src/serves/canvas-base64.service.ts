import { Injectable } from '@angular/core';
// import { ToolsProvider } from './tools.service';
const errorBase64Code: string = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAKAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOTlFOURFRkMzOEYxMUU3OTlBOUY0MDE3RTcwRkU1OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyOTlFOURGMEMzOEYxMUU3OTlBOUY0MDE3RTcwRkU1OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI5OUU5REVEQzM4RjExRTc5OUE5RjQwMTdFNzBGRTU4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5OUU5REVFQzM4RjExRTc5OUE5RjQwMTdFNzBGRTU4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAFBAQGRIZJxcXJzImHyYyLiYmJiYuPjU1NTU1PkRBQUFBQUFERERERERERERERERERERERERERERERERERERERAEVGRkgHCAmGBgmNiYgJjZENisrNkREREI1QkRERERERERERERERERERERERERERERERERERERERERERERERERE/8AAEQgAdgB2AwEiAAIRAQMRAf/EAE0AAQEAAAAAAAAAAAAAAAAAAAAEAQEBAQAAAAAAAAAAAAAAAAAABAUQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJgGqiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z';



@Injectable()
export class CanvasBase64Service {

  constructor(
    // private _tools: ToolsProvider,
  ) {
  }

  public getBase64Code = (scr: string, type: getBase64Type = { case: 'define' }, quality: number = 1): Promise<any> => {

    const list = {
      jpg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp'
    };
    const imgType = scr.replace(/.+\.(jpg|png|gif|bmp)/i, '$1').toLowerCase();

    return new Promise((resolve, reject) => {
      const img = new Image();
      // img.crossOrigin = '*';
      /** 
       * 如果出现 Access-Control-Allow-Origin * 错误，是服务器跨域问题
      */
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = scr;
      // console.log(img);
      img.onload = (): void => {

        const canvas = document.createElement("canvas");
        let width: number = 1;
        let height: number = 1;

        const imgWidth: number = img.width;
        const imgHeight: number = img.height;

        switch (type.case) {
          /* 不压缩图片 */
          case 'full':
            width = img.width;
            height = img.height;
            break;
          /* 按照屏幕压缩 */
          case 'auto':
            const windowWidth: number = window.innerWidth;
            const windowHeight: number = window.innerHeight;
            const result1 = this.setSize(imgWidth, imgHeight, windowWidth, windowHeight);
            width = result1.width;
            height = result1.height;
            break;
          case 'define':
            const defineWidth: number = type.width || 1000;
            const defineHeight: number = type.height || 1000;
            const result2 = this.setSize(imgWidth, imgHeight, defineWidth, defineHeight);
            width = result2.width;
            height = result2.height;
            break;
        }
        this.setCanvas(canvas, img, width, height);
        const base64Code = canvas.toDataURL(list[imgType], quality);
        resolve(base64Code);
      };

      img.onerror = (): void => {
        resolve(errorBase64Code);
      };

    });

  }

  /**
   * 设置画板
   * 
   * @private
   * @memberof CanvasBase64Service
   */
  private setCanvas = (canvas, img, width: number, height: number): void => {
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  }

  /**
   * 计算宽高
   * 
   * @private
   * @memberof CanvasBase64Service
   */
  private setSize = (imgWidth: number, imgHeight: number, defineWidth: number, defineHeight: number): any => {
    const result: any = {
      width: 1,
      height: 1
    };
    const imgRatio: number = imgWidth / imgHeight;
    const defineRatio: number = defineWidth / defineHeight;
    /* 图片的宽高都小于 屏幕的宽高。取图片的宽高 */
    if (imgWidth <= defineWidth && imgHeight <= defineHeight) {
      result.width = imgWidth;
      result.height = imgHeight;
    } else {
      if (imgRatio >= defineRatio) {
        /* 图片极限 扁 */
        result.width = defineWidth;
        result.height = defineWidth / imgRatio;
      } else {
        /* 图片极限 长 */
        result.height = defineHeight;
        result.width = defineHeight * imgRatio;
      }
    }
    return result;
  }


}

interface getBase64Type {
  case: string;
  width?: number;
  height?: number;
}