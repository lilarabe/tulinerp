import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { Modal, ModalController } from "ionic-angular";
import { SelectPage } from "../../../pages/select/select";
import { SheetlinkParamsType, SelectedDataType, SheetlinkFetchData } from "../../../interface/components/sheetlink.interface";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { AjaxService } from '../../../serves/ajax.service';
import { EditProvider } from '../../../providers/edit/edit';



@Component({
  selector: 'edit-sheetlink',
  templateUrl: 'edit-sheetlink.html'
})
export class EditSheetlinkComponent extends EditItemComponent {

  /* sheetlink 参数 */
  @Input() public sheetlinkParams: SheetlinkParamsType;

  public selectModal: Modal;

  /** 显示值 */
  @Input() public displayValue: string = '';

  /** 子表增加事件 */
  @Output() public sheetlinkChildAddEvent: EventEmitter<SheetlinkFetchData> = new EventEmitter();

  constructor(
    private modalCtrl: ModalController,
    protected validators: FormValidatorsService,
    protected _ajax: AjaxService,
    private _editProvider: EditProvider,
  ) {
    super(validators);
  }

  ngOnInit() { 
    
  }

  ngOnChanges() {
    this.init();
    
  }


  /** 打开选择列表页 */
  public toSelectPage = (): void => {
    if (this.readonly || this.disable) {
      return void 0;
    }
    this.sheetlinkParams.editData = this.inputFormGroup.value;
    this.sheetlinkParams.mainForm = this.mainForm;
    this.selectModal = this.modalCtrl.create(SelectPage, { ...this.sheetlinkParams, editModuleName: this.moduleName, action: this.action });
    this.selectModal.present();
    this.selectModal.onDidDismiss((data: { selectData: Array<SelectedDataType>, sheetlinkData: SheetlinkFetchData }) => {
      /** 向主表字段赋值 */
      const selectData: Array<SelectedDataType> = data.selectData || [];
      if (this.action === 'child') {
        this._editProvider.setFormValue(selectData, this.inputFormGroup, this.fieldData, this.childItemData.groups, this.mainForm, 'child');
      } else {
        this._editProvider.setFormValue(selectData, this.inputFormGroup, this.fieldData, this.editGroupData, this.mainForm, 'main');
      }
      /** 向子表插入数据 */
      if (data.sheetlinkData && data.sheetlinkData.relation) {
        /**
         * 通过 output 向上传入到 editPage 处理 子表新增
         */
        this.sheetlinkChildAddEvent.emit(data.sheetlinkData);
      }
    });
  }

}