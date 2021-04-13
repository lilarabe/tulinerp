import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';


@Component({
  selector: 'detail-more-currency',
  templateUrl: 'detail-more-currency.html'
})
export class DetailMoreCurrencyComponent extends DetailMoreItemComponent {

  /** 是否溢出 */
  public isOverflow: boolean = false;

  constructor() { super(); }

  /** 测试是否溢出 */
  public testOverflow = (e: boolean) => {
    this.isOverflow = e;
  }

}
