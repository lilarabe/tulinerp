import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { Modal, ModalController } from "ionic-angular";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { EditMultisheetlinkSelectComponent } from './edit-multisheetlink-select/edit-multisheetlink-select';
import { MultisheetlinkParamsType } from '../../../interface/components/multisheetlink.interface';



@Component({
  selector: 'edit-multisheetlink',
  templateUrl: 'edit-multisheetlink.html'
})
export class EditMultisheetlinkComponent extends EditItemComponent {

  /* multisheetlink 参数 */
  @Input() public multisheetlinkParams: MultisheetlinkParamsType;

  public selectModal: Modal;

  /** 显示值 */
  @Input() public displayValue: string = '';

  constructor(
    private modalCtrl: ModalController,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }



  /**
   * @description 打开选择列表页
   * @memberof EditSheetlinkComponent
   */
  public toSelectPage = (): void => {
    if ( this.readonly || this.disable ) {
      return void 0;
    }
    this.selectModal = this.modalCtrl.create(EditMultisheetlinkSelectComponent, this.multisheetlinkParams);
    this.selectModal.present();
    this.selectModal.onDidDismiss((strSelectedData) => {
      if(strSelectedData !== 'cancel'){
        this.formControl.setValue(strSelectedData);
      }
    });
  }

}
