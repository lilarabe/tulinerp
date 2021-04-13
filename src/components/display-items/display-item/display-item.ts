import { Component, Input } from '@angular/core';



/**
 * @description 显示组件
 * @author da
 * @export
 * @class DisplayItemComponent
 */
@Component({
  selector: 'display-item',
  template: '<div>DisplayItemComponent</div>'
})
export class DisplayItemComponent {

  /** 标题 */
  @Input() public name: string = "";
  /** 值 */
  @Input() public value: any = "";
  /** 是否可以操作 */
  @Input() public operate: boolean = true;
  /** value 样式 */
  @Input() public setStyle: any = {};

  constructor() {}

}
