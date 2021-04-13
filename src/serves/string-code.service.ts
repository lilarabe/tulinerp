import { Injectable } from '@angular/core';
import { ToolsProvider } from './tools.service';

@Injectable()
export class StringCodeService {

  constructor(public tools: ToolsProvider) {
  }

  /*加密*/
  public encode = (str: string): string => {
    let code: string = '';
    for (let i = 0; i < str.length; i++) {
      code += str.charCodeAt(i) + 12345;
    }
    let arrCode = code.split('');
    arrCode.forEach( (v, i) => {
      const randomChars = this.tools.getRandomChars(Math.floor(Math.random() * 3));
      arrCode[i] = randomChars + arrCode[i];
    });
    code = arrCode.join(',').replace(/\,/g, '');
    return code;
  }

  /*解密*/
  public decode = (code: string): string => {
    code = code.replace(/\D+?/g, '');
    let str: string = '';
    for (let i = 0; i < code.length / 5; i++) {
      str += String.fromCharCode(+code.substr(i * 5, 5) - 12345);
    }
    return str;
  }

}
