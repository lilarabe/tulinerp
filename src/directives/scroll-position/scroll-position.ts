import { Directive, ElementRef, EventEmitter } from '@angular/core';


@Directive({
  selector: '[scroll-position]' // Attribute selector
})
export class ScrollPositionDirective {

  /** 是否滚动到指定位置 */
  public isPositionEvent = new EventEmitter<boolean>();

  constructor(
    private _elRef: ElementRef,
  ) {
    console.log(this._elRef);
  }

}
