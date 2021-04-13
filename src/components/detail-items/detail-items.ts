import { Component, Input } from '@angular/core';


@Component({
  selector: 'detail-items',
  templateUrl: 'detail-items.html'
})
export class DetailItemsComponent {

  /** 绑定数据 */
  @Input() itemsData: any;

  constructor() {
  }

}
