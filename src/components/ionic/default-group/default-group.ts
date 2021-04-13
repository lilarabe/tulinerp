import { Component, Input } from '@angular/core';


@Component({
  selector: 'default-group',
  templateUrl: 'default-group.html'
})
export class DefaultGroupComponent {

  /** 分组名称 */
  @Input() groupName: string = "";

  /** 分组是否展开 */
  @Input() public expanded: boolean = true;

  constructor() {
  }

}
