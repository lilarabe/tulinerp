import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';

@Component({
  selector: 'list-next-page',
  templateUrl: 'list-next-page.html'
})
export class ListNextPageComponent {

  /** 是否禁用 */
  @Input() public isEnabled: boolean = false;
  /** 下一页事件 */
  @Output() public nextPageEvent: EventEmitter<InfiniteScroll> = new EventEmitter();

  constructor() { }
  /** 发送下一页事件 */
  public sendNextPageEvent = (event: InfiniteScroll) => {
    this.nextPageEvent.emit(event);
  }

}
