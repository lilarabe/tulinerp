import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";


@Injectable()
export class ToolsProvider {

  constructor() {}

  /** 深拷贝 */
  public deepCopy = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj));
  }

  /* 深度克隆 */
  public clone<T>(obj: T): T {
    let result;
    if (this.getType(obj) === 'object') {
      result = {};
    } else if (this.getType(obj) === 'array') {
      result = [];
    } else {
      result = obj;
    }
    for (const key in obj) {
      if (this.getType(obj[key]) === 'object') {
        result[key] = this.clone(obj[key]);
      } else if (this.getType(obj[key]) === 'array') {
        result[key] = this.clone(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }


  /**
    * 字符串 转换 日期
    * 字符串: 2011-12-31 14:34:56
    * 
    * @memberof ToolsProvider
    */
  public strToDate = (str: string): Date => {
    let yyyy: number = 2000;
    let MM: number = 1;
    let dd: number = 0;
    let hh: number = 0;
    let mm: number = 0;
    let ss: number = 0;
    str.replace(/(^\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/, ($0, $1, $2, $3, $4, $5, $6) => {
      yyyy = +$1;
      MM = +$2 - 1;
      dd = $3;
      hh = $4;
      mm = $5;
      ss = $6;
      return '';
    });
    // console.log(`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`);
    return new Date(yyyy, MM, dd, hh, mm, ss);
  }

  /**
   * @description 日期对象转换字符串
   * @param date: Date，要转换的日期对象；format: string，返回的日期格式
   * @returns 日期字符串
   * @memberof ToolsProvider
   */
  public dateToStr = (date: Date, format: string = 'datetime'): string => {
    const yyyy = date.getFullYear();
    const MM = ("00" + (date.getMonth() + 1)).slice(-2);
    const dd = ("00" + date.getDate()).slice(-2);
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    let result: string = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    switch (format) {
      case 'datetime':
        result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        break;
      case 'date':
        result = `${yyyy}-${MM}-${dd}`;
        break;
      default:
        result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        break;
    };
    return result;
  }



  /**
   * @description 字符串日期标准格式化 : 2001-1-3 12:1:2 => 2001-01-03 12:01:02
   * @memberof ToolsProvider
   */
  public dataStrFormat = (dataStr: string, format: string = "date"): string => {
    let result: string = "";
    if (!dataStr) {
      return result;
    }
    let yyyy: string = "2000";
    let MM: string = "01";
    let dd: string = "01";
    let hh: string = "00";
    let mm: string = "00";
    let ss: string = "00";
    switch (format) {
      case 'yearmonth':
        dataStr.replace(/(^\d{4})-(\d{1,2})/, ($0, $1, $2)=>{
          yyyy = $1;
          MM = this.to2digit(+$2);
          return dataStr;
        });
        break;
      default:
        dataStr.replace(/(^\d{4})-(\d{1,2})-(\d{1,2})([\s+|T](\d{1,2}):(\d{1,2}):(\d{1,2})((\.\d{0,3})?Z)?)?/, ($0, $1, $2, $3, $4, $5, $6, $7) => {
          yyyy = $1;
          MM = this.to2digit(+$2);
          dd = this.to2digit(+$3 || 1);
          hh = this.to2digit(+$5 || 0);
          mm = this.to2digit(+$6 || 0);
          ss = this.to2digit(+$7 || 0);
          return $0;
        });
        break;
    }
    switch (format) {
      case 'yearmonth':
        result = `${yyyy}-${MM}`;
        break;
      case 'datetime':
        result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        break;
      case 'date':
        result = `${yyyy}-${MM}-${dd}`;
        break;
      case 'iso':
        /* 时区处理 */
        const offset: number = 8;
        const offsetTimestamp: number = 3600000 * offset;
        result = new Date(+this.strToDate(`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`) + offsetTimestamp).toISOString();
        break;
      default:
        result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
        break;
    };
    return result;
  }



  /**
   * @description 一位数字 转换 两位数字 1 => 01
   * @author da
   * @private
   * @param {number} n
   * @returns 
   * @memberof ToolsProvider
   */
  private to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  /**
   * 取随机数
   * n:返回随机数个数
   * 
   * @memberof ToolsProvider
   */
  public getRandomChars = (n: number): string => {
    let result: string = '';
    const numberChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const lowerChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const upperChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //const markChars = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '_', '+'];
    let tempChars: string[] = [...lowerChars, ...numberChars, ...upperChars];

    for (let i = 0; i < n; i++) {
      const id = Math.ceil(Math.random() * (tempChars.length - 1));
      result += tempChars[id];
    }

    return result;
  }

  /*获取数据类型*/
  public getType(any: any): string {
    const result = Object.prototype.toString.call(any).replace(/(^\[object\s)(\w+)(]$)/, function ($0, $1, $2, $3) {
      return $2.toLowerCase();
    });
    return result;
  }

  /** 合并对象 */
  public extend = (obj: object, defaultObj: object): object => {
    for (const o in defaultObj) {
      if (this.isUndefined(obj[o])) {
        obj[o] = defaultObj[o];
      }
    }
    return obj;
  }

  /** isString */
  public isString = (x: any): boolean => {
    return this.getType(x) === 'string';
  }

  /*isArray*/
  public isArray = (x: any): boolean => {
    return Array.isArray(x);
  }

  /*isObject*/
  public isObject = (x: any): boolean => {
    return this.getType(x) === 'object';
  }

  /*isFunction*/
  public isFunction = (x: any): boolean => {
    return typeof x === 'function';
  }

  /*isNumber*/
  public isNumber = (x: any): boolean => {
    return typeof x === 'number';
  }

  /*isUndefined*/
  public isUndefined = (x: any): boolean => {
    return typeof x === 'undefined';
  }

  /*isNotUndefined*/
  public isNotUndefined = (x: any): boolean => {
    return !this.isUndefined(x);
  }

  /* isNullObject 是否为空对象 空：false 非空：true */
  public isNotNullObject = (x: any): boolean => {
    let result: boolean = false;
    let count: number = 0;
    if (this.isObject(x)) {
      for (const o in x) {
        if (x.hasOwnProperty(o)) {  // 建议加上判断,如果没有扩展对象属性可以不加
          count++;
        }
      }
      result = !!count;
    } else {
      result = false;
    }
    return result;
  }

  public isNullObject = (x: any): boolean => {
    return !this.isNotNullObject(x);
  }

  /*isNull*/
  public isNull = (x: any): boolean => {
    return this.getType(x) === 'null';
  }

  /** 是否为空数据 */
  public isEmpty = (value: any): boolean => {
    let result: boolean = true;
    if (this.isArray(value) && value.length > 0) {
      result = false;
      return result;
    }
    if (this.isString(value) && value === '') {
      result = false;
      return result;
    }
    if (this.isUndefined(value)) {
      result = false;
      return result;
    }
    if (this.isNull(value)) {
      result = false;
      return result;
    }
    return result;
  }

  public isNotEmpty = (value: any): boolean => {
    return !this.isEmpty(value);
  }

  /**
   * jQuery param {a:1, b:2} => ?a=1&b=2
   */
  public param = (a: object) => {
    var s = [];
    var add = function (k, v) {
      v = typeof v === 'function' ? v() : v;
      v = v === null ? '' : v === undefined ? '' : v;
      s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };
    var buildParams = function (prefix, obj) {
      var i, len, key;

      if (prefix) {
        if (Array.isArray(obj)) {
          for (i = 0, len = obj.length; i < len; i++) {
            buildParams(
              prefix + '[' + (typeof obj[i] === 'object' && obj[i] ? i : '') + ']',
              obj[i]
            );
          }
        } else if (String(obj) === '[object Object]') {
          for (key in obj) {
            buildParams(prefix + '[' + key + ']', obj[key]);
          }
        } else {
          add(prefix, obj);
        }
      } else if (Array.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
          add(obj[i].name, obj[i].value);
        }
      } else {
        for (key in obj) {
          buildParams(key, obj[key]);
        }
      }
      return s;
    };
    return buildParams('', a).join('&');
  }



  /**
   * @description 格式化css单位: 12 => 12px, 2rem => 2rem
   * @memberof ToolsProvider
   */
  public formarCssUnits = (value: any): string => {
    return ((value + "").match(/px|em|rem|vw|vh/)) ? value : value + 'px';
  }



  /**
   * @description 打印 debug 信息
   * @memberof ToolsProvider
   */
  public printDebugMsg = (value: any, debug: boolean = false): void => {
    let msg: any;
    if (this.isObject(value)) {
      msg = JSON.stringify(value);
    } else if (this.isArray(value)) {
      msg = value;
    } else {
      msg = value;
    }
    if (debug) {
      console.log(msg);
      // alert(msg);
    }
  }


  /**
   * @description 是否字符串在某个字符串数组中
   * @memberof ToolsProvider
   */
  public isStringInArray = (value: string, arr: string[] = []): boolean => {
    let result: boolean = false;
    if (Array.isArray(arr)) {
      arr.forEach((v: string) => {
        if (value.toLowerCase() === v.toLowerCase()) {
          result = true;
        }
      });
    }
    return result;
  }




  /**
   * @description 获取文件后缀名
   * @memberof ToolsProvider
   */
  public getFileSuffixName = (fileName: string): string => {
    let suffixName: string = "";
    if (fileName.split(".").length > 1) {
      suffixName = fileName.split(".").slice(-1).join("");
    }
    return suffixName;
  }



  /**
   * @description 是否是base64编码
   * @memberof ToolsProvider
   */
  public isBase64Code = (code: string): boolean => {
    const reg: RegExp = /^data:[\d|\D]+;base64,[\d|\D]+/;
    return reg.test(code);
  }




  /**
   * @description 获取base64编码信息
   * @memberof ToolsProvider
   */
  public getBase64CodeInfo = (code: string): any => {
    const result: any = {};
    const reg: RegExp = /^data:([\d|\D]+);base64,([\d|\D]+)/;
    code.replace(reg, ($0, $1, $2) => {
      result.type = $1;
      result.code = $2;
      return '';
    });
    return result;
  }



  /**
   * @description 文件大小单位(无四舍五入，保留两位小数)
   * @memberof ToolsProvider
   */
  public changeFileSize = (size: number, unit: string = "m"): number => {
    let fileSize: number = 0;
    unit = unit.toLowerCase();

    switch (unit) {
      case "k":
        fileSize = Math.floor(size / 1024 * 100) / 100;
        break;
      case "m":
        fileSize = Math.floor(size / 1024 / 1024 * 100) / 100;
        break;
      default:
        fileSize = 0;
        break;
    }

    return fileSize;
  }





  /**
   * @description js 加载
   * @memberof ToolsProvider
   */
  public loadScript = (src: string): Observable<any> => {
    return new Observable<any>(
      (observer: Observer<any>) => {

        const scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.async = true;
        scriptElement.charset = 'utf-8';
        scriptElement.src = src;

        scriptElement.onload = () => {
          observer.next({ loadStatus: true });
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error("无法加载 script " + src);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
        //document.head.appendChild(scriptElement);
      }
    );
  }


  /** 异步加载js */
  public asyncLoadScript = async (scriptUrl: string): Promise<void> => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    // scriptElement.async = false;
    scriptElement.charset = 'utf-8';
    scriptElement.src = scriptUrl;

    scriptElement.onload = () => {
      return Promise.resolve(void 0);
    };

    scriptElement.onerror = (error: any) => {
      return Promise.reject(void 0);
    };

    document.getElementsByTagName('body')[0].appendChild(scriptElement);
    // document.head.appendChild(scriptElement);
  }


  /**
   * @description 通过文件创建一个指向类型化数组的URL
   * @memberof ToolsProvider
   */
  public fileToBlobUrl = (file: File): string => {
    let url: string = '';
    if (this.isNotUndefined(window['createObjectURL'])) {
      url = window['createObjectURL'](file);
    } else if (this.isNotUndefined(window.URL)) {
      url = window.URL.createObjectURL(file);
    } else if (this.isNotUndefined(window['webkitURL'])) {
      url = window['webkitURL'].createObjectURL(file);
    }
    // url = this.sanitizer.bypassSecurityTrustUrl(url);
    return url;
  }



  /**
   * @description 字符内容转变成blob地址
   * @memberof ToolsProvider
   */
  public codeToBlobUrl = (code: string): string => {
    let url: string = '';
    const blob = new Blob([code]);
    if (this.isNotUndefined(window['createObjectURL'])) {
      url = window['createObjectURL'].createObjectURL(blob);
    } else if (this.isNotUndefined(window.URL)) {
      url = window.URL.createObjectURL(blob);
    } else if (this.isNotUndefined(window['webkitURL'])) {
      url = window['webkitURL'].createObjectURL(blob);
    }
    return url;
  }


  /**
   * @description 分析url
   * @memberof ToolsProvider
   */
  public urlToObj = (url: string): {
    protocol?: string,
    origin?: string,
    port?: string,
    fileName?: string,
    query?: any,
    isCrossDomain?: boolean,
  } => {
    let result: any = {
      /* 协议 */
      protocol: ``,
      /* 域 */
      origin: ``,
      /* 端口 */
      port: ``,
      /* 文件名 */
      fileName: ``,
      /* 参数 */
      query: {},
      /* 是否跨域 */
      isCrossDomain: true,
    };
    if (url) {
      url
        /* 匹配参数 */
        .replace(/\?([\d|\D]+)/, ($0, $1) => {
          $1 = $1.replace(/\#\?/g, '&');
          $1.split('&').forEach(v => {
            const arr: Array<string> = v.split('=');
            if (arr.length === 2) {
              const key: string = arr[0];
              const value: string = arr[1];
              result.query[key] = value;
            }
          });
          return ``;
        })
        /* 匹配协议 */
        .replace(/^(http[s]?){1}:\/\/[\d|\D]+/i, ($0, protocol) => {
          result.protocol = protocol;
          return $0;
        })
        /* 匹配 域 */
        .replace(/(^(http[s]?){1}:\/\/(\w+\.)?\w+\.\w+(\.\w+)?(:\d{2,})?)/i, ($0, origin) => {
          origin.replace(/\d{2,}$/, (port) => {
            result.port = port;
            return port;
          });
          const localOrigin: string = location.origin || '';
          result.isCrossDomain = origin !== localOrigin;
          result.origin = origin;
          return ``;
        })
        /* 匹配文件名 */
        .replace(/([\w|_|-]+\.\w+)[\d|\D]+/, ($0, fileName) => {
          result.fileName = fileName;
          return $0;
        });
    }
    return result;
  }



  /**
   * @description 是否在微信浏览器
   * @memberof ToolsProvider
   */
  public isWxBrowser = (): boolean => {
    const reg = /micromessenger/i;
    return reg.test(navigator.userAgent.toLowerCase());
  }

  /** 暂停 ms */
  public sleep = (delay: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

  public objectToArray = (object: object): Array<{ key: string; value: any }> => {
    const array: Array<{ key: string; value: any }> = [];
    Object.keys(object).forEach((key) => {
      const value: any = object[key];
      array.push({ key, value });
    });
    return array;
  }

  /** 数字转换字符串 1234567890 => 1,234,567,890 */
  public numberToString = (num: number): string => {
    const arrNum: Array<string> = num.toString().split('.');
    const integer: string = arrNum[0];
    const decimal: string = arrNum[1] ? '.' + arrNum[1] : '';
    return integer.replace(/(\d)(?=(\d{3})+$)/g, '$1,') + decimal;
  }

  /** 字符串转换数字 1,234,567,890 => 1234567890 */
  public stringToNumber = (str: string): number => {
    return +str.replace(/,/g, '') || 0;
  }

  /** 获取浏览器信息 */
  public getBrowserInfo = (): any => {
    var result: any = {};
    var userAgent = window.navigator.userAgent || '';
    result.userAgent = userAgent;
    result.isWxBrowser = userAgent.indexOf('MicroMessenger') > -1;
    result.isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;;
    result.isIos = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    result.isMobile = !!userAgent.match(/AppleWebKit.*Mobile.*/);
    result.isIpad = userAgent.indexOf('iPad') > -1;
    result.isIphone = userAgent.indexOf('iPhone') > -1;
    result.isPc = !result.isMobile;
    return result;
  }


  /** 分离文件路径，文件名称 */
  public getFilePathAndName = (fileFullPath: string): { filePath, fileName } => {
    let filePath: string = '';
    let fileName: string = '';
    fileFullPath.replace(/^([\d|\D]+\/)([\w|-]+\.\w+)$/, ($0, $1, $2) => {
      filePath = $1;
      fileName = $2;
      return $0;
    });
    return { filePath, fileName };
  }
  /** 是否是图片 
   * @param filePathOrName : 文件路径+文件名称 or 文件名称
   * @returns bool 是否是图片 
  */
  public isImage = (filePathOrName: string): boolean => {
    const reg:RegExp = /\.(jpg|png|gif|bmp)$/i;
    return reg.test(filePathOrName);
  }

  /** 测试是否数字字符串 */
  public isNumberString = (value: string | number): boolean => {
    value = value + '';
    const isNumberStr: boolean = /^(-?\d+)(\,\d{3})+(\.\d+)?$/.test(value);
    return isNumberStr;
  }

  /** 打印信息 */
  public print = (msg: string, colorString: string = '#000000', fontSize: number = 12): void => {
    let color: string = '#000000';
    switch (colorString) {
      case 'r':
        color = '#ff0000';
        fontSize = 14;
        break;
      case 'g':
        color = '#009900';
        break;
      case 'b':
        color = '#0000ff';
        break;
      case 'b1':
        color = '#0066ff';
        break;
      case 'y':
        color = '#ff6600';
        break;
      default:
        break;
    }
    console.log(`%c${msg}`, `color:${color}; font-size:${fontSize}px;`);
    this.doNothing(color);
  }

  /** 什么都不做 */
  public doNothing = (
    a?: any, b?: any, c?: any, d?: any, e?: any, f?: any, g?: any, h?: any, i?: any, j?: any, k?: any,
    l?: any, m?: any, n?: any, o?: any, p?: any, q?: any, r?: any, s?: any, t?: any, u?: any, v?: any,
    w?: any, x?: any, y?: any, z?: any,
  ) => { }


  public encodeUTF8 = (s) => {
    var i, r = [], c, x;
    for (i = 0; i < s.length; i++)
      if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
      else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
      else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
          c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
      };
    return r;
  }

  // 字符串加密成 hex 字符串
  public sha1 = (s: any) => {
    var data = new Uint8Array(this.encodeUTF8(s));
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16;
    s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [], f = [
      function () { return m[1] & m[2] | ~m[1] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; },
      function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
      function () { return m[1] ^ m[2] ^ m[3]; }
    ], rol = function (n, c) { return n << c | n >>> (32 - c); },
      k = [1518500249, 1859775393, -1894007588, -899497514],
      m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
      var o = m.slice(0);
      for (j = 0; j < 80; j++)
        w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
          t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
          m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
      for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (let i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
      return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex;
  }

}