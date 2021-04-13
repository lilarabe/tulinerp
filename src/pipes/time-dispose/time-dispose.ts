import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimeDisposePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timeDispose',
})
export class TimeDisposePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor() {
  }
  transform(value: string, ...args) {
    let _value=new Date(Number(value)).toString();
    let val = _value.split(/[\.\/\s\:\-]/);
    let data = new Date();
    let month = this.MonthDispose(val[1]);
    if (Number(val[3]) === data.getFullYear()) {
      if (month === data.getMonth() + 1) {
        if (Number(val[2]) === data.getDate()) {
          return "今天  " + val[4] + ':' + val[5];
        } else if (Number(val[2]) + 1 === data.getDate()) {
          return "昨天  " + val[4] + ':' + val[5];
        } else {
          return month + "-" + val[2] + "  " + val[4] + ':' + val[5];
        }
      } else {
        return month + "-" + val[2] + "  " + val[4] + ':' + val[5];
      }
    } else {
      return val[3] + '-' + month + "-" + val[2];
    }
  };
  MonthDispose(val: any) {
    switch (val) {
      case 'Jan':
        return 1;
      case 'Feb':
        return 2;
      case 'Mar':
        return 3
      case 'Apr':
        return 4;
      case 'May':
        return 5;
      case 'Jun':
        return 6;
      case 'Jul':
        return 7;
      case 'Ang':
        return 8;
      case 'Sep':
        return 9;
      case 'Oct':
        return 10;
      case 'Nov':
        return 11;
      case 'Dec':
        return 12;
      default:
        break;
    }
  }
}
