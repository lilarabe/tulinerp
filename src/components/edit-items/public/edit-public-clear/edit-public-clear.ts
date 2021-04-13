import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditDataType } from '../../../../interface/edit.interface';

/**
 * 清除字段数据按钮
 */
@Component({
  selector: 'edit-public-clear',
  templateUrl: 'edit-public-clear.html'
})
export class EditPublicClearComponent {

  /** 字段数据 */
  @Input() public fieldData: EditDataType;
  /** 清除字段事件 */
  @Output() public valueClearChange: EventEmitter<void> = new EventEmitter();

  constructor() { }

  /**
   * 清除字段数据
   */
  public clear = () => {
    if (this.fieldData) {
      // console.log(`清除前数据: ${this.fieldData.placeholder}, key:${this.fieldData.key}, value:${this.fieldData.formControl.value}, displayValue:${this.fieldData.displayValue}`);
      this.fieldData.formControl.setValue('');
      this.fieldData.displayValue = '';
      this.fieldData.value = '';
      this.valueClearChange.emit();
      // console.log(`清除后数据: ${this.fieldData.placeholder}, key:${this.fieldData.key}, value:${this.fieldData.formControl.value}, displayValue:${this.fieldData.displayValue}`);
    }
  }

}
