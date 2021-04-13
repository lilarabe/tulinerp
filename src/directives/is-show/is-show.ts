import { Directive, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Content } from 'ionic-angular';


@Directive({
  selector: '[is-show]' // Attribute selector
})
export class IsShowDirective {

  /** 是否可以显示 */
  @Output() public isShowEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** 临界值 */
  @Input() public threshold: number = 0;

  constructor(
    private _elementRef: ElementRef,
    private _content: Content,
  ) {
  }

  ngOnInit(): void {
    this._onScroll();
  }

  ngAfterViewInit(): void {
    this._check();
  }

  private _onScroll = () => {
    this._content.ionScroll.subscribe(() => {
      this._check();
    });
  }

  private _check = () => {
    /** 距离 */
    let distance: number;
    /** 容器信息 */
    const contentDimensions = this._content.getContentDimensions();
    // console.log('容器信息', contentDimensions);
    /** 容器总高度 */
    const contentTotalHeight = contentDimensions.scrollHeight;
    // console.log('容器总高度', contentTotalHeight);
    /** 容器scroll高度 */
    const contentScrollTop = contentDimensions.scrollTop;
    // console.log('容器scroll高度', contentScrollTop);
    /** 容器视窗高度 */
    const contentViewHeight = contentDimensions.contentHeight;
    // console.log('容器视窗高度', contentViewHeight);
    /** 元素高度 */
    const elementHeight = this._elementRef.nativeElement.scrollHeight;
    // console.log('元素高度', elementHeight);
    // console.log('临界值', this.threshold);
    distance = contentTotalHeight - contentScrollTop - contentViewHeight - elementHeight + this.threshold;
    // console.log('距离', distance);
    /** 结果 */
    const result: boolean = distance > 0;
    // console.log('结果', result);
    this.isShowEvent.emit(result);
  }

}
