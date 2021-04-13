import { Injectable } from '@angular/core';
import { ToolsProvider } from '../../serves/tools.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Events } from 'ionic-angular';
import { EditChildTabType, GroupDataType, EditDataType, ChildGroupDataType } from '../../interface/edit.interface';
import { DetailFormularRunResyltType } from '../../interface/formula.interface';
import { MsgService } from '../../serves/msg.service';
import { EditProvider } from './edit';
import { ApprovalDataType } from '../../interface/approval.interface';

/** 计算公式 */
@Injectable()
export class EditFormulaProvider {

  constructor(
    private _tools: ToolsProvider,
    private _events: Events,
    private _msg: MsgService,
    private _editProvider: EditProvider,
  ) {
  }

  /** 设置计算公式 */
  public setEditFormula = (
    form: FormGroup,
    editFormulaData: Array<EditFormulaItemData>,
    editGroupData: Array<GroupDataType>,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ) => {
    /** 主表数据集合 */
    const allData: Array<EditDataType> = this._editProvider.setEditGroupAllData(editGroupData);
    editFormulaData.forEach((v: EditFormulaItemData) => {
      if (v.call_type == 5) {
        /** 审批提交时触发 */
      } else if (v.call_type == 4) {
        /** 保存触发 */
      } else if (v.call_type == 6) {
        /** 审批页提交触发 */
      } else if (v.call_type == 1) {
        /** 子表改变触发 */
        this._runFormulaFormat(form, v, allData, chilerenData, editGroupData, chilerenForm);
      } else {
        this._runFormulaFormat(form, v, allData, chilerenData, editGroupData, chilerenForm);
      }
    });
  }

  /** 审批流提交计算公式 */
  public setEditApprovalFormula = (
    form: FormGroup,
    editFormulaData: Array<EditFormulaItemData>,
    editGroupData: Array<GroupDataType>,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
    approvalData: ApprovalDataType,
  ): boolean => {
    /** 计算公式是否触发 return false */
    let isOk: boolean = true;
    /** 主表数据集合 */
    const allData: Array<EditDataType> = this._editProvider.setEditGroupAllData(editGroupData);

    editFormulaData.forEach((v: EditFormulaItemData) => {
      /** 只有审批提交时触发 */
      if (v.call_type == 5 || (v.call_type == 6 && v.field === approvalData.node_now)) {
        const result: DetailFormularRunResyltType = this._runFormulaFormat(form, v, allData, chilerenData, editGroupData, chilerenForm);
        if (!result.isCodeReturnFalse) {
          isOk = false;
        }
      }
    });
    return isOk;
  }

    /** 审批流审批同意提交计算公式 */
    public setEditApprovalFormulaOK = (
      form: FormGroup,
      editFormulaData: Array<EditFormulaItemData>,
      editGroupData: Array<GroupDataType>,
      chilerenData: Array<EditChildTabType>,
      chilerenForm: FormArray,
      approvalData: ApprovalDataType,
    ): boolean => {
      /** 计算公式是否触发 return false */
      let isOk: boolean = true;
      /** 主表数据集合 */
      const allData: Array<EditDataType> = this._editProvider.setEditGroupAllData(editGroupData);
  
      editFormulaData.forEach((v: EditFormulaItemData) => {
        /** 只有审批提交时触发 */
        if (v.call_type == 6 && v.field === approvalData.node_now) {
          const result: DetailFormularRunResyltType = this._runFormulaFormat(form, v, allData, chilerenData, editGroupData, chilerenForm);
          if (!result.isCodeReturnFalse) {
            isOk = false;
          }
        }
      });
      return isOk;
    }

  /** 保存提交计算公式是否验证通过 call_type == 4 */
  public setEditSaveFormula = (
    form: FormGroup,
    editFormulaData: Array<EditFormulaItemData>,
    editGroupData: Array<GroupDataType>,
    chilerenData: Array<EditChildTabType>,
    chilerenForm: FormArray,
  ): boolean => {
    /** 计算公式是否触发 return false */
    let isOk: boolean = true;
    /** 主表数据集合 */
    const allData: Array<EditDataType> = this._editProvider.setEditGroupAllData(editGroupData);
    editFormulaData.forEach((v: EditFormulaItemData) => {
      /** 只保存时触发 */
      if (v.call_type == 4) {
        const result: DetailFormularRunResyltType = this._runFormulaFormat(form, v, allData, chilerenData, editGroupData, chilerenForm);
        if (result === undefined) return false;
        if (!result.isCodeReturnFalse) {
          isOk = false;
        }
      }
    });
    return isOk;
  }

