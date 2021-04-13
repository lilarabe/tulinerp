import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToolsProvider } from '../../serves/tools.service';
import { GroupDataType, EditDataType, EditChildTabType } from '../../interface/edit.interface';
import { FormValidatorsService } from '../../serves/form-validators.service';
import { EditRulesType, EditRuleFilesType } from '../../interface/rules.interface';
import { EditProvider } from './edit';



/** 动态表单规则 */
@Injectable()
export class EditRulesProvider {
    constructor(
        private _validator: FormValidatorsService,
        private _tools: ToolsProvider,
        private _editProvider: EditProvider,
    ) {
    }

    /** 设置动态表单 */
    public setEditRules = async (
        form: FormGroup,
        rules: EditRulesType[],
        editGroupData: Array<GroupDataType>,
        chilerenData: Array<EditChildTabType>,
        chilerenForm: FormArray,
    ): Promise<any> => {
        // console.log(rules);
        // console.log(editGroupData);
        // console.log(chilerenData);
        /** 为了阻止一个字段多次监控, 生成map key:监控字段名称，value:变化规则 */
        const rulesMap: Map<string, EditRulesType[]> = new Map();
        this._tools.print('\n\n--------------------------动态表单:数据分析 start------------------------------');
        rules.map((v: EditRulesType, idx: number) => {
            this._tools.print(`${idx + 1}:`);
            this._printInfo(v, editGroupData, form, chilerenData);
            /** 强制运行 */
            // this._setFormControl(v, form, editGroupData, chilerenData, chilerenForm);
            const key: string = v.field;
            const value: EditRulesType[] = rules.filter(rule => rule.field === key);
            if (!rulesMap.has(key)) {
                rulesMap.set(key, value);
            }
        });
        this._tools.print('--------------------------动态表单:数据分析 end------------------------------\n\n');
        /** 字段监控 */
        rulesMap.forEach((rules: EditRulesType[], field: string) => {
            if (this._testField(field, form)) {
                const formControl: FormControl = form.get(field) as FormControl;
                const formControlData: EditDataType = this._getFormControlData(field, editGroupData);
                const placeholder: string = formControlData.placeholder;
                const key: string = formControlData.key;
                let dynamicFields: Array<EditRuleFilesType> = [];
                /** 为了重置数据，将字段变化规则合并 */
                rules.map((rule: EditRulesType) => {
                    dynamicFields = [...dynamicFields, ...rule.dynamic_fields];
                });
                /** 执行动态表单 */
                this._donRules(formControl.value, rules, form, editGroupData, chilerenData, chilerenForm);
                formControl.valueChanges.debounceTime(500).subscribe(value => {
                    this._tools.print(`\n\n--------------------------动态表单:字段监控 [${placeholder}](${key}) start------------------------------`);
                    if (formControl.dirty === false && value === '') {
                        this._tools.print(`主表字段[${placeholder}](${key}) - 不是脏值，并且 value 为字符串空， 动态表单停止运行。`, 'y');
                        return;
                    } else {
                        this._tools.print(`主表字段[${placeholder}](${key}) - 发生变化value:${JSON.stringify(value)}`, 'b');
                        /** 重置数据 */
                        this._tools.print(`数据复原:`);
                        this._resetMetaData(dynamicFields, form, editGroupData, chilerenData, chilerenForm);
                        /** 执行动态表单 */
                        this._donRules(value, rules, form, editGroupData, chilerenData, chilerenForm);
                    }
                    this._tools.print('--------------------------动态表单:字段监控 end------------------------------\n\n');
                });
            }
        });
    }

