import { Component, Input, OnInit, OnChanges, } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GroupDataType, EditDataType, EditChildTabType, ChildGroupDataType } from "../../../interface/edit.interface";
import { FormValidatorsService } from '../../../serves/form-validators.service';

/**
 * @description 编辑页选择器基类
 * @author da
 * @export
 * @class EditItemComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'edit-item',
  template: '<div>EditItemComponent</div>'
})
export class EditItemComponent implements OnInit, OnChanges {

  /*主表表单数据*/
  @Input() public editGroupData: Array<GroupDataType>;
  @Input() public selector: string = "input";
  @Input() public placeholder: string = "";
  @Input() public tips: string = "";
  @Input() public inputFormControlName: string = "";
  @Input() public inputFormGroup: FormGroup;
  @Input() public valids: Array<string> = [];
  @Input() public asyncValids: Array<string> = [];
  @Input() public readonly: boolean = false;
  @Input() public disable: boolean = false;
  @Input() public maxlength: number;
  @Input() public moduleName: string;
  @Input() public value: any;
  @Input() public fieldData: EditDataType;
  // @Output() public valueChange: EventEmitter<any> = new EventEmitter();
  @Input() public isHidden: boolean = false;
  /** 新增 or 编辑 edit or add */
  @Input() public action: string = '';
  /** 请求参数 */
  @Input() public requireData: any = {};
  /** select radiobox 选项 */
  @Input() public valueArray: Array<any> = [];
  /** 当前子表数据 */
  @Input() public childData: EditChildTabType = null;
  /** 当前单条子表数据 */
  @Input() public childItemData: ChildGroupDataType = null;
  /** 主表表单 */
  @Input() public mainForm: FormGroup;

  public formControl: FormControl;

  constructor(
    protected validators: FormValidatorsService,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.init();
  }

  /**
   * @description 初始化
   * @protected
   * @memberof EditItemComponent
   */
  protected init = (): void => {
    this.formControl = this.inputFormGroup.get(this.inputFormControlName) as FormControl;
    // this.setDisable();
    this._setTips();
    setTimeout(() => {
      this._setAasyncValidators();
    });
  }

  /**
   * @description formControl设置disable属性
   * @protected
   * @memberof EditItemComponent
   */
  protected setDisable = (): void => {
    if (this.disable) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  /**
   * @description 设置异步验证器
   * @private
   * @memberof EditItemComponent
   */
  private _setAasyncValidators = (): void => {
    // const valids: Array<AsyncValidatorFn> = [];
    if (Array.isArray(this.asyncValids) && this.asyncValids.length > 0) {
      this.asyncValids.forEach(async(asyncValid) => {
        switch (asyncValid) {
          /** 唯一验证 */
          case 'only':
            const asyncOnlyParams: any = {
              table: this.requireData.childModuleName || this.requireData.Type || '',
              key: this.inputFormControlName || '',
              action: this.requireData.action || '',
              moduleName: this.requireData.Type || '',
            }
            this.validators.setAsyncOnlyParams(asyncOnlyParams);
            // this.validators.asyncOnlyOne(this.formControl).subscribe((res)=>{
            //  if(res.status===1){
            //    if(!res.payload.valid){
            //     this.msg.toast(`存在重复数据，请勿重复提交！`);
            //    }
            //  }
            // })
            // valids.push(this.validators.asyncOnly);
            // valids.push(this.validators.asyncOnlyPromis);
            break;
          default:
            break;
        }
      });
      // this.formControl.setAsyncValidators(valids);
      // this.formControl.updateValueAndValidity();
      // this.formControl.clearAsyncValidators();
    }
  }


  /** 设置 tips */
  private _setTips = (): void => {
    /** 如果只读并且value为空 tips 不显示 */
    if(this.formControl.value === '' && this.readonly === true){
      this.tips = '';
    }
  }

}