  /** 运行计算公式 */
  private _runFormulaFormat = (
    form: FormGroup,
    formula: EditFormulaItemData,
    allData: Array<EditDataType>,
    chilerenData: Array<EditChildTabType>,
    editGroupData: Array<GroupDataType>,
    chilerenForm: FormArray,
  ): DetailFormularRunResyltType => {
    const startTime: number = +new Date();
    /** 计算公式运行返回数据 */
    let result: DetailFormularRunResyltType = {};
    /** 计算公式字符串整理 */
    const strFormula = formula.code;
    /** 打印辅助信息 */
    this._tools.print(`\n\n----------------------------计算公式 分析 start----------------------------------`);
    this._helpCodeReplace(form, strFormula, allData);
    /** 验证主表字段是否存在 */
    if (!this._testFields(form, strFormula)) {
      return;
    }

    /** eval字符串 */
    let evalCode: string = this._formulaCodeReplace(form, strFormula);
    this._tools.print(`执行代码:`, 'b');
    this._tools.print(`${evalCode}`);
    this._tools.print(`----------------------------计算公式 分析 end----------------------------------\n\n`);

    /** 运行条件 */
    if (formula.call_type === 0) {/** 主表触发字段改变运行 */

      /** 触发字段 */
      const fieldFormControl: FormControl = form.get(formula.field) as FormControl;
      if (fieldFormControl === null) {
        this._tools.print(`计算公式:无法触发, ${formula.field} 无法找到`, 'r');
        return void 0;
      }
      const fieldData = this._getMasterItemData(formula.field, allData);
      this._tools.print(`触发字段:`, 'b');
      this._tools.print(`[${fieldData.placeholder}](${fieldData.key})`);

      fieldFormControl.valueChanges.debounceTime(500).subscribe(() => {
        this._tools.print(`\n\n----------------------------计算公式 字段监控 [${fieldData.placeholder}](${fieldData.key}) start----------------------------------`);
        result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
        this._helpCodeReplace(form, strFormula, allData);
        this._tools.print(`执行代码:`, 'b');
        this._tools.print(`${evalCode}`);
        this._tools.print(`----------------------------计算公式 字段监控 end----------------------------------\n\n`);
      });
    } else if (formula.call_type === 1) { /** 子表改变 */
      /** 监控所有子表字段变化 */
      chilerenForm.valueChanges.debounceTime(500).subscribe(() => {
        result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
      });
      // result = this._formulaCodeEval(form, evalCode, chilerenData);
    } else if (formula.call_type === 2) { /** 列表加载 */
      // result = this._formulaCodeEval(form, evalCode, chilerenData);
    } else if (formula.call_type === 3) { /** 加载运行 */
      result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
    } else if (formula.call_type === 4) { /** 提交运行 */
      result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
    } else if (formula.call_type === 5) { /** 提交审批流运行 */
      result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
    } else if (formula.call_type === 6) { /** 审批同意运行 */
      result = this._formulaCodeEval(form, strFormula, evalCode, chilerenData, allData, editGroupData, chilerenForm);
    } else {
      this._tools.print(`计算公式:运行条件错误`, 'r');
    }
    const endTime: number = +new Date();
    this._tools.print(`计算公式耗时:${endTime - startTime}ms`, 'y');
    return result;
  }