    /**
     * 执行动态表单
     * @param value 
     * @param rules 
     * @param editForm 
     * @param editGroupData 
     * @param chilerenData 
     * @param chilerenForm 
     */
    private _donRules = (
        value: any,
        rules: EditRulesType[],
        editForm: FormGroup,
        editGroupData: Array<GroupDataType>,
        chilerenData: Array<EditChildTabType>,
        chilerenForm: FormArray,
    ) => {
        rules.map((rule: EditRulesType) => {
            const isRun: boolean = this._runRules(rule.condition, rule.con_val, value, rule.custom_cond, editGroupData);
            if (isRun) {
                this._tools.print(`使用动态表单:`);
                this._printInfo(rule, editGroupData, editForm, chilerenData);
                this._tools.print(`运行结果:`);
                this._setFormControl(rule, editForm, editGroupData, chilerenData, chilerenForm);
            }
        });
    }

    /** 验证字段是否存在 */
    private _testField(key: string, form: FormGroup): boolean {
        const fieldFormControl: FormControl = form.get(key) as FormControl;
        if (fieldFormControl === null) {
            this._tools.print(`动态表单:无法触发, 主表字段: ${key} 无法找到`, 'r');
            return false;
        } else {
            return true;
        }
    }

    /** 运行验证规则 用于计算
     * @param condition 规则
     * @param con_val 规则值
     * @param value 实际值
     * @param custom_cond 自定义规则
     * @param editGroupData 主表数据
     */
    private _runRules(
        condition: number,
        con_val: any,
        value: any,
        custom_cond: string,
        editGroupData: Array<GroupDataType>,
    ): boolean {
        switch (condition) {
            case 0:
                return con_val == value;
            case 1:
                return con_val > value;
            case 2:
                return con_val < value;
            case 3:
                return con_val >= value;
            case 4:
                return con_val <= value;
            case 5:
                return con_val != value;
        }
        if (this._tools.isString(custom_cond) && custom_cond !== '') {

            const replace_custom_cond: string = custom_cond.replace(/([m]\.)(\w+)/ig, ($input, $tab, $field) => {
                return ` getMasterData('${$field}') `;
            });
            /** 获取主表字段数据 */
            const getMasterData: any = (field: string): any => {
                const result: any = this._getFormControlData(field, editGroupData).formControl.value;
                return result;
            }

            /**
             * 设置任意变量，控制ts不会警告 never used.
             */
            this._tools.doNothing(getMasterData);

            try {
                this._tools.print(`动态表单动态规则：`, 'b');
                let print_custom_cond = replace_custom_cond;
                this._tools.print(`${custom_cond}`, 'b');
                print_custom_cond = print_custom_cond.replace(/getMasterData\('(\w+)'\)/ig, (input, field) => {
                    const result = this._getFormControlData(field, editGroupData);
                    return `主表(${result.key})[${result.placeholder}]value:${result.formControl.value}`;
                });
                this._tools.print(print_custom_cond, 'b');
                this._tools.print(`动态表单判断：`, 'b');
                this._tools.print(`${replace_custom_cond}`, 'b');
                const result = eval(replace_custom_cond);
                this._tools.print(`结果:${result}`, 'b');
                return result;
            }
            catch (e) {
                this._tools.print(`动态表单运行失败`, 'r');
                return false;
            }
        }
        return false;
    }

    /** 判定主表子表 */
    private _tableInfo = (dynamicField: EditRuleFilesType): { tableName: string, fieldName: string, tableType: string } => {
        let tableName: string = dynamicField.field[0];
        const reg: RegExp = /\.xml/i;
        let fieldName: string = dynamicField.field[1];
        let tableType: string = reg.test(dynamicField.field[0]) ? 'm' : 's';
        const result = { tableName, fieldName, tableType };
        return result;
    }

    /** 获取运算符 用于打印 */
    private _getOperator = (num: number, custom_cond: string,): string => {
        let symbol: string = '';
        switch (num) {
            case 0:
                symbol = `==`;
                break;
            case 1:
                symbol = `>`;
                break;
            case 2:
                symbol = `<`;
                break;
            case 3:
                symbol = `>=`;
                break;
            case 4:
                symbol = `<=`;
                break;
            case 5:
                symbol = `!=`;
                break;
            default:
                break;
        }
        if (custom_cond) {
            symbol = custom_cond;
        }
        return symbol;
    }

