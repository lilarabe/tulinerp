import { Component, Input } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";


/**
 * @description 列表标签选择器
 * @author da
 * @export
 * @class DisplayTagComponent
 * @extends {DisplayItemComponent}
 */
@Component({
  selector: 'display-tag',
  templateUrl: 'display-tag.html'
})
export class DisplayTagComponent extends DisplayItemComponent {

  /** 标签样式 */
  @Input() public tagStyle: any = {};

  constructor() {
    super();
  }

}
