import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-toggle',
  templateUrl: 'edit-toggle.html'
})
export class EditToggleComponent extends EditItemComponent {
  public toggleValue: boolean=false;

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.formControl.setValue(this.formControl.value==true);
  }
}
