import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FilterDataType, SendFilterItemEventType } from "../../interface/filter.interface";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";



/**
 * @description 列表页筛选
 * @author da
 * @export
 * @class ListFilterComponent
 */
@Component({
  selector: 'list-filter',
  templateUrl: 'list-filter.html'
})
export class ListFilterComponent {

  /** 过滤数据 */
  public filterData: FilterDataType[] = [];

  /*表单*/
  public filterForm: FormGroup;

  constructor(
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _navParams: NavParams,
  ) {
    this.filterData = this._navParams.get('filterData');
    this.filterForm = this._creatForm(this.filterData);
    // console.log(this.filterData);
  }


  /**
   * @description 根据数据生成表单
   * @private
   * @memberof ListFilterComponent
   */
  private _creatForm = (filterData: FilterDataType[] = []): FormGroup => {
    const formGroup = this._fb.group({});
    filterData.forEach((v: FilterDataType) => {
      const formControl = new FormControl();
      formControl.setValue(v.value || "");
      formGroup.addControl(v.key, formControl);
    });
    return formGroup;
  }


  /**
   * @description 获取选择器中的值该表
   * @memberof ListFilterComponent
   */
  public getSelectorValueChangeEvent = (changeData: SendFilterItemEventType): void => {
    console.log(changeData);
  }


  /**
   * @description 取消
   * @memberof ListFilterComponent
   */
  public dismiss = (): void => {
    this._viewCtrl.dismiss();
  }


  /**
   * @description 确定选择
   * @memberof EditAutocompleteSelectComponent
   */
  public ok = (): void => {
    const resultArray: Array<{selector:string, key:string, value: any}> = [];
    const resultObj: any = {};
    for(const item in this.filterForm.value){
      for ( const item2 of this.filterData ) {
        if (item2.key === item) {
          const value: any = {};
          value.selector = item2.selector;
          value.value = this.filterForm.value[item];
          value.key = item;
          resultArray.push(value);

          resultObj[item] = {selector: value.selector, value: value.value};
        }
      }
    }
    // console.log(resultArray);
    // console.log(resultObj);
    this._viewCtrl.dismiss(resultArray);
  }

}
