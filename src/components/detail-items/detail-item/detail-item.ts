import { Component, Input } from '@angular/core';


/**
 * @description 详细页显示组件
 * @author da
 * @export
 * @class DetailItemComponent
 */
@Component({
  selector: 'detail-item',
  template: '<div>DetailItemComponent</div>'
})
export class DetailItemComponent {

  /** 标题 */
  @Input() name: string = "";

  /** 数值 */
  @Input() value: string = "";

  /** 外键模块名称 */
  @Input() fkModuleName: string = "";

  /** 外键模块ID */
  @Input() fkModuleId: string = "";

  constructor() {
  }

}
