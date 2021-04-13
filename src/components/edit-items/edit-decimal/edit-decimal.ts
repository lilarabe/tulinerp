import { Component } from '@angular/core';
import { EditItemComponent } from '../edit-item/edit-item';
import { FormValidatorsService } from '../../../serves/form-validators.service';


/** 浮点型选择器 */
@Component({
  selector: 'edit-decimal',
  templateUrl: 'edit-decimal.html'
})
export class EditDecimalComponent extends EditItemComponent {

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  /** 阻止输入字符事件 android端无法触发该事件 */
  public onKeypress = (e: any) => {
    const charsets: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '.'];
    const key: string = e.key;
    if (charsets.indexOf(key) === -1) {
      return false;
    } else {
      return true;
    }
  }


}
