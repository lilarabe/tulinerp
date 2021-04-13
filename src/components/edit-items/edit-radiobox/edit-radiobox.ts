import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-radiobox',
  templateUrl: 'edit-radiobox.html'
})
export class EditRadioboxComponent extends EditItemComponent {

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

}
