import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'list-search',
  templateUrl: 'list-search.html',
  inputs: ['keyword'],
  outputs: ['keywordChange'],
})
export class ListSearchComponent {

  /*搜索数据*/
  public keyword: string = '';
  @Output() keywordChange: EventEmitter<string> = new EventEmitter<string>();

  /** 搜索取消事件 */
  @Output() searchClearEvent = new EventEmitter<string>();
  /** 自动搜索事件 */
  @Output() searchAutoEvent = new EventEmitter<string>();
  /** 点击搜索事件 */
  @Output() searchClickEvent = new EventEmitter<string>();

  constructor() { }

  /** 搜索取消 */
  public searchClear = (): void => {
    this.keyword = '';
    this.searchClearEvent.emit(this.keyword);
    this.keywordChange.emit(this.keyword);
  }
  /** 自动搜索 */
  public autoSearch = (): void => {
    this.searchAutoEvent.emit(this.keyword);
    this.keywordChange.emit(this.keyword);
  }
  /** 点击搜索 */
  public btnSearch = (): void => {
    if (this.keyword !== '') {
      this.searchClickEvent.emit(this.keyword);
      this.keywordChange.emit(this.keyword);
    }
  }

}
