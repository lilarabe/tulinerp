import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-hidden',
  templateUrl: 'edit-hidden.html'
})
export class EditHiddenComponent extends EditItemComponent {

  @Input() public type: string = "text";

  /** 显示值 */
  @Input() public displayValue: string = '';

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

}