    /** 设置规则字段 */
    private _setFormControl(
        rule: EditRulesType,
        form: FormGroup,
        editGroupData: Array<GroupDataType>,
        chilerenData: Array<EditChildTabType>,
        chilerenForm: FormArray,
    ): void {
        const dynamicFields: Array<EditRuleFilesType> = rule.dynamic_fields;
        dynamicFields.forEach((dynamicField: EditRuleFilesType) => {
            const { tableName, fieldName, tableType } = this._tableInfo(dynamicField);
            /** 主表字段 */
            if (tableType === 'm') {
                if (this._testField(fieldName, form)) {
                    const formControlData: EditDataType = this._getFormControlData(fieldName, editGroupData);
                    const key: string = formControlData.key;
                    const placeholder: string = formControlData.placeholder;
                    // const formControl: FormControl = form.get(fieldName) as FormControl;
                    const formControl: FormControl = formControlData.formControl;
                    if (dynamicField.hidden === "true") {
                        formControlData.isHidden = true;
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):隐藏`, 'g');
                        /** hideclear 隐藏时清除 */
                        if (rule.hideclear === "true") {
                            formControl.setValue('');
                            this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):数据清空`, 'g');
                        }
                    } else {
                        formControlData.isHidden = false;
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):显示`, 'g');
                        /**
                         * wtf 
                         * 这里的逻辑是: 
                         * 如果选择器是 hidden 根改选择器为 input
                         * 这么做不好,逻辑非常混乱.
                         */
                        if (formControlData.selector === 'hidden') {
                            formControlData.selector = 'input';
                        }

                    }
                    if (dynamicField.required === "true") {
                        formControlData.valids = ['required'];
                        formControl.setValidators(this._validator.required);
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):必填`, 'g');
                    }
                    if (dynamicField.required === "false") {
                        formControlData.valids = [];
                        formControl.clearValidators();
                        formControl.setErrors(null);
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):取消必填`, 'g');
                    }
                    if (dynamicField.readonly === "true") {
                        formControlData.readonly = true;
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):只读`, 'g');
                    }
                    if (dynamicField.readonly === "false") {
                        formControlData.readonly = false;
                        this._tools.print(`主表(${tableName})字段[${placeholder}](${key}):取消只读`, 'g');
                    }
                    /** 子表操作 */
                    if (Array.isArray(rule.Son_Table) && rule.Son_Table.length > 0) {
                        rule.Son_Table.forEach((v) => {
                            const childTableData = this._editProvider.getChildTable(v.Table_Name, chilerenData);
                            if (childTableData) {
                                if (v.Display === "'hidden'") {
                                    childTableData.hidden = true;
                                    this._tools.print(`子表(${childTableData.moduleName})[${childTableData.name}]:隐藏`, 'g');
                                } else if (v.Display === "'show'") {
                                    childTableData.hidden = false;
                                    this._tools.print(`子表(${childTableData.moduleName})[${childTableData.name}]:显示`, 'g');
                                }
                            }
                        });
                    }
                }
            }
            /** 子表字段 */
            else if (tableType === 's') {
                const childTable = this._editProvider.getChildTable(tableName, chilerenData);
                /** 如果找不到子表 */
                if (childTable === null) return;
                /** 源字段数据 */
                const fieldMetaData = this._editProvider.getChildrenMetaData(tableName, fieldName, chilerenData);
                /** 字段数据 */
                const fieldsData = this._editProvider.getFieldsDataByTableName(fieldName, tableName, chilerenData);
                /** 如果找不到子表字段 */
                if (fieldMetaData === null) return;
                /** 隐藏 */
                if (dynamicField.hidden === "true") {
                    fieldMetaData.isHidden = true;
                    fieldsData.forEach((fieldData)=>{
                        fieldData.isHidden = true;
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):隐藏`, 'g');
                }
                if (dynamicField.hidden === "false") {
                    fieldMetaData.isHidden = false;
                    fieldsData.forEach((fieldData)=>{
                        fieldData.isHidden = false;
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):显示`, 'g');
                }
                /** 必填 */
                if (dynamicField.required === "true") {
                    fieldMetaData.valids = ['required'];
                    fieldMetaData.formControl.setValidators(this._validator.required);
                    fieldsData.forEach((fieldData)=>{
                        fieldData.valids = ['required'];
                        fieldData.formControl.setValidators(this._validator.required);
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):取消必填`, 'g');
                }
                if (dynamicField.required === "false") {
                    fieldMetaData.valids = [];
                    fieldMetaData.formControl.clearValidators();
                    fieldMetaData.formControl.setErrors(null);
                    fieldsData.forEach((fieldData)=>{
                        fieldData.valids = [];
                        fieldData.formControl.clearValidators();
                        fieldData.formControl.setErrors(null);
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):必填`, 'g');
                }
                /** 只读 */
                if (dynamicField.readonly === "true") {
                    fieldMetaData.readonly = true;
                    fieldsData.forEach((fieldData)=>{
                        fieldData.readonly = true;
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):只读`, 'g');
                }
                if (dynamicField.readonly === "false") {
                    fieldMetaData.readonly = false;
                    fieldsData.forEach((fieldData)=>{
                        fieldData.readonly = false;
                    });
                    this._tools.print(`子表:[${childTable.name}](${tableName}) 字段:[${fieldMetaData.placeholder}](${fieldMetaData.key}):取消只读`, 'g');
                }
            }
        });
    }

    /** 获取子表字段数据 */
    private _getFormControlData(field: string, editGroupData: Array<GroupDataType>): EditDataType {
        let result: EditDataType = null;
        editGroupData.forEach((groupData: GroupDataType) => {
            groupData.fieldArray.forEach((formControlData: EditDataType) => {
                if (formControlData.key === field) {
                    result = formControlData;
                }
            });
        });
        if (result === null) {
            this._tools.print(`动态表单错误! 主表无法找到字段: ${field}`, 'r');
        }
        return result;
    }

    /** 复原原始数据 */
    private _resetMetaData = (
        dynamicFields: Array<EditRuleFilesType>,
        form: FormGroup,
        editGroupData: Array<GroupDataType>,
        chilerenData: Array<EditChildTabType>,
        chilerenForm: FormArray,
    ) => {
        dynamicFields.forEach((dynamicField: EditRuleFilesType) => {
            const { tableName, fieldName, tableType } = this._tableInfo(dynamicField);
            if (tableType === 'm') {
                if (this._testField(fieldName, form)) {
                    const formControlData: EditDataType = this._getFormControlData(fieldName, editGroupData);
                    const key: string = formControlData.key;
                    const placeholder: string = formControlData.placeholder;
                    const formControl: FormControl = formControlData.formControl;
                    /** 隐藏复原 */
                    formControlData.isHidden = formControlData.metaData.isHidden;
                    /** 选择器复原 */
                    formControlData.selector = formControlData.metaData.selector;
                    /** 数据复原 */
                    // formControlData.formControl.setValue(formControlData.metaData.value);
                    /** 验证复原 */
                    formControl.clearValidators();
                    // formControl.setErrors(null);
                    formControlData.valids = formControlData.metaData.valids;
                    this._editProvider.setValidatorFn(formControl, formControlData.valids);
                    formControl.updateValueAndValidity();
                    /** 只读复原 */
                    formControlData.readonly = formControlData.metaData.readonly;
                    this._tools.print(`主表${tableName}字段[${placeholder}](${key}):复原`, 'g');
                    /** 子表复原 */
                    chilerenData.forEach((childTableData) => {
                        childTableData.hidden = childTableData.oldData.hidden;
                        this._tools.print(`子表${childTableData.moduleName}[${childTableData.name}]显示:复原 - ${childTableData.hidden ? '隐藏' : '显示'}`, 'g');
                    });
                }
            } else if (tableType === 's') {
                const childTable = this._editProvider.getChildTable(tableName, chilerenData);
                /** 如果找不到子表 */
                if (childTable === null) return;
                /** 源字段数据 */
                const fieldMetaData = this._editProvider.getChildrenMetaData(tableName, fieldName, chilerenData);
                /** 字段数据 */
                const fieldsData = this._editProvider.getFieldsDataByTableName(fieldName, tableName, chilerenData);

                /** 如果找不到子表字段 */
                if (fieldMetaData === null) return;
                /** 隐藏复原 */
                fieldMetaData.isHidden = fieldMetaData.metaData.isHidden;
                fieldsData.forEach((fieldData)=>{
                    fieldData.isHidden = fieldMetaData.metaData.isHidden;
                });
                /** 只读复原 */
                fieldMetaData.readonly = fieldMetaData.metaData.readonly;
                fieldsData.forEach((fieldData)=>{
                    fieldData.readonly = fieldMetaData.metaData.readonly;
                });
                /** 验证复原 */
                fieldMetaData.formControl.clearValidators();
                fieldMetaData.formControl.setErrors(null);
                fieldMetaData.valids = fieldMetaData.metaData.valids;
                fieldsData.forEach((fieldData)=>{
                    fieldData.formControl.clearValidators();
                    fieldData.formControl.setErrors(null);
                    fieldData.valids = fieldMetaData.metaData.valids;
                });
                this._tools.print(`子表[${childTable.name}](${childTable.moduleName}) 字段[${fieldMetaData.placeholder}](${fieldMetaData.key}):复原`, 'g');

            }
        });
    }

    /** 打印信息 */
    private _printInfo = (editRules: EditRulesType, editGroupData: Array<GroupDataType>, form: FormGroup, chilerenData: Array<EditChildTabType>): void => {
        const symbol: string = this._getOperator(editRules.condition, editRules.custom_cond);
        const formControlData: EditDataType = this._getFormControlData(editRules.field, editGroupData);
        if (formControlData === null) {
            return;
        }
        this._tools.print(`if([${formControlData.placeholder}](${editRules.field})${symbol}${editRules.con_val}){`, 'b');
        if (Array.isArray(editRules.dynamic_fields)) {
            editRules.dynamic_fields.map((dynamicField: EditRuleFilesType) => {
                const { tableName, fieldName, tableType } = this._tableInfo(dynamicField);
                const isHidden: boolean = dynamicField.hidden === "true";
                const isRequired: boolean = dynamicField.required === "true";
                const isReadonly: boolean = dynamicField.readonly === "true";
                if (tableType === 'm') {
                    if (this._testField(fieldName, form)) {
                        const formControlData: EditDataType = this._getFormControlData(fieldName, editGroupData);
                        const placeholder: string = formControlData.placeholder;
                        this._tools.print(`\t主表(${tableName})字段[${placeholder}](${fieldName}):${isHidden ? '隐藏' : ''},${isRequired ? '必填' : ''},${isReadonly ? '只读' : ''}`, 'b');
                    }
                }
                if (tableType === 's') {
                    const fieldData: EditDataType | null = this._editProvider.getChildrenMetaData(tableName, fieldName, chilerenData);
                    if (fieldData) {
                        this._tools.print(`\t子表 ${tableName} 字段[${fieldData.placeholder}](${fieldData.key}) : ${isHidden ? '隐藏' : ''},${isRequired ? '必填' : ''},${isReadonly ? '只读' : ''}`, 'b');
                    } else {
                        this._tools.print(`无法在子表 ${tableName} 中找到 ${fieldName} 字段`, 'r');
                    }
                }
            });
        }
        this._tools.print(`}`, 'b');
    }

}