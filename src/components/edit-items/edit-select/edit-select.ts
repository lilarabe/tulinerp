import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-select',
  templateUrl: 'edit-select.html'
})
export class EditSelectComponent extends EditItemComponent {

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }


}
