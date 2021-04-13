import { Injectable } from '@angular/core';
import { EditProvider } from './edit';
import { FormControl, FormGroup } from '@angular/forms';
import { GroupDataType, EditDataType, EditChildTabType, ChildGroupDataType } from '../../interface/edit.interface';
import { ToolsProvider } from '../../serves/tools.service';
import { MsgService } from '../../serves/msg.service';
import { FormValidatorsService } from '../../serves/form-validators.service';
import { EditFieldsType } from '../../interface/approval.interface';


@Injectable()
export class EditFieldsDisplayProvider {

  constructor(
    private _editProvider: EditProvider,
    private _tools: ToolsProvider,
    public msg: MsgService,
    protected formValidators: FormValidatorsService,
  ) { }

  /** 设置主表隐藏字段 */
  public hideMasterFields = (
    form: FormGroup,
    editGroupData: Array<GroupDataType>,
    showFieldsSet: Set<string>
  ) => {
    this._tools.print(`显示字段:`);
    /** 主表数据集合 */
    const allData: Array<EditDataType> = this._setEditGroupData(editGroupData);
    allData.map((formControlItem) => {
      formControlItem.readonly = true;
      const formControlData: EditDataType = this._getMasterItemData(formControlItem.key, allData, form);
      if (showFieldsSet.has(formControlItem.key)) {
        formControlItem.isHidden = false;
        formControlItem.readonly = false;
        this._tools.print(`显示字段:设置显示字段:[${formControlData.placeholder}](${formControlData.key})`, 'g');
        if (formControlData.selector === 'hidden') {
          this._tools.print(`注意选择器为:hidden, 字段无法显示`, `y`);
        }
      } else if (formControlItem.value === '' && formControlData.selector !== 'hidden') {
        formControlItem.isHidden = true;
        this._tools.print(`显示字段:设置value为空的字段为隐藏字段:[${formControlData.placeholder}](${formControlData.key})`, 'b');
      }
    });
    form = this._editProvider.formatEditForm(editGroupData);
  }


  /** 设置主表隐藏字段 */
  public hideFields = (
    form: FormGroup,
    editGroupData: Array<GroupDataType>,
    showFieldsSet: Array<EditFieldsType>
  ) => {
    this._tools.print(`显示字段:`);
    /** 主表数据集合 */
    const allData: Array<EditDataType> = this._setEditGroupData(editGroupData);
    allData.map((formControlItem) => {
      formControlItem.readonly = true;
      formControlItem.isHidden = true;
      formControlItem.valids = [];
      formControlItem.formControl.clearValidators();
      formControlItem.formControl.setErrors(null);
      const formControlData: EditDataType = this._getMasterItemData(formControlItem.key, allData, form);
      if (showFieldsSet.findIndex(v => v.key === formControlItem.key) > -1) {
        let field: EditFieldsType = showFieldsSet.find(v => v.key === formControlItem.key);
        formControlItem.isHidden = false;
        if (field.readonly !== true) {
          formControlItem.readonly = false;
        }
        if (field.required === true || field.required===undefined) {
          formControlItem.valids = ['required'];
          formControlItem.formControl.setValidators(this.formValidators.required);
          formControlItem.formControl.updateValueAndValidity();
        }
        this._tools.print(`显示字段:设置显示字段:[${formControlData.placeholder}](${formControlData.key})`, 'g');
        if (formControlData.selector === 'hidden') {
          this._tools.print(`注意选择器为:hidden, 字段无法显示`, `y`);
        }
      } else if (formControlItem.value === '' && formControlData.selector !== 'hidden') {
        formControlItem.isHidden = true;
        this._tools.print(`显示字段:设置value为空的字段为隐藏字段:[${formControlData.placeholder}](${formControlData.key})`, 'b');
      }
    });
    // form = this._editProvider.formatEditForm(editGroupData);
  }

