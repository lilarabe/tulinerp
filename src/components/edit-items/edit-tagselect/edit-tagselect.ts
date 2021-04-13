import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-tagselect',
  templateUrl: 'edit-tagselect.html'
})
export class EditTagselectComponent extends EditItemComponent {

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  public doSelect = (selectedItem): void => {
    this.formControl.setValue(selectedItem.value);
  }

}
