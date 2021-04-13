import { Component, Input } from '@angular/core';
import { ListItemsType } from '../../../interface/list.interface';


@Component({
  selector: 'list-items',
  templateUrl: 'list-items.html'
})
export class ListItemsComponent {

  @Input() public items: ListItemsType = { cols: 1, id:'', itemData: [] };

  /** 是否可以操作 */
  @Input() public operate: boolean = true;

  constructor() {}

  ngOnChanges() {
    this._resetDefaultAttr();
  }

  /** 设置默认数据 */
  private _resetDefaultAttr = (): void => {}

}