  /** 辅助代码替换 */
  private _helpCodeReplace = (form: FormGroup, strCode: string, allData: Array<EditDataType>): void => {
    this._tools.print(`伪代码:`, 'b');
    this._tools.print(`${strCode}`);
    this._tools.print(`辅助代码:`, 'b');
    /** 把没用的去掉 */
    strCode = strCode.replace(/\(\s?(string)|(number)\s?\)/ig, ``);
    /** 主表字段替换 */
    strCode = strCode.replace(/M\.(\w+)/ig, (input, key) => {
      let result: string = input;
      /** 验证主表key是否存在 */
      const item: EditDataType = this._getMasterItemData(key, allData);
      const fieldFormControl: FormControl = form.get(key) as FormControl;
      if (item.key) {
        result = `[${item.placeholder}](key:${item.key},value:${fieldFormControl.value})`;
      }
      return result;
    });
    /** setColor clearColor 替换 */
    strCode = strCode.replace(/(setColor|clearColor)\((.+)\)/ig, (input, $1, $2) => {
      let result: string = '';
      const params: Array<string> = $2.split(',');
      if ($1 === `setColor`) {
        result = `设置`
      }
      if ($1 === `clearColor`) {
        result = `清除`
      }
      if (params[0] === `'M'` || params[0] === `"M"`) {
        result += `主表`
      }
      if (params[1]) {
        const key: string = params[1].replace(/["']/g, '');
        const item: EditDataType = this._getMasterItemData(key, allData);
        result += `[${item.placeholder}](${key})颜色`
      }
      return result;
    });
    this._tools.print(strCode);
  }

  /** 通过key获取主表数据 */
  private _getMasterItemData = (key: string, allData: Array<EditDataType>): EditDataType => {
    let result: EditDataType = { key: '', selector: 'input', placeholder: '' };
    allData.map((item) => {
      if (item.key === key) {
        result = item;
        // const fieldFormControl: FormControl = form.get(key) as FormControl;
        const fieldFormControl: FormControl = result.formControl;
        if (this._tools.isNumberString(fieldFormControl.value)) {
          this._tools.print(`算公式警告:主表字段[${result.placeholder}](${result.key})不是有效数字${result.value}`, 'y');
          const value: number = +(result.value + '').replace(/\,/g, '');
          fieldFormControl.setValue(value);
        }
      }
    });
    if (result.key === '') {
      this._tools.print(`算公式错误:无法在主表数据中找到key: ${key}`, 'r');
    }
    return result;
  }

  /** 验证字段是否有效 */
  private _testFields = (form: FormGroup, strFormula: string): boolean => {
    const arrFields: Array<string> = [];
    strFormula.replace(/M\.(\w+)/g, (input, field) => {
      arrFields.push(field);
      return input;
    });
    for (const field of arrFields) {
      const fieldFormControl: FormControl = form.get(field) as FormControl;
      if (fieldFormControl === null) {
        this._tools.print(`计算公式:无法触发,主表字段 ${field} 无法找到`, 'r');
        return false;
      }
    }
    return true;
  }

  /** 子表金额累计 */
  private _childrenSum = (
    tableName: string,
    fieldName: string,
    chilerenData: Array<EditChildTabType>,
  ): number => {
    let sum: number = 0;
    const childrenTable = this._getChildrenTable(tableName, chilerenData);
    childrenTable.listData.map((items: ChildGroupDataType) => {
      items.groups.forEach((childGroup) => {
        childGroup.fieldArray.forEach((childField) => {
          if (childField.key === fieldName) {
            if (!isNaN(+childField.value)) {
              sum += +childField.formControl.value;
            } else {
              sum += 0;
              this._tools.print(`计算公式错误:子表金额累计-table: ${tableName}, field: ${fieldName}不是数字。`, 'r');
            }
          }
        });
      });
    });
    return sum;
  }

  /** 通过tableName获取子表数据 */
  private _getChildrenTable = (
    tableName: string,
    chilerenData: Array<EditChildTabType>,
  ): EditChildTabType => {
    let resultData: EditChildTabType = { moduleName: '', name: '', listData: [] };
    const childrenTable: Array<EditChildTabType> = chilerenData.filter(v => v.moduleName === tableName);

    if (childrenTable.length === 1) {
      resultData = childrenTable[0];
    } else {
      this._tools.print(`算公式错误:无法在数据中找到子表: ${tableName}`, 'r');
    }
    return resultData;
  }

  /** 计算公式替换 */
  private _formulaCodeReplace = (form: FormGroup, strFormula: string): string => {
    let replaceStrFormula: string = strFormula;
    replaceStrFormula = this._stringReplace(replaceStrFormula);
    // console.log(`字符串类型替换结果:${replaceStrFormula}`);
    replaceStrFormula = this._numberReplace(replaceStrFormula);
    // console.log(`数字串类型替换结果:${replaceStrFormula}`);
    replaceStrFormula = this._equationReplace1(replaceStrFormula);
    replaceStrFormula = this._equationReplace2(replaceStrFormula);
    // console.log(`等式替换结果:${replaceStrFormula}`);
    replaceStrFormula = this._returnReplace(replaceStrFormula);
    // console.log(`return换结果:${replaceStrFormula}`);
    replaceStrFormula = this._childrenSumReplace(replaceStrFormula);
    // console.log(`金额累计换结果:\n${replaceStrFormula}`);
    replaceStrFormula = this._childrenHeadReplace(replaceStrFormula);
    replaceStrFormula = this._childrenStringReplace(replaceStrFormula);
    replaceStrFormula = this._childrenNumberReplace(replaceStrFormula);
    replaceStrFormula = this._childrenEquationReplace(replaceStrFormula);
    // console.log(`子表替换结果:\n${replaceStrFormula}`);
    replaceStrFormula = this._lastWishPeplace(replaceStrFormula);
    // console.log(`最后替换结果:${replaceStrFormula}`);
    return replaceStrFormula;
  }

  /** 运行字符串 */
  private _formulaCodeEval = (
    form: FormGroup,
    strMetaCode: string,
    strEvalCode: string,
    chilerenData: Array<EditChildTabType>,
    allData: Array<EditDataType>,
    editGroupData: Array<GroupDataType>,
    chilerenForm: FormArray,
  ): DetailFormularRunResyltType => {
    const startTime: number = +new Date();
    /** 计算公式是否 return false */
    let isCodeReturnFalse: boolean = true;
    /** 
     * 设置 sheetLink
    */
    const showRelevant = async (key: string, value: string, id?: string) => {
      await this._editProvider.setMasterRelevantion(key, value, editGroupData, form, chilerenData, chilerenForm);
    };
    /** setColor 函数替换 */
    const setColor = (type: string, fieldName: string, color: string): void => {
      this._events.publish(`setColor-${fieldName}`, { color });
    };
    /** clearColor 函数替换 */
    const clearColor = (type: string, fieldName: string): void => {
      this._events.publish(`clearColor-${fieldName}`);
    };
    /** stop 函数替换 */
    const stop = () => {
      this._tools.print(`计算公式提示:阻止审批提交 或者 保存`, `g`);
      isCodeReturnFalse = false;
    }
    /** 金额累计 */
    const childrenSum = (tableName: string, fieldName: string): number => {
      return this._childrenSum(tableName, fieldName, chilerenData);
    }
    /** 通过tableName获取子表数据 */
    const getChildrenTable = (tableName: string): EditChildTabType => {
      const result: EditChildTabType = this._getChildrenTable(tableName, chilerenData);
      return result;
    }
    /** 获取子表字段数据 */
    const getChildItem = (key: string, childData: ChildGroupDataType): EditDataType => {
      let result: EditDataType = { key: '', placeholder: '', selector: 'input', formControl: null };
      childData.groups.forEach((childGroup) => {
        childGroup.fieldArray.forEach((childField) => {
          if (childField.key === key) {
            result = childField;
          }
        });
      });
      if (result.formControl === null) {
        this._tools.print(`算公式错误:无法获取子表数据Key: ${key}`, 'r');
      }
      return result;
    }
    /** alert */
    const alert = (msg: any) => {
      this._msg.toast(msg);
    }
    /** confirm */
    // const confirm = (msg: any) => {
    //   this._msg.confirm(msg);
    // }
    /** 
     * 选项过滤
     * 当某个字段值发生变化时，另外的select选择器选项发生变化
     */
    const SelectAttrFilter = (key: string, strValues: string) => {
      const valus: string[] = strValues.split(',');
      const field = this._getMasterItemData(key, allData);
      /** 可以处理的选择器 */
      const handleMap: Map<string, Function> = new Map([
        ['select', () => {
          field.valueArray.map((v) => {
            v.isHidden = valus.find((vv) => v.name === vv) === undefined;
          });
        }],
        ['tagmultiselect', () => {
          field.valueArray.map((v) => {
            v.isHidden = valus.find((vv) => v.name === vv) === undefined;
          });
        }],
      ]);
      if (handleMap.has(field.selector)) {
        handleMap.get(field.selector)();
      } else {
        this._tools.print(`算公式错误:无法处理选择器为${field.selector}的valueArray`, 'r');
      }
    }
    /**
     * 设置任意变量，控制ts不会警告 never used.
     */
    this._tools.doNothing(showRelevant, setColor, clearColor, stop, childrenSum, getChildrenTable,
      getChildItem, SelectAttrFilter, alert, confirm,
    );
    this._tools.print(`计算公式源代码:`, 'b');
    this._tools.print(strMetaCode);
    this._tools.print(`计算公式可执行代码:`, 'b');
    this._tools.print(strEvalCode);
    try {
      // strEvalCode = `
      // `;
      // this._tools.print(strEvalCode);
      eval(`(function(){${strEvalCode}})()`);
    }
    catch {
      this._tools.print(`计算公式执行失败`, 'r');
    }
    const endTime: number = +new Date();
    this._tools.print(`计算公式执行成功,耗时:${endTime - startTime}ms`, 'g');
    return { isCodeReturnFalse };
  }


  /** 数据类型字符串替换 (string) */
  private _stringReplace = (strFormula: string): string => {
    return strFormula.replace(/\(\s?string\s?\)\(M\.(\w+)\)/ig, ` form.get('$1').value `);
  }
  /** 数据类型数字替换 (number) */
  private _numberReplace = (strFormula: string): string => {
    return strFormula.replace(/\(\s?number\s?\)\(M\.(\w+)\)/ig, ` +form.get('$1').value `);
  }
  /** 赋值替换 a=b+c => a.setValue(b.value+c.value) */
  private _equationReplace1 = (strFormula: string): string => {
    // const reg: RegExp = /form\.get\('(\w+)'\)\.value\s*=\s*([^;=\f\n\r]+)/g;
    const reg: RegExp = /M\.(\w+)\s*=(?!=)\s*([^;\f\n\r]+)/g;
    return strFormula.replace(reg, (input, leftFormControlName, rightCode) => {
      return `form.get('${leftFormControlName}').setValue(${rightCode})`;
    });
  }
  private _equationReplace2 = (strFormula: string): string => {
    const reg: RegExp = /form\.get\('(\w+)'\)\.value\s*=\s*([^;=\f\n\r]+)/g;
    // const reg: RegExp = /M\.(\w+)\s*=\s*([^;\f\n\r]+)/g;
    return strFormula.replace(reg, (input, leftFormControlName, rightCode) => {
      return `form.get('${leftFormControlName}').setValue(${rightCode})`;
    });
  }
  /** return 替换 */
  private _returnReplace = (strFormula: string): string => {
    // console.log(this._formValidatorsService.error);
    const map = new Map<string, string>([
      // ['false', 'form.setValidators(this._formValidatorsService.error)'],
      ['false', 'stop();\treturn false'],
      ['true', 'form.setValidators(null)'],
    ]);
    return strFormula.replace(/return\s+(true|false)/ig, (input, result) => {
      return map.get(result);
    });
  }
  /** 子表金额累计替换 */
  private _childrenSumReplace = (strFormula: string): string => {
    const reg: RegExp = /\(number\)\(\+\)\(S.(\w+)\)\{\(number\)\(S.(\w+)\)\}/ig;
    return strFormula.replace(reg, (input, table, field) => {
      return `childrenSum('${table}','${field}')`;
    });
  }
  /** 子表for头部替换 */
  private _childrenHeadReplace = (strFormula: string): string => {
    const reg: RegExp = /::(\w+)::/g;
    return strFormula.replace(reg, (input, table) => {
      return `for(var childData of getChildrenTable('${table}').listData)`;
    });
  }
  /** 数据类型字符串替换 (string) */
  private _childrenStringReplace = (strFormula: string): string => {
    return strFormula.replace(/@\(\s?string\s?\)\(S\.(\w+)\)/ig, ` getChildItem('$1',childData).formControl.value `);
  }
  /** 数据类型数字替换 (number) */
  private _childrenNumberReplace = (strFormula: string): string => {
    return strFormula.replace(/@\(\s?number\s?\)\(S\.(\w+)\)/ig, ` +getChildItem('$1',childData).formControl.value `);
  }
  /** 子表赋值替换 a=b+c => a.setValue(b.value+c.value) */
  private _childrenEquationReplace = (strFormula: string): string => {
    return strFormula.replace(/\+?getChildItem\('(\w+)',childData\)\.formControl\.value\s*=(?!=)\s*([^;\f\n\r]+)/g, (input, leftKey, rightCode) => {
      // return `getChildItem('${leftKey}').value = ${rightCode}`;
      return `getChildItem('${leftKey}', childData).formControl.setValue(${rightCode},{emitEvent:false})`;
    });
  }

  /** 最后替换 */
  private _lastWishPeplace = (strFormula: string): string => {
    return strFormula.replace(/M\.(\w+)/g, (input, field) => {
      return `form.get('${field}').value`;
    });
  }

}

/** 计算公式数据类型 */
export interface EditFormulaItemData {
  /** 触发字段 or 其他 */
  field: string;
  /** 计算公式 */
  code: string;
  /** 触发时机
   * 0 : 主表
   * 1 : 子表
   * 2 : 列表加载
   * 3 : 详情加载
   * 4 : 详情保存
   * 5 : 审批提交
   * 6 ：( and 审批提交) 同意 运行
   */
  call_type?: number;
}
