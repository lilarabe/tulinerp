import { Component } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { Modal, ModalController } from 'ionic-angular';
import { MultilevelPage } from '../../../pages/multilevel/multilevel'
import { MsgService } from '../../../serves/msg.service';
import { FormControl } from '@angular/forms';
import { AjaxService, AjaxServiceLoadDataType } from '../../../serves/ajax.service';
// import { SelectedDataType, SheetlinkFetchData } from 'interface/components/sheetlink.interface';
// import { EditProvider } from '../../../providers/edit/edit';

@Component({
  selector: 'edit-multilevel',
  templateUrl: 'edit-multilevel.html'
})
export class EditMultilevelComponent extends EditItemComponent {
  public canSelectParent: boolean = true;

  public selectData: Array<string> = [];
  public displayData: string = ''

  // constructor(
  //   protected validators: FormValidatorsService,
  // ) {
  //   super(validators);
  // }
  public selectModal: Modal;

  public postData: any = {};

  /**附属的一个值，为了与pc对应 */
  public auxiliary: FormControl;
  constructor(
    private modalCtrl: ModalController,
    protected validators: FormValidatorsService,
    private _msg: MsgService,
    private ajax: AjaxService,
    // private _editProvider: EditProvider,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    if (!this.inputFormControlName.includes('_name')) {
      this.auxiliary = this.inputFormGroup.get(this.inputFormControlName + '_name') as FormControl;
      if (this.formControl) {
        this.formControl.valueChanges.subscribe((value) => {
          this.setInit();
          if (value === '') {
            this.selectData = [];
            this.displayData = '';
            this.auxiliary.setValue('');
          }
        });
      }
    }
    this.selectData = this.formControl.value.split(",");
    if (this.valueArray && this.valueArray.length > 0) {
      this.setDisplayData();
    } else {
      this.displayData = this.formControl.value;
    }
    if (this.fieldData.props) {
      this.canSelectParent = (JSON.parse(this.fieldData.props)).checkStrictly === undefined ? true : (JSON.parse(this.fieldData.props)).checkStrictly;
    }
  }

  /**值发生改变，修改数据 */
  setInit() {
    if (!this.inputFormControlName.includes('_name')) {
      this.auxiliary = this.inputFormGroup.get(this.inputFormControlName + '_name') as FormControl;
    }
    this.selectData = this.formControl.value.split(",");
    if (this.valueArray && this.valueArray.length > 0) {
      this.setDisplayData();
    } else {
      this.displayData = this.formControl.value;
    }
  }


  setDisplayData() {
    let ArrayD = this.valueArray;
    this.displayData = '';
    if (this.selectData.length < 1 || this.selectData[0].length < 1) {
      return;
    }
    this.selectData.forEach(v => {
      if(!ArrayD){
        return;
      }
      let nowData = ArrayD.find(c => c.value === v);
      if (nowData) {
        this.displayData += this.displayData.length > 0 ? '/' + nowData.label : '' + nowData.label;
        ArrayD = nowData.children;
      } else {
        return;
      }
    });
  }

  public doSelect(e: Array<string>) {
    this.selectData = e;
    this.formControl.setValue(this.selectData.join(','));
  }

  /** 打开选择列表页 */
  public toSelectPage = async () => {
    if (this.readonly || this.disable) {
      return void 0;
    }
    //重新获取字段内容
    // let resolve = await this.getValueArray();
    // this.valueArray = resolve.options;
    // this.canSelectParent = (JSON.parse(resolve.props)).checkStrictly === undefined ? true : (JSON.parse(resolve.props)).checkStrictly;
    if (!this.valueArray || this.valueArray.length < 1) {
      this._msg.toast("没有可供选择的值！");
      return;
    }
    if (this.inputFormControlName.includes('_name')) {
      this._msg.toast("该字段无法修改！");
      return;
    }
    let temporary = JSON.parse(JSON.stringify(this.selectData));
    this.selectModal = this.modalCtrl.create(MultilevelPage, { selectData: temporary, valueArray: this.valueArray, canSelectParent: this.canSelectParent });
    this.selectModal.present();
    this.selectModal.onDidDismiss(async (data: { selectData: Array<string> }) => {
      /** 向主表字段赋值 */
      if (data.selectData.length < 1) {
        return;
      }
      this.selectData = data.selectData || [];
      this.setDisplayData();
      this.formControl.setValue(this.selectData.join(','));
      this.auxiliary.setValue(this.displayData);
      // let selectData: Array<SelectedDataType> = [];
      // const sheetlinkData: SheetlinkFetchData = await this.getMultilevelData(this.selectData);
      // if (sheetlinkData && sheetlinkData.Main) {
      //   selectData = [];
      //   for (let key in sheetlinkData.Main) {
      //     if (key === this.inputFormControlName) {
      //       continue;
      //     }
      //     const item: SelectedDataType = { key, value: sheetlinkData.Main[key].value, displayValue: sheetlinkData.Main[key].displayValue };
      //     selectData.push(item);
      //   }
      //   if (selectData.length<1) {
      //     return;
      //   }
      //   if (this.action === 'child') {
      //     this._editProvider.setMasterFieldsData(selectData, this.childItemData.groups);
      //     // this._editProvider.setFormValue(selectData, this.inputFormGroup, this.fieldData, this.childItemData.groups, this.mainForm, 'child');
      //   } else {
      //     this._editProvider.setMasterFieldsData(selectData, this.editGroupData);
      //     // this._editProvider.setFormValue(selectData, this.inputFormGroup, this.fieldData, this.editGroupData, this.mainForm, 'main');
      //   }

      // }
    });
  }

  /** 获取valueArray数据 */
  public getValueArray = async (): Promise<any> => {
    return new Promise((resolve) => {
      if (this.action === 'child') {
        this.postData.currentData = {
          main: this.mainForm.value,
          sub: this.inputFormGroup.value,
        }
      } else {
        this.postData.currentData = {
          main: this.inputFormGroup.value,
          sub: {}
        }
      }
      this.ajax.loadData({
        title: '请求级联数据',
        method: "post",
        uri: 'workflow.php',
        params: {
          Type: "Cascader",
          workFlowId: this.fieldData.params.workFlowId,
          field: this.inputFormControlName
        },
        data: {
          data: this.postData,
        },
      }).subscribe((res) => {
        if (res.status === 1) {
          resolve(res.payload);
        } else {
          resolve({ options: [], props: '' })
        }
      });
    })
  }

  /**获取动态表单数据 */
  public getMultilevelData = (selectData): Promise<any> => {
    let _formValue = JSON.parse(JSON.stringify(this.inputFormGroup.value));
    // _formValue[this.inputFormControlName]=selectData[selectData.length-1];
    if (this.action === 'child') {
      this.postData.currentData = {
        main: this.mainForm.value,
        sub: _formValue,
      }
    } else {
      this.postData.currentData = {
        main: _formValue,
        sub: {}
      }
    }
    this.postData.choseData = selectData[selectData.length - 1];
    const detailParams: AjaxServiceLoadDataType = {
      title: 'multilevel',
      method: 'post',
      uri: 'workflow.php',
      params: {
        Type: this.fieldData.params.moduleName,
        DoWorkflow: this.fieldData.params.workFlowId,
      },
      data: this.postData,
    };
    return new Promise((resolve) => {
      this.ajax.loadData(detailParams).subscribe(res => {
        if (res.status === 1 && (res.payload.Main || res.payload.relation)) {
          resolve(res.payload);
        } else {
          resolve(null)
        }
      });
    });
  }

}

