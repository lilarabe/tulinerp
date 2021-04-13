import { Component, ElementRef } from '@angular/core';
import { ListItemClass } from '../list-item';


@Component({
  selector: 'list-item-currency',
  templateUrl: 'list-item-currency.html'
})
export class ListItemCurrencyComponent extends ListItemClass {

  constructor(
    private _elRef: ElementRef,
  ) { super(); }

  /** 是否溢出 */
  public isOverflow = (e:boolean):void => {
    if(e){
      this._elRef.nativeElement.classList.add('w100');
    }
  }

}
