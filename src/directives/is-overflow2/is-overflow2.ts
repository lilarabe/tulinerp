import { Directive, EventEmitter, ElementRef } from '@angular/core';


@Directive({
  selector: '[is-overflow2]',
  outputs: ['overflow'],
})
export class IsOverflow2Directive {

  /** 输出是否溢出 */
  public overflow = new EventEmitter<boolean>();

  constructor(
    private _elRef: ElementRef,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this._testIsOverflow();
    });
  }

  /** 测试 是否内容溢出 */
  private _testIsOverflow = (): boolean => {
    const clientWidth: number = this._elRef.nativeElement.clientWidth;
    const clientHeight: number = this._elRef.nativeElement.clientHeight;
    const scrollWidth: number = this._elRef.nativeElement.scrollWidth;
    const scrollHeight: number = this._elRef.nativeElement.scrollHeight;
    // const textContent: string = this._elRef.nativeElement.textContent;
    if (clientWidth < scrollWidth || clientHeight < scrollHeight) {
      this.overflow.emit(true);
      return true;
    } else {
      return false;
    }
  }

}
