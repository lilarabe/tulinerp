import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { ModalController, NavController } from 'ionic-angular';
import { ToolsProvider } from '../../../serves/tools.service';
import { EditTextareaEditComponent } from "./edit-textarea-edit/edit-textarea-edit";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-textarea',
  templateUrl: 'edit-textarea.html'
})
export class EditTextareaComponent extends EditItemComponent {

  constructor(
    private _tools: ToolsProvider,
    private _modalCtrl: ModalController,
    protected validators: FormValidatorsService,
    private _navCtrl: NavController,
  ) {
    super(validators);
  }


  /**
   * @description 跳转到编辑页
   * @memberof EditTextareaComponent
   */
  public toEditPage = (): void => {
    /** 传送数据 */
    const postModalData: any = {
      value: this.formControl.value,
      placeholder: this.placeholder,
    };
    if (this.readonly || this.disable) {
      // 提示
    } else {
      this._toModalEdit(postModalData);
    }
  }



  /**
   * @description 打开modal编辑
   * @private
   * @memberof EditTextareaComponent
   */
  private _toModalEdit = (postModalData): void => {
    const modal = this._modalCtrl.create(EditTextareaEditComponent, postModalData);
    modal.present();
    /** 关闭 modal 赋值 */
    modal.onDidDismiss((value: string) => {
      if (!this._tools.isUndefined(value)) {
        this.formControl.setValue(value);
      }
    });
  }


  /** push 到 textarea 编辑页 */
  public pushEditTextareaPage = (): void => {
    const value: string = this.formControl.value;
    const placeholder: string = this.placeholder;
    const callback: Function = (textareaVal: string):void => {
      if(this.readonly || this.disable){
        return;
      }
      this.formControl.setValue(textareaVal);
    };
    this._navCtrl.push(EditTextareaEditComponent, { value, placeholder, callback });
  }

}
