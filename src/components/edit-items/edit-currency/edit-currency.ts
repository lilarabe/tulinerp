import { Component } from '@angular/core';
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { EditItemComponent } from '../edit-item/edit-item';


@Component({
  selector: 'edit-currency',
  templateUrl: 'edit-currency.html'
})
export class EditCurrencyComponent extends EditItemComponent {

  public isFocus: boolean = false;

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  public blurInput = async (e) => {
    this.isFocus = false;
  }

  public focusInput = async (e) => {
    this.isFocus = true;
  }

  public changeInput = (e) => {

  }

}
