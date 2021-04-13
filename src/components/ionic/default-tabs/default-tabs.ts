import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterContentInit, Renderer2, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'default-tabs',
  templateUrl: 'default-tabs.html'
})
export class DefaultTabsComponent implements AfterContentInit, AfterViewChecked {

  /** 标题数组 */
  @Input() public titles: string[] = [];

  /** 激活的索引 */
  @Input() public activeIndex: number = 0;

  /** 输出事件 */
  @Output() public activeIndexEvent = new EventEmitter<number>();

  /** tabs 的 body 元素 */
  @ViewChild('body') public bodyRef: ElementRef;

  /** body 节点数组 */
  private nodeList: Array<HTMLElement> = []; // HTMLElement

  constructor(
    private renderer2: Renderer2,
  ) {
  }


  ngAfterContentInit(): void {
  }


  ngAfterViewChecked(): void {
    this.nodeList = this.bodyRef.nativeElement.querySelectorAll(".tabs-body");
    this.rendererNodeList();
  }



  /**
   * @description 渲染是否显示
   * @private
   * @memberof DefaultTabsComponent
   */
  private rendererNodeList = (): void => {
    this.nodeList.forEach((v, k) => {
      if (this.activeIndex === k) {
        this.renderer2.setStyle(v, "display", "block");
      } else {
        this.renderer2.setStyle(v, "display", "none");
      }
    });
  }



  /**
   * @description 激活设置
   * @memberof DefaultTabsComponent
   */
  public setActiveIndex = (idx: number): void => {
    this.activeIndex = idx;
    this.activeIndexEvent.emit(idx);
    this.rendererNodeList();
  }

}


