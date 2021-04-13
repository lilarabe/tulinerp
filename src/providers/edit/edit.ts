import { Injectable } from '@angular/core';
import { AjaxService, AjaxServiceLoadDataType, ResponseDataType } from "../../serves/ajax.service";
import { Observable } from "rxjs/Observable";
import { ToolsProvider } from "../../serves/tools.service";
import { FormControl, FormGroup, AsyncValidatorFn, FormBuilder, FormArray } from "@angular/forms";
import { AddDefaultTrigger, ChildGroupDataType, DeleteChildrenDataType, EditChildTabType, EditDataType, GroupDataType, PostChildrenDataType, PostEditDataType, StepsData } from "../../interface/edit.interface";
import { FormValidatorsService } from "../../serves/form-validators.service";
import { MsgService } from '../../serves/msg.service';
import { Content } from 'ionic-angular';
import { NoPromptEnum, SelectedDataType, SheetlinkChildData, SheetlinkFetchData, SheetlinkGetData, SheetlinkParamsType, SheetlinkPostData } from '../../interface/components/sheetlink.interface';
import { ApprovalSubmitParams, EditFieldsType } from '../../interface/approval.interface';
import { EditorTabsLabel } from '../../components/editor/editor-tabs/editor-tabs';

@Injectable()
export class EditProvider {

  constructor(
    private _ajax: AjaxService,
    private _tools: ToolsProvider,
    private _validator: FormValidatorsService,
    private _msg: MsgService,
    private _fb: FormBuilder,
  ) {
  }

  public content: Content;

