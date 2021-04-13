import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { AutocompletePostParamsType, AutocompletePostDataType } from "../../../../interface/components/autocomplete.interface";
import { AjaxService } from "../../../../serves/ajax.service";
import { ToolsProvider } from '../../../../serves/tools.service';


@Component({
  selector: 'edit-autocomplete-select',
  templateUrl: 'edit-autocomplete-select.html',
  host: { "class": "edit-autocomplete-select" },
})
export class EditAutocompleteSelectComponent {

  /** 传入的 value */
  public value: string = "";

  /** 传入的 placeholder */
  public placeholder: string = "";

  /** 下拉数据 */
  public autocompleteOptions: Array<string> = [];

  /** 发送的 get 数据 */
  private _autocompletePostParams: AutocompletePostParamsType = { tableName: '', moduleName: '' };

  /**发送的 post 数据 */
  private _autocompletePostData: AutocompletePostDataType = { value: '', key: '' };


  constructor(
    private _viewCtrl: ViewController,
    private _navParams: NavParams,
    private _ajax: AjaxService,
    private _tools: ToolsProvider,
  ) {

  }

  ionViewDidLoad(): void {
    this._init();
  }



  /**
   * @description 初始化 传入的数据
   * @private
   * @memberof EditAutocompleteSelectComponent
   */
  private _init = (): void => {
    this.value = this._navParams.get('value') || '';
    this.placeholder = '请输入或选择' + this._navParams.get('placeholder') || '';
    this._autocompletePostData.key = this._navParams.get('key') || '';
    this._autocompletePostParams.tableName = this._navParams.get('tableName') || '';
    this._autocompletePostParams.moduleName = this._navParams.get('moduleName') || '';
    this.onInput();
  }

  /**
   * @description 取消
   * @memberof SelectPage
   */
  public dismiss = (): void => {
    this._viewCtrl.dismiss();
  }



  /**
   * @description 确定选择
   * @memberof EditAutocompleteSelectComponent
   */
  public doSelect = (val: string): void => {
    this._viewCtrl.dismiss(val);
  }



  /**
   * @description 当输入时
   * @memberof EditAutocompleteSelectComponent
   */
  public onInput = (): void => {
    this._autocompletePostData.value = this.value;
    this._getAutocompleteData();
  }


  /**
   * @description 选择 option
   * @memberof EditAutocompleteSelectComponent
   */
  public optionSelected = (option: string): void => {
    this._viewCtrl.dismiss(option);
    this.autocompleteOptions = [];
  }


  /**
   * @description 请求下拉数据
   * @private
   * @memberof EditAutocompleteSelectComponent
   */
  private _getAutocompleteData = (): void => {
    this._ajax.loadData({
      // method: 'get',
      // url: 'assets/data/autocomplete.data.json',
      method: 'post',
      uri: 'autocomplete.php',
      title: '自动下拉数据',
      params: this._autocompletePostParams,
      data: this._autocompletePostData
    }).subscribe(res => {
      if (this._tools.isArray(res.payload.data)) {
        this.autocompleteOptions = res.payload.data;
      }
    });
  }


}
