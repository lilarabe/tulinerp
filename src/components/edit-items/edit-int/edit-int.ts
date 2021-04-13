import { Component } from '@angular/core';
import { EditItemComponent } from '../edit-item/edit-item';
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-int',
  templateUrl: 'edit-int.html'
})
export class EditIntComponent extends EditItemComponent {

  // public value: string = '';

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);

    
  }

  ngAfterViewInit(): void {
  }

  /** 阻止输入字符事件 android端无法触发该事件 */
  public onKeypress = (e: any) => {
    const charsets: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
    const key: string = e.key;
    if (charsets.indexOf(key) === -1) {
      return false;
    } else {
      return true;
    }
  }

  /** 替换小数部分 */
  public onChange = (e: any) => {
    const reg: RegExp = /^-?\d*$/i;
    const isInt: boolean = reg.test(this.value);
    // console.log(`value:${this.value}, isInt:${isInt}`);
    if(!isInt){
      e.value = this.value = this.value.replace(/\.\d+/ig, '');
    }
  }

}
