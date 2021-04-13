import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { ToolsProvider } from '../../../serves/tools.service';
import { AutocompleteParams, AutocompletePostSelectModalType } from "../../../interface/components/autocomplete.interface";
import { ModalController } from 'ionic-angular';
import { EditAutocompleteSelectComponent } from "./edit-autocomplete-select/edit-autocomplete-select";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-autocomplete',
  templateUrl: 'edit-autocomplete.html'
})
export class EditAutocompleteComponent extends EditItemComponent {

  /** autocomplete 参数 */
  @Input() public autocompleteParams: AutocompleteParams;

  constructor(
    private _tools: ToolsProvider,
    private _modalCtrl: ModalController,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }


  /**
   * @description 打开选择页
   * @memberof EditAutocompleteComponent
   */
  public toSelectPage = (): void => {
    if (this.readonly || this.disable) {
      return void 0;
    }
    /** 发送到选择页的数据 */
    const postSelectModalData: AutocompletePostSelectModalType = {
      value: this.formControl.value,
      placeholder: this.placeholder,
      key: this.inputFormControlName,
      tableName: this.autocompleteParams.tableName,
      moduleName: this.autocompleteParams.moduleName,
    };
    const modal = this._modalCtrl.create(EditAutocompleteSelectComponent, postSelectModalData);
    modal.present();
    /** 关闭 modal 赋值 */
    modal.onDidDismiss((value: string) => {
      if (this._tools.isNotUndefined(value)) {
        this.formControl.setValue(value);
      }
    });
  }

}
