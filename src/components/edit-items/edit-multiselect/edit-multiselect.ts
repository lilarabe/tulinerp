import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';



@Component({
  selector: 'edit-multiselect',
  templateUrl: 'edit-multiselect.html'
})
export class EditMultiselectComponent extends EditItemComponent {

  public selectData:Array<any> = [];

  constructor(
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.selectData = this.formControl.value.split(",");
  }

  public doSelect = ():void => {
    this.formControl.setValue(this.selectData.join(','));
  }
  
}