  /** 设置子表隐藏字段 */
  public hideChildrenFields = (
    childrenItem: any,
    childrenData: Array<EditChildTabType>
  ) => {
    this._tools.print(`子表显示字段:`);
    /** 子表数据集合 */
    childrenData.forEach(child => {
      child.hidden = true;
      for (let vs in childrenItem) {
        if (vs === child.moduleName) {
          child.hidden = false;
          this._tools.print(`显示子表模块:设置分组的hidden属性为false:${child.name}`, 'g');
        }
      }
      if (child.hidden) {
        return;
      }
      child.listData.forEach(groups => {
        this.setHiddenItem(
          child,
          groups,
          childrenItem
        )
      })
    })
  }
  /**hideChildrenFields 内部函数 */
  public setHiddenItem(child: EditChildTabType, groups: ChildGroupDataType, childrenItem: any,) {
    groups.groups.forEach(group => {
      group.fieldArray.forEach(childItem => {
        childItem.readonly = true;
        childItem.isHidden = true;
        childItem.valids = [];
        childItem.formControl.clearValidators();
        childItem.formControl.setErrors(null);
        childrenItem[child.moduleName].forEach((vd:EditFieldsType) => {
          if (childItem.key === vd.key) {
            childItem.isHidden = false;
            if (vd.readonly !== true) {
              childItem.readonly = false;
            }
            if (vd.required === true || vd.required===undefined) {
              childItem.valids = ['required'];
              childItem.formControl.setValidators(this.formValidators.required);
              childItem.formControl.updateValueAndValidity();
            }
            this._tools.print(`显示子表模块内字段:设置${childItem.placeholder}的hidden属性为false`, 'g');
          }
        });
      });
    })
  }

  /**
   *
   *设置分组的hidden属性为true false
   * @memberof EditFieldsDisplayProvider
   */
  public hideGroup = (editGroupData: Array<GroupDataType>) => {
    this._tools.print(`显示模块:`);
    editGroupData.forEach(group => {
      group.hidden = true;
      this._tools.print(`隐藏模块:设置分组的hidden属性为true:${group.name}`, 'g');
      for (let item of group.fieldArray) {
        if (!!item.isHidden === false && item.selector !== "hidden") {
          group.hidden = false;
          this._tools.print(`显示模块:设置分组的hidden属性为false:${group.name}`, 'g');
          break;
        }
      }
    })
    // console.log(editGroupData)

  }

  /** 设置主表显示字段 */
  public showMasterFields = () => { }

  /** 展开所有主表数据 */
  private _setEditGroupData = (editGroupData: Array<GroupDataType>): Array<EditDataType> => {
    /** 主表数据集合 */
    let allData: Array<EditDataType> = [];
    editGroupData.map((groupData: GroupDataType) => {
      allData = [...allData, ...groupData.fieldArray];
    });
    return allData;
  }

  /** 通过key获取主表数据 */
  private _getMasterItemData = (key: string, allData: Array<EditDataType>, form: FormGroup): EditDataType => {
    let result: EditDataType = { key: '', selector: 'input', placeholder: '' };
    allData.map((item) => {
      if (item.key === key) {
        result = item;
      }
    });
    if (result.key === '') {
      this._tools.print(`显示字段:无法在主表数据中找到key: ${key}`, 'r');
    }
    return result;
  }

  /**唯一值查询接口，(asyncOnly) */
  public getValid = async (formControl: FormControl): Promise<any> => {
    return new Promise((resolve) => {
      this.formValidators.asyncOnlyOne(formControl).subscribe((res) => {
        if (res.status === 1) {
          if (!res.payload.valid) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      })
    });
  }

  /**判断表单中是否存在唯一值，并返回查询结果 */
  public asyncOnly = async (editGroupData: Array<GroupDataType>, editForm: FormGroup, params: any): Promise<any> => {
    return new Promise((resolve) => {
      let isOk: boolean = true;
      let one: boolean = false, two: boolean = false, three: boolean = false;
      editGroupData.forEach((items, i) => {
        if (editGroupData.length === i + 1) {
          one = true;
        }
        items.fieldArray.forEach((item, s) => {
          if (items.fieldArray.length === s + 1) {
            two = true;
          }
          var formControl = editForm.get(item.key) as FormControl;
          if (Array.isArray(item.asyncValids) && item.asyncValids.length > 0) {
            item.asyncValids.forEach(async (asyncValid, v) => {
              if (item.asyncValids.length === v + 1) {
                three = true;
              }
              switch (asyncValid) {
                /** 唯一验证 */
                case 'only':
                  const asyncOnlyParams: any = {
                    table: params.childModuleName || params.Type || '',
                    key: item.key || '',
                    action: params.action || '',
                    moduleName: params.Type || '',
                  }
                  this.formValidators.setAsyncOnlyParams(asyncOnlyParams);
                  var validOk = await this.getValid(formControl);
                  if (!validOk) {
                    if (isOk) {
                      this.msg.toast(`当前${item.placeholder}在其他表单中存在`);
                      isOk = false;
                    }
                    resolve(false);
                  } else {

                    if (one && two && three) {
                      resolve(true);
                    }
                  }
                  break;
                default:
                  break;
              }
            });
          } else {
            if (one && two) {
              resolve(true);
            }
          }
        });
      });
    });
  }


}
