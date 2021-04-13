import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { ToolsProvider } from "../../../serves/tools.service";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-date',
  templateUrl: 'edit-date.html'
})
export class EditDateComponent extends EditItemComponent {

  protected _displayFormat: string = "YYYY-MM-DD";

  protected _pickerFormat: string = "YYYY-MM-DD";

  /** Input 数据 */
  @Input() public minDate: string = '1970-01-01 12:00:00';
  @Input() public maxDate: string = '2100-12-31 12:00:00';
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


  constructor(
    protected tools: ToolsProvider,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    /** 日期字符串转换 */
    // this.maxDate = this.tools.dataStrFormat(this.maxDate, 'date');
    // this.minDate = this.tools.dataStrFormat(this.minDate, 'date');
    this.formControl.setValue(this.tools.dataStrFormat(this.formControl.value, 'date'));
  }

  ngOnChanges() {
  }

}
