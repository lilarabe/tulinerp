import { Component, Input } from '@angular/core';


@Component({
  selector: 'list-item-status',
  templateUrl: 'list-item-status.html'
})
export class ListItemStatusComponent {

  /** 状态 */
  @Input() public status: number = -1;

  /**是否暂存状态 */
  @Input() public isTempSave: boolean=false;

  constructor() { }

}
