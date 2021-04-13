import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { ToolsProvider } from "../../../serves/tools.service";
import { FormValidatorsService } from '../../../serves/form-validators.service';

@Component({
  selector: 'edit-datetime',
  templateUrl: 'edit-datetime.html'
})
export class EditDatetimeComponent extends EditItemComponent {
  @Input() public minDate: string = '1970-01-01 12:00:00';
  @Input() public maxDate: string = '2100-12-31 12:00:00';
  @Input() public type: string = 'datetime';

  protected _displayFormat: string = "HH:mm";

  protected _pickerFormat: string = "HH:mm";

  public datetimeValue: string = "";

  constructor(
    protected tools: ToolsProvider,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  @Input()
  get displayFormat(): string {
    return this._displayFormat;
  }
  set displayFormat(res: string) {
    this._displayFormat = res;
  }

  get pickerFormat(): string {
    return this._pickerFormat;
  }
  set pickerFormat(res: string) {
    this._pickerFormat = res;
  }

  ngOnInit() {
    this.init();
    if (this.type === "datetime") {
      /* 日期字符串转换 */
      this.datetimeValue = this.tools.dataStrFormat(this.formControl.value, 'iso');
      /* 显示时间样式 = 选择时间样式 */
      this.pickerFormat = this.displayFormat;
    } else {
      this.datetimeValue = this.tools.dataStrFormat(this.formControl.value, 'yearmonth');;
      /* 显示时间样式 = 选择时间样式 */
      this.pickerFormat = this.displayFormat;
    }
    /**
     * 监控 this.formControl 的 valueChange 事件
     * 实现 字段清空
     */
    if(this.formControl){
      this.formControl.valueChanges.subscribe((value)=>{
        if(value === ''){
          this.datetimeValue = '';
        }
      });
    }
  }


  ngOnChanges() {
  }


  /**
   * @description 日期改变 setValue
   * @memberof EditDatetimeComponent
   */
  public datetimeChange = (): void => {
    const inputValue: string = this.tools.dataStrFormat(this.datetimeValue, this.type);
    this.formControl.setValue(inputValue);
  }



}
