import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from "../../../serves/form-validators.service";

@Component({
  selector: 'edit-mobile',
  templateUrl: 'edit-mobile.html'
})
export class EditMobileComponent extends EditItemComponent {

  constructor(
    protected _formValidators: FormValidatorsService,
    
  ) {
    super(_formValidators);
  }

}
