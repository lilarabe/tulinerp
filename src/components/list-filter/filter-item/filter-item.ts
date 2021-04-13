import { Component, Input, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'filter-item',
  templateUrl: 'filter-item.html'
})
export class FilterItemComponent {

  /** 名称 */
  @Input() name: string;

  @ViewChild('content') contentRef: ElementRef;

  private isShow: boolean = false;

  public isShowBtn: boolean = false;

  constructor() {
  }

  ngAfterContentInit(){
    /** 子元素的高度 */
    const clientHeight = this.contentRef.nativeElement.children[0].clientHeight;
    this.isShowBtn = clientHeight > 40;
  }



  /**
   * @description 显示全部
   * @memberof FilterItemComponent
   */
  public show = (): void => {
    this.isShow = !this.isShow;
  }

}
