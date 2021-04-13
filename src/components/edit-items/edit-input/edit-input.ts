import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';

@Component({
  selector: 'edit-input',
  templateUrl: 'edit-input.html'
})
export class EditInputComponent extends EditItemComponent {

  /** 显示值 */
  @Input() public displayValue: string = '';

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  

}
