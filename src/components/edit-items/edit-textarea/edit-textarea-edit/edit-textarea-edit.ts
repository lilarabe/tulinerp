import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';



@Component({
  selector: 'edit-textarea-edit',
  templateUrl: 'edit-textarea-edit.html'
})
export class EditTextareaEditComponent {

  /** 传入的 value */
  public value: string = "";

  /** 传入的 placeholder */
  public placeholder: string = "";

  @ViewChild('textarea') textareaRef:ElementRef;

  constructor(
    private _viewCtrl: ViewController,
    private _navParams: NavParams,
    private _navCtrl: NavController,
  ) {
  }

  ionViewDidLoad(): void {
    this._init();
  }

  /**
   * @description 初始化 传入的数据
   * @private
   * @memberof EditTextareaEditComponent
   */
  private _init = (): void => {
    this.value = this._navParams.get('value') || '';
    this.placeholder = this._navParams.get('placeholder') || '';
  }


  /**
 * @description 确定
 * @memberof EditTextareaEditComponent
 */
  public ok = (): void => {
    const textareaRefVal: string = this.textareaRef.nativeElement.innerText;
    // this._viewCtrl.dismiss(textareaRefVal);
    const callback = this._navParams.get('callback');
    callback(textareaRefVal);
    this._navCtrl.pop();
  }


  /**
 * @description 取消
 * @memberof EditTextareaEditComponent
 */
  public dismiss = (): void => {
    this._viewCtrl.dismiss();
  }

}
