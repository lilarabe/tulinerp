import { Component, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'nav-menu',
  templateUrl: 'nav-menu.html',
  host: {
    '[class.show]': 'isShow',
  },
})
export class NavMenuComponent {

  /** 是否显示 */
  @Input() isShow: boolean = false;

  @ViewChild('navMenuContent') navMenuContent: ElementRef;

  protected _maskElement: HTMLElement;

  constructor(
    @Inject(DOCUMENT) protected _document: any,
    private _element: ElementRef,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.isShow === true) {
      this._open();
    } else if (this.isShow === false) {
      this._open();
    }

  }

  ngOnDestroy() {
    this._destroyMask();
  }

  ionViewDidEnter() {
    this._init();
  }

  ionViewWillLeave() {
    this._destroyMask();
  }

  private _init = (): void => {
    const maskElement = this._getMaskElement();
    maskElement.appendChild((this._element.nativeElement));
    maskElement.addEventListener('click', () => {
      this._close();
    }, false);
  }


  /** 创建 mask */
  protected _createMask(): void {
    const mask = this._document.createElement('div');
    mask.classList.add('nav-menu-mask');
    this._document.body.appendChild(mask);
    this._maskElement = mask;
  }


  /** 销毁 mask */
  private _destroyMask = (): void => {
    if (this._maskElement && this._maskElement.parentNode) {
      this._maskElement.parentNode.removeChild(this._maskElement);
    }
  }


  /** 获取 mask */
  private _getMaskElement(): HTMLElement {
    if (!this._maskElement) { this._createMask(); }
    return this._maskElement;
  }

  /** 打开 */
  private _open = (): void => {
    if (this._maskElement) {
      this._maskElement.classList.remove('hide');
      this._maskElement.classList.add('show');
    } else {
      this._init();
    }
  }

  /** 关闭 */
  private _close = (): void => {
    if (this._maskElement) {
      this._maskElement.classList.remove('show');
      this._maskElement.classList.add('hide');
    }
  }

}
