import { Component, Input } from '@angular/core';
import { FilterBaseClass } from "../filter-base.class";
import { FormGroup, FormControl } from '@angular/forms';
import { ToolsProvider } from "../../../serves/tools.service";



@Component({
  selector: 'filter-date',
  templateUrl: 'filter-date.html'
})
export class FilterDateComponent extends FilterBaseClass {

  /** ion-datetime 的属性 */
  public datetime: any = {
    displayFormat: "YYYY-MM-DD",
    placeholder: "请选择日期",
    doneText: "确定",
    cancelText: "取消",
    max: "2030-12-31",
  };

  /** 最大日期的min属性 */
  public maxFormControlMinDate: string = "2000-01-01";

  /** 日期表单 */
  public dateFormGroup: FormGroup = new FormGroup({
    min: new FormControl(''),
    max: new FormControl(''),
  });

  /** value */
  @Input() value: { min: any, max: any } = {
    min: "",
    max: "",
  };

  constructor(
    protected _tools: ToolsProvider,
  ) {
    super();
    this.dateFormGroup.get('min').valueChanges.subscribe((min: string) => {
      this.value.min = min;
      /** 设定最大日期的min属性 */
      this.maxFormControlMinDate = min;
      this._setValue();
    });
    this.dateFormGroup.get('max').valueChanges.subscribe((max: string) => {
      this.value.max = max;
      this._setValue();
    });
  }


  ngOnChanges() {
    this._creatFormControl();
    if ( this._tools.isNotUndefined(this.value.min) ) {
      this.dateFormGroup.get('min').setValue(this.value.min);
    }
    if ( this._tools.isNotUndefined(this.value.max) ) {
      this.dateFormGroup.get('max').setValue(this.value.max);
    }
  }



  /**
   * @description 设置表单数据
   * @protected
   * @memberof FilterDateComponent
   */
  protected _setValue = (): void => {
    this.formControl.setValue(this.value);
  }


}