  /**
   * @description 获取数据
   * @memberof EditProvider
   */
  public getData = (params: any = {}): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      title: '请求编辑数据',
      method: 'get',
      // url: 'assets/data/edit1.data.json',
      // url: 'assets/data/add.data01.json',
      // uri: 'add.php',
      uri: 'add_update.php',
      params: params,
    }).delay(0);
  }


  /**
   * @description 提交数据
   * @memberof EditProvider
   */
  public postData = (params, data: PostEditDataType): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      // uri: 'input.php',
      uri: 'save_input.php',
      method: 'post',
      title: '保存请求',
      params: params,
      isLoading: true,
      timeout: 300000,
      // delay:2000,
      // loadingCss:'loading-delay',
      data: data,
    });
  }


    /**
   * @description 获取该表单是否冲突
   * @memberof EditProvider
   */
  public getConflict = (params): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      // uri: 'input.php',
      uri: 'save_input.php',
      method: 'get',
      title: '获取该表单是否冲突',
      params: params,
      timeout: 300000,
      // delay:2000,
      // loadingCss:'loading-delay',
    });
  }

  /**
   * @description 设置默认数据结构
   * @memberof EditProvider
   */
  public setDefaultEditListData = (arr: Array<EditDataType>): any => {
    const defalutData: EditDataType = {
      key: '',
      placeholder: '',
      selector: 'input',
      value: '',
      disable: false,
      isHidden: false,
      valids: [],
    };
    if (!Array.isArray(arr)) {
      arr = [];
    }
    arr.map(v => {
      v = { ...v, ...defalutData };
      v.selector = v.selector.replace(/\s+/g, "");
      if (Array.isArray(v.valueArray)) {
        v.valueArray.map((selectItem) => {
          selectItem.isHidden = false;
        });
      }
    });
    return arr;
  }

  /** 分组是否存在必填字段 */
  public hasRequiredFields = (fieldArray: Array<EditDataType>): boolean => {
    let hasRequired: boolean = false;
    fieldArray.forEach((field) => {
      if (field.valids.find(valid => valid === 'required')) hasRequired = true;
    });
    return hasRequired;
  }

  /** 创建子表表单 */
  public formatChildrenForm = (chilerenData: Array<EditChildTabType>): FormArray => {
    const chilerenForm: FormArray = this._fb.array([]);
    if (Array.isArray(chilerenData)) {
      chilerenData.forEach((child) => {
        const tableFormGroup: FormGroup = this._fb.group({});
        if (Array.isArray(child.listData)) {
          const formArray: FormArray = this._fb.array([]);
          child.listData.forEach((childGroup) => {
            let formGroup: FormGroup = this._fb.group({});
            if (Array.isArray(childGroup.groups)) {
              formGroup = this.formatEditForm(childGroup.groups);
              formArray.push(formGroup);
            }
          });
          const tableName: string = child.moduleName;
          tableFormGroup.addControl(tableName, formArray);
          chilerenForm.push(tableFormGroup);
        }
      });

    }

    return chilerenForm;
  }

  /**
   * @description 设置EditForm
   * @memberof EditProvider
   */
  public formatEditForm = (groups: Array<GroupDataType>): FormGroup => {
    /*表单*/
    const form = this._fb.group({});
    if (this._tools.isArray(groups)) {
      groups.map((v) => {
        if (!Array.isArray(v.fieldArray)) {
          v.fieldArray = [];
        }
        v.fieldArray.map((field: EditDataType) => {
          const formControl = this.fieldCreatFormControl(field);
          form.addControl(field.key, formControl);
          field.formControl = formControl;
        });
      });
    }
    return form;
  }

  /** 设置子表数据 */
  public setChildrenData = (chilerenData: Array<EditChildTabType>) => {
    /** 增加操作字段 caozuo */
    const editField: EditDataType = {
      key: 'caozuo',
      placeholder: '操作',
      selector: 'input',
      value: '',
      valids: [],
      isHidden: true,
    };
    if (Array.isArray(chilerenData)) {
      chilerenData.forEach((child) => {
        const form: FormGroup = this._fb.group({});
        const metaData = child.metaData;

        if (Array.isArray(metaData.groups)) {
          metaData.groups.forEach((group, groupIndex) => {
            if (Array.isArray(group.fieldArray)) {
              /** 增加操作字段 caozuo */
              if (groupIndex === 0) {
                group.fieldArray.unshift(editField);
              }
              group.fieldArray.forEach((field) => {
                const formControl = this.fieldCreatFormControl(field);
                form.addControl(field.key, formControl);
                field.formControl = formControl;
              });
            }
          });
          this.setMetaData(metaData.groups);
        }

        child.listData.forEach((group) => {
          if (Array.isArray(group.groups)) {
            group.groups[0].fieldArray.unshift(editField);
            this.setMetaData(group.groups);
          }
        });

        child.oldData = {
          name: child.name,
          moduleName: child.moduleName,
          hidden: child.hidden,
        };

        child.metaForm = form;
      });
      // console.log(chilerenData);
    }
  }

  /** 字段 转换 formControl */
  public fieldCreatFormControl = (field: EditDataType): FormControl => {
    const defaultValue = field.value;
    const formControl = new FormControl(defaultValue);
    /** 设置静态验证器 */
    this.setValidatorFn(formControl, field.valids || []);
    return formControl;
  }

  /**
   * 设置验证器
   * @param formControl 
   * @param validsArr 
   */
  public setValidatorFn = (formControl: FormControl, validsArr: string[]) => {
    /** 设置静态验证器 */
    if (this._tools.isArray(validsArr) && validsArr.length > 0) {
      const valids: Array<AsyncValidatorFn> = [];
      validsArr.map((valid: string) => {
        switch (valid) {
          case 'required':
            valids.push(this._validator.required);
            break;
          case 'mobile':
            valids.push(this._validator.mobile);
            break;
          default:
            break;
        }
      });
      formControl.setValidators(valids);
    }
  }

  /** 设置默认数据结构 */
  public setEditGroupDefaultData = (editGroupData: Array<GroupDataType>) => {
    if (Array.isArray(editGroupData)) {
      editGroupData.map((v: GroupDataType, idx) => {
        v.fieldArray = this.setDefaultEditListData(v.fieldArray);
        v.index = idx;
        v.groupId = `master-${idx}`;
      });
    }
  }

  /** 添加原始数据属性 */
  public setMetaData = (editGroupData: Array<GroupDataType>): Array<GroupDataType> => {
    editGroupData.map((v: GroupDataType) => {
      v.fieldArray.map((field: EditDataType) => {
        const key: string = field.key;
        const placeholder: string = field.placeholder;
        const selector: string = field.selector;
        const value: any = field.value;
        const readonly: boolean = field.readonly;
        const valids: Array<string> = field.valids;
        const disable: number | boolean = field.disable;
        const isHidden: boolean = field.isHidden;
        const valueArray: any[] = field.valueArray;
        field.metaData = { key, placeholder, selector, value, readonly, valids, disable, isHidden };
        if (valueArray) {
          field.metaData.valueArray = valueArray;
        }
      });
    });
    return editGroupData;
  }

  /** 设置分组属性 */
  public setGroupsAttr = (editGroupData: Array<GroupDataType>, debug: boolean = false): Array<GroupDataType> => {
    editGroupData.map((v: GroupDataType) => {
      let valid: boolean = true;
      let canEdit: boolean = false;
      v.fieldArray.map((field: EditDataType) => {
        const formControl: FormControl = field.formControl;
        if (formControl && formControl.invalid) {
          valid = false;
          if (debug) {
            const msg: string = `分组:${v.name} 字段:${field.placeholder}(${field.key}) value:${field.formControl.value} valids:${field.valids} valid:${field.formControl.valid}`;
            this._tools.print(msg, 'r');
          }
        }
        if (field.readonly === false && field.isHidden === false) {
          canEdit = true;
        }
      });
      /** 设置分组验证属性 */
      v.valid = valid;
      /** 分组是否存在必填字段 */
      v.hasRequiredFields = this.hasRequiredFields(v.fieldArray);
      /** 是否分组所有字段可以更改 */
      v.isGroupFieldsCanEdit = canEdit;
    });

    return editGroupData;
  }

  /** 验证表单数据:处理必填字段,并且无法更改.导致表单无法提交字段. */
  public setRequiredFields = (editGroupData: Array<GroupDataType>): Promise<any> => {
    return new Promise((resolve) => {
      editGroupData.map((v: GroupDataType) => {
        v.fieldArray.map((field: EditDataType) => {
          const key: string = field.key;
          const selector: string = field.selector;
          const value: any = field.value;
          const placeholder: string = field.placeholder;
          const formControlData: EditDataType = this.getMasterFieldData(key, editGroupData);
          // const formControl: FormControl = form.get(key) as FormControl;
          const formControl: FormControl = formControlData.formControl;

          const readonly: boolean = field.readonly;
          const valids: Array<string> = field.valids;
          const isHidden: boolean = selector === 'hidden' || formControlData.isHidden;

          /** 是否为空 */
          const isEmpty: boolean = value === '';
          /** 是否只读 */
          const isReadonly: boolean = readonly;
          /** 是否必填 */
          const isRequired: boolean = !!~valids.indexOf('required');
          /** 为空 只读 必填 */
          // if (isEmpty && isReadonly && isRequired) {
          //   formControlData.valids = [];
          //   formControl.clearValidators();
          //   formControl.setErrors(null);
          //   this._tools.print(`注意:字段[${placeholder}](${key}):为空 && 只读 && 必填,导致表单无法提交.强行去除必填.`, `r`);
          // }
          /** 必填 为空 隐藏 */
          if (isRequired && isEmpty && isHidden) {
            formControlData.valids = [];
            formControl.clearValidators();
            formControl.setErrors(null);
            this._tools.print(`注意:字段[${placeholder}](${key}):必填 && 为空 && 隐藏,导致表单无法提交.强行去除必填.`, `r`);
          }

          this._tools.doNothing(isReadonly);
        });
      });
      // form = this.formatEditForm(editGroupData);
      setTimeout(() => {
        resolve(true);
      });
    });
  }

  /** 子表新增
   * @param childData 子表数据 
   * @param childFormArray 子表表单的FormArray
   * @param childAddData 新增的子表数据
   */
  public addChild = async (
    mainForm: FormGroup,
    childData: EditChildTabType,
    childFormArray: FormArray,
    childAddData?: SheetlinkChildData,
  ): Promise<any> => {
    return new Promise((resolve) => {
      /** 元数据 */
      const metaData = childData.metaData;
      /** 子表 formArray 新增 */
      const formGroup: FormGroup = this._fb.group({});
      /** 子表 数据 新增 */
      const addChildData: ChildGroupDataType = {
        groups: [],
        primaryKey: '',
      };
      metaData.groups.forEach((group) => {
        const addGroup: GroupDataType = {
          name: group.name || '',
          expanded: !!group.expanded,
          hidden: !!group.hidden,
          valid: !!group.valid,
          index: group.index || -1,
          groupId: group.groupId || '',
          hasRequiredFields: !!group.hasRequiredFields,
          isGroupFieldsCanEdit: !!group.isGroupFieldsCanEdit,
          fieldArray: [],
        };
        group.fieldArray.forEach(async (field, fieldIndex) => {
          const newField: EditDataType = this._creatFieldData(field);
          if (newField.key === 'caozuo') {
            newField.formControl.setValue('new');
          }
          /** 子表修改数据 */
          if (childAddData) {
            for (let fieldName in childAddData) {
              if (newField.key === fieldName) {
                newField.displayValue = childAddData[fieldName].displayValue;
                newField.formControl.setValue(childAddData[fieldName].value);
              }
            }
          }
          formGroup.addControl(field.key, newField.formControl);
          addGroup.fieldArray.push(newField);
        });

        addChildData.groups.push(addGroup);
      });
      addChildData.primaryKey = metaData.primaryKey;

      /** 子表 表单 新增 */
      childFormArray.push(formGroup);
      childFormArray.markAsDirty();
      childData.listData.push(addChildData);
      addChildData.groups.forEach((group) => {
        group.fieldArray.forEach(async (field) => {
          if (field.selector === 'sheetlink') {
            const selectData: Array<SelectedDataType> = [{ key: field.key, value: field.formControl.value }];
            await this.setFormValue(selectData, formGroup, field, addChildData.groups, mainForm, 'child-add');
          }
        });
      });

      resolve({ addData: addChildData, addForm: formGroup });
    });
  }

  /**
   * 新增 field 字段数据
   * @param field 
   */
  private _creatFieldData = (field: EditDataType): EditDataType => {
    const formControl: FormControl = this.fieldCreatFormControl(field);
    const newField: EditDataType = {
      key: field.key,
      placeholder: field.placeholder,
      selector: field.selector,
      serial: field.serial,
      disable: field.disable,
      readonly: field.readonly,
      displayValue: field.displayValue,
      displayFormat: field.displayFormat,
      minDate: field.minDate,
      maxDate: field.maxDate,
      isHidden: field.isHidden,

      valueArray: Array.isArray(field.valueArray) ? this._tools.clone(field.valueArray) : [],
      valids: Array.isArray(field.valids) ? [...field.valids] : [],
      asyncValids: Array.isArray(field.asyncValids) ? [...field.asyncValids] : [],
      fileTypeNames: Array.isArray(field.fileTypeNames) ? [...field.fileTypeNames] : [],
      params: field.params ? this._tools.clone(field.params) : {},

      formControl: formControl,
      value: formControl.value,
      metaData: null,
    };
    return newField;
  }

  /**
   * @param childTableName 子表表名
   * @param chilerenData 子表数据
   * @param chilerenForm 子表表单
   * @param childAddData 新增的子表数据
   */
  public addChild1 = async (
    mainForm: FormGroup,
    childTableName: string,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
    childAddData?: SheetlinkChildData,
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      const childFormArray: FormArray = this.getChildFormByTableName(childTableName, chilerenForm);
      const childData: EditChildTabType = this.getChildDataByTableName(childTableName, chilerenData);
      await this.addChild(mainForm, childData, childFormArray, childAddData);
      resolve(true);
    });
  }

  /** 页面滚动到底部 */
  public scrollToBottom = async (): Promise<any> => {
    if (this.content) {
      await this.content.scrollToBottom(0);
      return Promise.resolve(true);
    }
  }

  /** 子表删除
   * @param childData :子表数据 
   * @param childFormArray ：子表表单的FormArray
   * @param delIndex ：删除索引
   */
  public delChild = (childData: EditChildTabType, childFormArray: FormArray, delIndex: number): Promise<any> => {
    return new Promise(async (resolve) => {
      const delFormGroup: FormGroup = childFormArray.at(delIndex) as FormGroup;
      childData.listData.splice(delIndex, 1);
      childFormArray.removeAt(delIndex);
      childFormArray.markAsDirty();
      const delData: DeleteChildrenDataType = { tableName: '', delData: {} };
      if (delFormGroup.get('caozuo').value !== 'new') {
        delFormGroup.get('caozuo').setValue(`delete`);
        delData.tableName = childData.moduleName;
        delData.delData = delFormGroup.value;
        resolve(delData);
      }
    });
  }

  /** 子表删除
   * @param childTableName :子表表名
   * @param delIndex ：删除索引
   * @param chilerenData 子表数据
   * @param chilerenForm 子表表单
   */
  public delChild1 = (
    childTableName: string,
    delIndex: number,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      let result = null;
      const childFormArray: FormArray = this.getChildFormByTableName(childTableName, chilerenForm);
      const childData: EditChildTabType = this.getChildDataByTableName(childTableName, chilerenData);
      result = await this.delChild(childData, childFormArray, delIndex);
      resolve(result);
    });
  }

  /**
   * 清除子表数据
   * @param childTableName 子表表名
   * @param chilerenData 子表数据
   * @param chilerenForm 子表表单
   */
  public clearChildrenData = (
    childTableName: string,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ): Promise<any> => {
    return new Promise((resolve) => {
      let childFormArray: FormArray = this.getChildFormByTableName(childTableName, chilerenForm);
      const childData: EditChildTabType = this.getChildDataByTableName(childTableName, chilerenData);
      const delChildData: DeleteChildrenDataType[] = [];
      /** 记录删除的子表数据 */
      childFormArray.controls.forEach((delFormGroup: FormGroup, delIndex: number) => {
        if (delFormGroup.get('caozuo').value !== 'new') {
          const delData: DeleteChildrenDataType = { tableName: '', delData: {} };
          delFormGroup.get('caozuo').setValue(`delete`);
          delData.tableName = childData.moduleName;
          delData.delData = delFormGroup.value;
          delChildData.push(delData);
        }
      });
      /** 清除子表数据 */
      childData.listData = [];
      /** 清除子表 form */
      while (childFormArray.length !== 0) {
        childFormArray.removeAt(0);
      }
      resolve(delChildData);
    });
  }

  /**
   * 通过子表名称获取子表数据 
   * @param childTableName 子表名称
   * @param chilerenData 所有子表数据 
   * @return 找到的子表数据
   */
  public getChildDataByTableName = (childTableName: string, chilerenData: Array<EditChildTabType>): EditChildTabType | null => {
    let result: EditChildTabType | null = null;
    const filterChilerenData: Array<EditChildTabType> = chilerenData.filter(v => v.moduleName === childTableName);
    if (filterChilerenData.length === 1) {
      result = filterChilerenData[0];
    }
    return result;
  }

  /**
   * 通过子表名称获取子表表单数据 
   * @param childTableName 子表名称
   * @param chilerenForm 所有子表表单数据 
   */
  public getChildFormByTableName = (childTableName: string, chilerenForm: FormArray): FormArray | null => {
    let result: FormArray = this._fb.array([]);
    if (Array.isArray(chilerenForm.controls)) {
      for (let childFormGroup of chilerenForm.controls) {
        if (childFormGroup.get(childTableName)) {
          result = childFormGroup.get(childTableName) as FormArray;
          break;
        }
      }
    }
    return result;
  }

  /**
   * sheetlink 子表增加
   * @param sheetlinkData 
   * @param chilerenData 
   * @param chilerenForm 
   */
  public sheetlinkChildAdd = async (
    mainForm: FormGroup,
    sheetlinkData: SheetlinkFetchData,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ): Promise<any> => {
    return new Promise(async (resolve) => {
      /** 是否存在子表新增 */
      const isChildChange: boolean = !!sheetlinkData.relation;
      if (isChildChange) {
        for (let childTableName in sheetlinkData.relation) {
          const relationItem = sheetlinkData.relation[childTableName];
          /** 动作 */
          let childChangeAction: number = relationItem.NoPrompt;
          /** 子表原有数据 */
          const childData = this.getChildDataByTableName(childTableName, chilerenData);
          /** 新增子表数据 */
          let childAddData = relationItem.data;
          /** 删除的子表数据 */
          let delChildData: DeleteChildrenDataType[] = [];
          /** 提示对话框，是否清空子表数据 */
          if (childChangeAction === NoPromptEnum.confirm && childData.listData.length > 0) {
            const confirm: boolean = await this._msg.confirmAsync('该子表已有内容，是否清空子表?');
            if (confirm) {
              delChildData = await this.clearChildrenData(childTableName, chilerenData, chilerenForm);
            }
          }
          /** 不弹出，直接清空，再增加新内容 */
          if (childChangeAction === NoPromptEnum.clearAdd) {
            delChildData = await this.clearChildrenData(childTableName, chilerenData, chilerenForm);
          }
          /** 不弹出，直接追加新内容 */
          if (childChangeAction === NoPromptEnum.concat) {
            delChildData = [];
          }
          childAddData.forEach(async (child) => {
            await this.addChild1(mainForm, childTableName, chilerenData, chilerenForm, child);
          });
          resolve({ delChildData });
        }
      }
    });
  }

  /**
   * 处理 post 子表数据
   */
  public editPostChildrenData = (
    chilerenForm: FormArray,
    deletedChildrenData: Array<DeleteChildrenDataType>,
  ): Array<PostChildrenDataType> => {
    const result: Array<PostChildrenDataType> = []
    /** 标记更新的 FormGroup */
    if (Array.isArray(chilerenForm.controls)) {
      chilerenForm.controls.forEach((childFormGroup: FormGroup) => {
        for (let childTableName in childFormGroup.controls) {
          /** 单表提交数据 */
          const childPostData: PostChildrenDataType = {};
          childPostData[childTableName] = [];
          const childTableFormArray: FormArray = childFormGroup.get(childTableName) as FormArray;
          if (Array.isArray(childTableFormArray.controls)) {
            childTableFormArray.controls.forEach((childFormGroup: FormGroup) => {
              const isDirty: boolean = childFormGroup.dirty;
              const caozuo: FormControl = childFormGroup.get('caozuo') as FormControl;
              const caozuoValue: string = caozuo ? caozuo.value : '';
              /** 标记更改的 FormGroup updata */
              if (isDirty === true && caozuoValue === '') {
                caozuo.setValue('updata');
              }
              if (caozuo.value === 'updata') {
                childPostData[childTableName].push(childFormGroup.value);
              }
              /** 标记新增的 FormGroup new */
              if (caozuo.value === 'new') {
                childPostData[childTableName].push(childFormGroup.value);
              }

            });
          }
          result.push(childPostData);
        }
      });
    }
    /** 标记删除的 FormGroup */
    deletedChildrenData.forEach((deletedItem) => {
      result.forEach((tableValue) => {
        for (let tableName in tableValue) {
          if (tableName === deletedItem.tableName) {
            tableValue[tableName].push(deletedItem.delData);
          }
        }
      });
    });
    return result;
  }

  /**
   * 提交后重置提交数据
   * @param chilerenForm 
   * @param deletedChildrenData 
   */
  public resetPostChildrenData = (
    chilerenForm: FormArray,
    deletedChildrenData: Array<DeleteChildrenDataType>,
  ) => {
    /** 清除提交过的子表数据 */
    if (Array.isArray(chilerenForm.controls)) {
      chilerenForm.controls.forEach((childFormGroup: FormGroup) => {
        for (let childTableName in childFormGroup.controls) {
          /** 单表提交数据 */
          const childTableFormArray: FormArray = childFormGroup.get(childTableName) as FormArray;
          if (Array.isArray(childTableFormArray.controls)) {
            childTableFormArray.controls.forEach((childFormGroup: FormGroup) => {
              const caozuo: FormControl = childFormGroup.get('caozuo') as FormControl;
              /** 标记更改的 FormGroup updata or new or delete */
              if (caozuo.value === 'updata' || caozuo.value === 'new' || caozuo.value === 'delete') {
                caozuo.setValue('');
              }
            });
          }
        }
      });
    }
    chilerenForm.markAsPristine();
    /** 清除删除的子表数据 */
    deletedChildrenData = [];
  }

  /**
   * 克隆元数据
   * @param metaData 
   */
  public cloneMetaData = (metaData: ChildGroupDataType): ChildGroupDataType => {
    const result: ChildGroupDataType = {
      groups: [],
      primaryKey: '',
    };
    metaData.groups.forEach((group) => {
      const newGroup: GroupDataType = { ...group };
      newGroup.fieldArray = [...newGroup.fieldArray];
      newGroup.fieldArray.forEach((field) => {
        field.formControl = this.fieldCreatFormControl(field);
        field.value = field.formControl.value;
      });
      result.groups.push(newGroup);
    });
    return result
  }

  /** 获取主表字段数据 */
  public getMasterFieldData = (field: string, editGroupData: Array<GroupDataType>): EditDataType | null => {
    let result: EditDataType = null;
    editGroupData.forEach((groupData: GroupDataType) => {
      groupData.fieldArray.forEach((formControlData: EditDataType) => {
        if (formControlData.key === field) {
          result = formControlData;
        }
      });
    });
    if (result === null) {
      this._tools.print(`无法找到字段: ${field}`, 'r');
    }
    return result;
  }

  /** 设置主表字段数据 */
  public setMasterFieldData = (fieldData: SelectedDataType, editGroupData: Array<GroupDataType>) => {
    const getFieldData = this.getMasterFieldData(fieldData.key, editGroupData);
    if (getFieldData) {
      getFieldData.formControl.setValue(fieldData.value);
      getFieldData.value = fieldData.value;
      getFieldData.displayValue = fieldData.displayValue;
      this._tools.print(`更改字段:[${getFieldData.placeholder}](${getFieldData.key}) , value:${fieldData.value} , displayValue:${fieldData.displayValue}`, 'g');
    }
  }

  /** 设置主表字段数据 */
  public setMasterFieldsData = (fieldsData: SelectedDataType[], editGroupData: Array<GroupDataType>) => {
    for (let i = 0; i < fieldsData.length; i++) {
      this.setMasterFieldData(fieldsData[i], editGroupData);
    }
  }

  /** 展示表单错误信息 */
  public printFormError = (form: FormGroup, editGroupData: Array<GroupDataType>): void => {
    this._tools.print(`表单验证失败`, `r`);
    console.log(form);
    /** 整个form */
    if (form.errors) {
      const formErrorType: string = form.errors.errorType;
      switch (formErrorType) {
        case 'error':
          this._msg.toast(`计算公式:字段错误`);
          break;
        default:
          break;
      }
      return;
    }
    /** 每个控制器 */
    for (let formControlName in form.controls) {
      const formControl: FormControl = form.get(formControlName) as FormControl;
      const placeholder: string = this._getPlaceholderWithFormControlName(formControlName, editGroupData);
      const formControlError = formControl.errors;
      if (formControl.invalid) {
        this._tools.print(`${placeholder} (${formControlName}) 验证失败, 原因: ${formControlError.errorType}`, `r`);
      }
      if (formControlError) {
        let errMsg: string = '';
        const errorType: string = formControlError.errorType;
        switch (errorType) {
          case 'required':
            errMsg = `${placeholder} 必填`;
            break;
          case 'mobile':
            errMsg = `${placeholder} 手机号码填写错误`;
            break;
          case 'asyncOnly':
            errMsg = `${placeholder} 内容不唯一`;
            break;
          default:
            break;
        }
        this._msg.toast(errMsg);
        break;
      }
    }
  }

  /**
   * 验证主表表单
   * @param masterForm  主表表单
   * @param editGroupData 主表数据
   */
  public testMasterForm = (masterForm: FormGroup, editGroupData: Array<GroupDataType>): boolean => {
    if (masterForm.invalid) {
      this.printFormError(masterForm, editGroupData);
    }
    return masterForm.valid;
  }

  /**
   * 验证子表表单
   * @param chilerenForm 
   * @param chilerenData 
   */
  public testChildrenForm = (chilerenForm: FormArray, chilerenData: Array<EditChildTabType>): boolean => {
    if (chilerenForm.invalid) {
      chilerenData.forEach((childData) => {
        childData.listData.forEach((group) => {
          group.groups.forEach((v) => {
            v.fieldArray.forEach((field) => {
              if (field.formControl.invalid) {
                const formControlError = field.formControl.errors;
                const placeholder: string = field.placeholder;
                const tableName: string = childData.name;
                let errMsg: string = '';
                switch (formControlError.errorType) {
                  case 'required':
                    errMsg = `子表: ${tableName}，字段: ${placeholder}， 必填`;
                    break;
                  case 'mobile':
                    errMsg = `子表: ${tableName}，字段: ${placeholder} 手机号码填写错误`;
                    break;
                  case 'asyncOnly':
                    errMsg = `子表: ${tableName}，字段: ${placeholder} 内容不唯一`;
                    break;
                  default:
                    break;
                }
                this._msg.toast(errMsg);
                return false;
              }
            });
          });
        });
      });
    }
    return chilerenForm.valid;
  }

  /**
   * 验证所有
   * @param masterForm 
   * @param editGroupData 
   * @param chilerenForm 
   * @param chilerenData 
   */
  public testForm = (
    masterForm: FormGroup,
    editGroupData: Array<GroupDataType>,
    chilerenForm: FormArray,
    chilerenData: Array<EditChildTabType>,
  ): boolean => {
    const masterValid: boolean = this.testMasterForm(masterForm, editGroupData);
    const childrenValid: boolean = this.testChildrenForm(chilerenForm, chilerenData);
    return masterValid && childrenValid;
  }

  /** 设置步骤数据 */
  public setStepsData = (
    editGroupData: Array<GroupDataType>,
    chilerenData: Array<EditChildTabType>,
  ): Array<StepsData> => {
    const result: Array<StepsData> = [];
    editGroupData.forEach((masterGroup, groupIndex) => {
      /** 如果分组可编辑 */
      if (masterGroup.isGroupFieldsCanEdit === true) {
        result.push({ title: masterGroup.name, id: `master-${groupIndex}` });
      }
    });
    chilerenData.forEach((child, childIndex) => {
      if (!child.hidden) {
        result.push({ title: child.name, id: `child-${childIndex}` });
      }
    });
    return result;
  }

  /** 详情页审批流 到编辑页 审批确定并提交 
   * @param editGroupData 主表数据
   * @param showItem 审批页传入 显示字段
   * @param form 主表表单
  */
  public detailApprovalConfirm = (
    editGroupData: Array<GroupDataType>,
    showItem: Array<EditFieldsType>,
    form: FormGroup,
  ): boolean => {
    let result: boolean = true;
    let groupData: Array<EditDataType> = [];
    editGroupData.forEach(Group => {
      Group.fieldArray.forEach(v => {
        groupData.push(v);
      });
    });
    showItem.forEach((v) => {
      if (result && form.value[v.key] === "") {
        groupData.forEach(s => {
          if (v === s.value && s.selector !== "toggle") {
            this._msg.toast(`${s.placeholder}，必填`);
            result = false;
          }
        })
      }
    });
    if (!result) {
      return result;
    }
    return result;
  }

  /** 通过FormControlName 找出 Placeholde */
  private _getPlaceholderWithFormControlName = (formControlName: string, editGroupData: Array<GroupDataType>): string => {
    let placeholde: string = '';
    editGroupData.map((v: GroupDataType) => {
      v.fieldArray.map((field: EditDataType) => {
        if (field.key === formControlName) {
          placeholde = field.placeholder;
          return true;
        }
      });
    });
    return placeholde;
  }

  /**
   * @description 审批流提交
   */
  public approvalSubmit = (params: ApprovalSubmitParams): Promise<ResponseDataType> => {
    const approvalParams: AjaxServiceLoadDataType = {
      title: "审批流提交",
      method: "get",
      // url: "assets/data/test.data.json",
      uri: "Approve_submit.php",
      isLoading: true,
      params: params,
    };
    return new Promise((resolve) => {
      this._ajax.loadData(approvalParams).subscribe((res: ResponseDataType) => {
        resolve(res);
      });
    });
  }

  /** 设置子表tabs */
  public setHeaderTabs = (chilerenData: Array<EditChildTabType>): EditorTabsLabel[] => {
    const result: EditorTabsLabel[] = [{ label: '基本信息', id: `master` }];
    chilerenData.forEach((child, idx) => {
      if (child.hidden === undefined || child.hidden === false) {
        result.push({ label: child.name, id: `child-${idx}` });
      }
    });
    return result;
  }

  /** 获取 sheetlink 数据 */
  public getSheetLinkData = (
    getData: SheetlinkGetData,
    postData: SheetlinkPostData,
  ): Promise<any> => {
    const detailParams: AjaxServiceLoadDataType = {
      title: 'sheetlink',
      method: 'post',
      uri: 'workflow.php',
      params: getData,
      data: postData,
    };
    return new Promise((resolve) => {
      this._ajax.loadData(detailParams).subscribe(res => {
        if (res.status === 1 && (res.payload.Main || res.payload.relation)) {
          resolve(res.payload);
        } else {
          resolve(null)
        }
      });
    });
  }

  /**
   * 页面初始化的 sheetlink
   * @param addDefaultTrigger 
   * @param key 
   * @param value 
   * @param editGroupData 
   * @param form 
   * @param chilerenData 
   * @param chilerenForm 
   */
  public setSheetLinkByInitData = async (
    addDefaultTrigger: AddDefaultTrigger,
    editGroupData: Array<GroupDataType>,
    editForm: FormGroup,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ) => {
    if (addDefaultTrigger && Array.isArray(addDefaultTrigger.main)) {
      addDefaultTrigger.main.forEach(async (v) => {
        const key: string = v.column;
        const item = this.getMasterFieldData(key, editGroupData);
        const value: string = item.formControl.value;
        await this.setMasterRelevantion(key, value, editGroupData, editForm, chilerenData, chilerenForm, 'child', true);
      });
    }
  }

  /**
   * 获取 sheetlink 的 提交参数
   * @param value 
   * @param Type 
   * @param DoWorkflow 
   * @param mainForm 
   * @param chilerenForm 
   * @param action 
   */
  public getSheetlinParamsData = (
    value: any,
    Type: string,
    DoWorkflow: string,
    mainForm: FormGroup,
    chilerenForm: FormArray,
    action: 'main' | 'child' = 'main'
  ): { getData: any, postData: any } => {
    const getData: any = { Type, DoWorkflow };

    /** 主表数据 */
    let main: any = {};
    /** 子表数据 */
    let sub: any = {};
    if (action === 'main') {
      main = mainForm.value;
      sub = {};
    } else if (action === 'child') {
      main = mainForm.value;
      sub = chilerenForm.value;
    }
    const currentData: { main: any, sub: any } = { main, sub, };
    const choseData: any = value;

    const postData: any = { currentData, choseData };
    const result = { getData, postData };
    return result;
  }

  /**
   * 设置主表关联数据
   * @param key 
   * @param value 
   */
  public setMasterRelevantion = async (
    key: string,
    value: string,
    editGroupData: Array<GroupDataType>,
    editForm: FormGroup,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
    action: 'main' | 'child' = 'main',
    forceRun: boolean = false, // 强制运行
  ) => {
    const item = this.getMasterFieldData(key, editGroupData);
    /** 如果原始值 === 改变值 ，不触发 */
    if (item.formControl.value === value && forceRun === false) {
      this._tools.print(`sheetlink, 始值 === 改变值，不触发`, 'y');
      return;
    }

    const Type: string = item.params.moduleName;
    const DoWorkflow: string = item.params.workFlowId;

    const sheetlinkParams = this.getSheetlinParamsData(
      value, Type, DoWorkflow, editForm, chilerenForm, action,
    );

    let selectData: Array<SelectedDataType> = [];

    /** sheetlink 返回数据 */
    const sheetlinkData: SheetlinkFetchData = {};
    let payload = await this.getSheetLinkData(sheetlinkParams.getData, sheetlinkParams.postData);
    if (!payload) {
      return;
    }
    selectData = payload.data || [];
    if (payload.Main) {
      sheetlinkData.Main = payload.Main;
      selectData = [];
      for (let key in sheetlinkData.Main) {
        const item: SelectedDataType = { key, value: sheetlinkData.Main[key].value, displayValue: sheetlinkData.Main[key].displayValue };
        selectData.push(item);
      }
    }
    if (payload.relation) {
      sheetlinkData.relation = payload.relation;
    }
    this.setFormValue(selectData, editForm, item, editGroupData, editForm);
    for (const v of selectData) {
      this.resetDisplayValue(v.key, v.displayValue, editGroupData);
    }
    /** 向子表插入数据 */
    if (sheetlinkData && sheetlinkData.relation) {
      this.sheetlinkChildAdd(editForm, sheetlinkData, chilerenData, chilerenForm);
    }
  }

  /** 展开所有主表数据 */
  public setEditGroupAllData = (editGroupData: Array<GroupDataType>): Array<EditDataType> => {
    /** 主表数据集合 */
    let allData: Array<EditDataType> = [];
    editGroupData.map((groupData: GroupDataType) => {
      allData = [...allData, ...groupData.fieldArray];
    });
    return allData;
  }

  /** 数组向表单赋值 */
  public setArrayDataToForm = (arr: Array<SelectedDataType>, formGroup: FormGroup): void => {
    let unableFindIndex: number = 0;
    if (this._tools.isArray(arr) && arr.length > 0) {
      arr.forEach((v) => {
        if (!this._tools.isNull(formGroup.get(v.key))) {
          formGroup.get(v.key).setValue(v.value);
        } else {
          unableFindIndex++;
          console.error(`${unableFindIndex} : ${v.key}无法识别`);
        }
      });
    }
  }

  /** 设置displayValue属性 */
  public resetDisplayValue = (key: string, displayValue, editGroupData: Array<GroupDataType>): Array<GroupDataType> => {
    editGroupData.forEach((group: GroupDataType) => {
      group.fieldArray.forEach((item: EditDataType) => {
        if (item.key === key) {
          item.displayValue = displayValue;
        }
      });
    });
    return editGroupData;
  }

  /**
   * 设置其他表单内容
   * @param selectData 需要设置的数据
   * @param form 需要设置的 form
   * @param fieldData 当前字段
   * @param editGroupData 主表数据
   * @param mainForm 组表表单
   * @param action 主表 or 子表
   */
  public setFormValue = async (
    selectData: Array<SelectedDataType>,
    editForm: FormGroup,
    fieldData: EditDataType,
    editGroupData: Array<GroupDataType>,
    mainForm: FormGroup,
    action: 'main' | 'child' | 'child-add' = 'main',
  ) => {
    /** 数组向表单赋值 */
    this.setMasterFieldsData(selectData, editGroupData);
    for await (const v of selectData) {
      /** 获取主表字段数据 */
      const itemFieldData = this.getMasterFieldData(v.key, editGroupData);

      if (itemFieldData) {
        /** 是否是 sheetlink 选择器 */
        const isSheetLinkSelector: boolean = itemFieldData.selector === 'sheetlink'||itemFieldData.selector === 'multilevel';
        /** 不是当前选择器 */
        const isNotCurrSelector: boolean = itemFieldData.key !== fieldData.key;
        /** sheetlink 的参数是否OK */
        const sheetlinkParams: SheetlinkParamsType = itemFieldData.params;
        const isParamsOK: boolean = sheetlinkParams && sheetlinkParams.workFlowId && sheetlinkParams.moduleName && sheetlinkParams.nocascadesheetlink !== true;
        /** selectData 的 value 不为空 */
        const isNotEmptySelectData: boolean = this._tools.isEmpty(v.value);

        /** 触发再次sheetlink条件 */
        const isNeedSheetLink: boolean = isSheetLinkSelector && isNotCurrSelector && isParamsOK && isNotEmptySelectData;

        if (isNeedSheetLink) {
          const Type: string = itemFieldData.params.moduleName;
          const DoWorkflow: string = itemFieldData.params.workFlowId;
          /** 主表数据 */
          let main: any = editForm.value;
          /** 子表数据 */
          let sub: any = {};
          if (action === 'main') {
            main = editForm.value;
            sub = {};
          } else if (action === 'child') {
            main = mainForm.value;
            sub = editForm.value;
          }
          const currentData: { main: any, sub: any } = { main, sub, };
          const choseData: string = v.value;
          const getData: SheetlinkGetData = { Type, DoWorkflow, };
          const postData: SheetlinkPostData = { currentData, choseData };
          let selectData: Array<SelectedDataType> = [];
          /** sheetlink 返回数据 */
          const sheetlinkData: SheetlinkFetchData = await this.getSheetLinkData(getData, postData);
          if (sheetlinkData && sheetlinkData.Main) {
            selectData = [];
            for (let key in sheetlinkData.Main) {
              const item: SelectedDataType = { key, value: sheetlinkData.Main[key].value, displayValue: sheetlinkData.Main[key].displayValue};
              selectData.push(item);
            }
            this.setMasterFieldsData(selectData, editGroupData);
          }
          if (selectData.length > 0) {
            await this.setFormValue(selectData, editForm, itemFieldData, editGroupData, mainForm, action);
          }
        }

        /** 子表新增时 sheetlink 触发 */
        if (isSheetLinkSelector && isParamsOK && isNotEmptySelectData && action === 'child-add') {
          const Type: string = itemFieldData.params.moduleName;
          const DoWorkflow: string = itemFieldData.params.workFlowId;
          /** 主表数据 */
          let main: any = editForm.value;
          /** 子表数据 */
          let sub: any = {};
          main = mainForm.value;
          sub = editForm.value;
          const currentData: { main: any, sub: any } = { main, sub, };
          const choseData: string = v.value;
          const getData: SheetlinkGetData = { Type, DoWorkflow, };
          const postData: SheetlinkPostData = { currentData, choseData };
          let selectData: Array<SelectedDataType> = [];
          /** sheetlink 返回数据 */
          const sheetlinkData: SheetlinkFetchData = await this.getSheetLinkData(getData, postData);
          if (sheetlinkData && sheetlinkData.Main) {
            selectData = [];
            for (let key in sheetlinkData.Main) {
              const item: SelectedDataType = { key, value: sheetlinkData.Main[key].value, displayValue: sheetlinkData.Main[key].displayValue };
              selectData.push(item);
            }
            this.setMasterFieldsData(selectData, editGroupData);
          }
          if (selectData.length > 0 && isNotCurrSelector) {
            await this.setFormValue(selectData, editForm, itemFieldData, editGroupData, mainForm, action);
          }
        }
      }
    }
  }


  /**
     * 获取子表
     * @param childTableName 子表名称
     * @param chilerenData 所有子表数据
     */
  public getChildTable = (
    childTableName: string,
    chilerenData: Array<EditChildTabType>,
  ): EditChildTabType | null => {
    let result: EditChildTabType | null = null;
    const childIndex = chilerenData.findIndex(v => v.moduleName === childTableName);
    if (~childIndex) {
      result = chilerenData[childIndex];
    }
    return result;
  }

  /**
     * 获取子表字段源数据
     * @param tableName 子表名称
     * @param fieldKey 子表字段
     * @param chilerenData 所有子表数据
     */
  public getChildrenMetaData = (
    tableName: string,
    fieldKey: string,
    chilerenData: Array<EditChildTabType>,
  ): EditDataType | null => {
    let result: EditDataType | null = null;
    const childrenTable = this.getChildTable(tableName, chilerenData);
    if (childrenTable) {
      childrenTable.metaData.groups.forEach((v) => {
        const field = v.fieldArray.find(field => field.key === fieldKey);
        if (field) {
          result = field;
          return result;
        }
      });
    } else {
      this._tools.print(`动态表单:发现错误, 无法找到子表 ${tableName}`, 'r');
    }
    return result;
  }

  /**
   * 通过 key 获取多条子表的字段数据
   * @param key 
   * @param childTableName 子表名称
   * @returns 字段数据
   */
  public getFieldsDataByTableName = (
    key: string,
    childTableName: string,
    chilerenData: Array<EditChildTabType>,
  ): EditDataType[] => {
    let result: EditDataType[] = [];
    const childTable = this.getChildTable(childTableName, chilerenData);
    if (childTable && Array.isArray(childTable.listData)) {
      childTable.listData.forEach(childGroupData => {
        if (Array.isArray(childGroupData.groups)) {
          childGroupData.groups.forEach(fields => {
            if (Array.isArray(fields.fieldArray)) {
              fields.fieldArray.forEach((field) => {
                if (field.key === key) {
                  result.push(field);
                }
              });
            }
          });
        }
      });
    }
    return result;
  }

}
