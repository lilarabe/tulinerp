import { Component, Input } from '@angular/core';
import { FilterBaseClass } from "../filter-base.class";
import { FormGroup, FormControl } from '@angular/forms';
import { ToolsProvider } from "../../../serves/tools.service";




@Component({
  selector: 'filter-number',
  templateUrl: 'filter-number.html'
})
export class FilterNumberComponent extends FilterBaseClass {

  /** value */
  @Input() value: { min: any, max: any } = {
    min: "",
    max: "",
  };

  /** 数字表单 */
  public numberFormGroup: FormGroup = new FormGroup({
    min: new FormControl(''),
    max: new FormControl(''),
  });

  constructor(
    protected _tools: ToolsProvider,
  ) {
    super();
    this.numberFormGroup.get('min').valueChanges.debounceTime(500).subscribe((min: number) => {
      this.value.min = min;
      this._setValue();
    });
    this.numberFormGroup.get('max').valueChanges.debounceTime(500).subscribe((max: number) => {
      this.value.max = max;
      this._setValue();
    });
  }

  ngOnChanges() {
    this._creatFormControl();
    if (this._tools.isNotUndefined(this.value.min)) {
      this.numberFormGroup.get('min').setValue(this.value.min);
    }
    if (this._tools.isNotUndefined(this.value.max)) {
      this.numberFormGroup.get('max').setValue(this.value.max);
    }
  }


  /**
   * @description 设置表单数据
   * @protected
   * @memberof FilterNumberComponent
   */
  protected _setValue = (): void => {
    this.formControl.setValue(this.value);
  }

}
