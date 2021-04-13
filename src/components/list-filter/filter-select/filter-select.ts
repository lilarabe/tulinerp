import { Component, Input } from '@angular/core';
import { ValueArrayType } from "../../../interface/filter.interface";
import { FilterBaseClass } from "../filter-base.class";



@Component({
  selector: 'filter-select',
  templateUrl: 'filter-select.html'
})
export class FilterSelectComponent extends FilterBaseClass {

  /** 是否多选 */
  @Input() multi: boolean = false;

  /** 选项 */
  @Input() valueArray: ValueArrayType[] = [];

  /** value */
  @Input() value: Array<string> | string;


  /** 多选的数据 */
  public selectedData: string[] = [];

  /** 单选的数据 */
  public selectedValue: string = "";

  constructor(
  ) {
    super();
  }


  ngOnChanges() {
    this._init();
    this._creatFormControl();
  }


  /** 重置ValueArray，新增selected属性，标记是否被选中 */
  private _init = (): void => {
    this.valueArray.forEach((v) => {
      if (this.multi) {
        for (let i: number = 0; i < this.value.length; i++) {
          if (this.value[i] === v.value) {
            v.selected = true;
          }
        }
      } else {
        v.selected = this.value === v.value;
      }
    });
  }

  
  /**
  * @description 确定选择
  * @memberof FilterSelectComponent
  */
  public doSelect = (val: string): void => {
    this.selectedValue = "";
    this.selectedData = [];
    this.valueArray.forEach((v) => {
      if (this.multi) {
        /** 多选 */
        if (v.value === val) {
          v.selected = !v.selected;
        }
        if (v.selected) {
          this.selectedData.push(v.value);
        }
      } else {
        /** 单选 */
        // v.selected = v.value === val ? true : false;
        if (v.value === val) {
          v.selected = !v.selected;
        }
        if (v.value === val && v.selected) {
          this.selectedValue = v.value;
        }
      }
    });

    if (this.multi) {
      this.formControl.setValue(this.selectedData);
    } else {
      this.formControl.setValue(this.selectedValue);
    }
  }

}
