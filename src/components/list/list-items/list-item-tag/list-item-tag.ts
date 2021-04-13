import { Component, Input } from '@angular/core';
import { ListItemClass } from '../list-item';


@Component({
  selector: 'list-item-tag',
  templateUrl: 'list-item-tag.html'
})
export class ListItemTagComponent extends ListItemClass {

  /** 标签样式 */
  @Input() public tagStyle: any = {};

  constructor() { super(); }

}
