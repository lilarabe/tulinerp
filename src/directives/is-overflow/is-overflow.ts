import { Directive, EventEmitter, ElementRef, Renderer2 } from '@angular/core';


@Directive({
  selector: '[is-overflow]',
  outputs: ['overflow'],
})
export class IsOverflowDirective {
  /** 输出是否溢出 */
  public overflow = new EventEmitter<boolean>();

  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this._init();
    });
  }

  /** 初始化 */
  private _init = (): void => {
    /** 外部宽度 */
    const outWidth:number = this._elRef.nativeElement.offsetWidth;
    const textContent: string = this._elRef.nativeElement.textContent;
    const innerHTML: string = `<span class="isOverflow">${textContent}</span>`;
    this._elRef.nativeElement.innerHTML = innerHTML;
    const innerElement: any = this._elRef.nativeElement.querySelector(`span.isOverflow`);
    /** 设置不换行 */
    this._renderer.setStyle(innerElement, 'white-space', 'nowrap');
    /** 内部宽度 */
    const innerWidht:number = innerElement.offsetWidth;
    if(innerWidht > outWidth){
      this.overflow.emit(true);
    }
    this._elRef.nativeElement.innerHTML = textContent;
  }

}
