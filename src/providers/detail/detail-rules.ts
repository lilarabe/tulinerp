import { Injectable } from '@angular/core';
import { ToolsProvider } from '../../serves/tools.service';
import { EditRulesType, EditRuleFilesType } from '../../interface/rules.interface';
import { DetailItemDataTpye, DetailMoreDataType, DetailChildrenDataType } from '../../interface/detail.interface';
import { ListItemsType, ListItemType } from '../../interface/list.interface';


/** 动态表单规则 */
@Injectable()
export class DetailRulesProvider {
    constructor(
        private _tools: ToolsProvider,
    ) {
    }

    /** 设置动态表单 */
    public setDetailRules = (
        moreData: Array<DetailMoreDataType>,
        rules: EditRulesType[],
        chilerenData: Array<DetailChildrenDataType>,
    ): void => {
        /** baseData 与 moreData的集合 */
        let allData: Array<DetailItemDataTpye> = [];
        moreData.forEach(v => { allData = [...allData, ...v.itemData.filter(v => v.key)]; });
        rules.forEach((rule: EditRulesType) => {
            this._printInfo(rule, allData, chilerenData);
            this._setFieldData(rule, allData, chilerenData);
        });
    }

    /** 设置规则字段 */
    private _setFieldData = (rule: EditRulesType, allData: Array<DetailItemDataTpye>, chilerenData: Array<DetailChildrenDataType>) => {
        this._tools.print(`运行解析:`);
        const key: string = rule.field;
        const itemData: DetailItemDataTpye = this._getItemData(key, allData);
        const value = itemData.realvalue;
        const name: string = itemData.name;
        const isRun: boolean = this._runRules(rule.condition, rule.con_val, value, rule.custom_cond, allData);
        const symbol: string = this._getOperator(rule.condition, rule.custom_cond);
        this._tools.print(`实际值:${name}(${key}) - value:${value}`, 'b');
        this._tools.print(`验证规则:${name}(${key})${symbol} ${rule.con_val},验证-${isRun ? '成功' : '失败'}`, 'b');
        if (isRun && Array.isArray(rule.dynamic_fields)) {
            const dynamicFields: EditRuleFilesType[] = rule.dynamic_fields;
            dynamicFields.forEach((dynamicField: EditRuleFilesType) => {
                const { tableName, fieldName, tableType } = this._tableInfo(dynamicField);
                const isHidden: boolean = dynamicField.hidden === "true";
                // const isRequired: boolean = dynamicField.required === "true";
                // const isReadonly: boolean = dynamicField.readonly === "true";
                if (tableType === 'm') {
                    const fieldData: DetailItemDataTpye = this._getItemData(fieldName, allData);
                    if (isHidden) {
                        fieldData.selector = 'hidden';
                        this._tools.print(`主表(${tableName})-字段[${fieldData.name}](${fieldData.key}):隐藏`, 'g');
                    }
                    if (Array.isArray(rule.Son_Table) && rule.Son_Table.length > 0) {
                        rule.Son_Table.forEach((v) => {
                            const childTableData = this._getChildTable(v.Table_Name, chilerenData);
                            if (childTableData) {
                                if (v.Display === "'hidden'") {
                                    childTableData.isHide = true;
                                    this._tools.print(`子表(${childTableData.moduleName})[${childTableData.name}]:隐藏`, 'g');
                                } else if (v.Display === "'show'") {
                                    childTableData.isHide = false;
                                    this._tools.print(`子表(${childTableData.moduleName})[${childTableData.name}]:显示`, 'g');
                                }
                            }
                        });
                    }
                }
                if (tableType === 's') {
                    const childrenItems: ListItemType[] = this._getChildrenItems(tableName, fieldName, chilerenData);
                    childrenItems.map((item: ListItemType) => {
                        if (isHidden) {
                            item.selector = 'hidden';
                            this._tools.print(`子表[${item.name}](${item.key}):${isHidden ? '隐藏' : ''}`, 'g');
                        }
                    });
                }

            });
        }
        this._tools.print('--------------------------动态表单 end------------------------------\n\n');
    }

    /** 运行验证规则 */
    private _runRules(
        condition: number,
        con_val: any,
        value: any,
        custom_cond: string,
        allData: Array<DetailItemDataTpye>,
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
            const getMasterData = (field: string): any => {
                const result = this._getItemData(field, allData);
                return result.value;
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
                    const result = this._getItemData(field, allData);
                    return `主表(${result.key})[${result.name}]value:${result.value}`;
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

    /** 验证主表字段是否存在 */
    private _testField = (key: string, allData: Array<DetailItemDataTpye>): boolean => {
        const resultData: Array<DetailItemDataTpye> = allData.filter(v => key === v.key);
        if (resultData.length === 0) {
            this._tools.print(`动态表单:发现错误,key: ${key} 无法在主表数据中找到`, 'r');
            return false;
        } else if (resultData.length > 1) {
            this._tools.print(`动态表单:发现错误, ${key} 出现 ${resultData.length}次`, 'r');
            return false;
        } else {
            return true;
        }
    }

    /** 获取主表字段数据 */
    private _getItemData = (key: string, allData: Array<DetailItemDataTpye>): DetailItemDataTpye => {
        if (this._testField(key, allData)) {
            return allData.filter(v => key === v.key)[0];
        } else {
            return { name: '', value: 'a', selector: '', key: '', setStyle: {} };
        }
    }

    /** 获取子表字段数据 */
    private _getChildrenItems = (tableName: string, fieldName: string, chilerenData: Array<DetailChildrenDataType>): Array<ListItemType> => {
        const result: Array<ListItemType> = [];
        const tableData: DetailChildrenDataType = chilerenData.filter(v => v.moduleName === tableName)[0];
        if (tableData) {
            tableData.listData.map((list: ListItemsType) => {
                const item: ListItemType[] = list.itemData.filter(v => v.key === fieldName);
                if (item.length === 0) {
                    this._tools.print(`动态表单:发现错误, 无法在子表[${tableData.name}](${tableName})中, 找到 ${fieldName} 字段`, 'r');
                } else if (item.length === 1) {
                    result.push(item[0]);
                }
            });
        } else {
            this._tools.print(`动态表单:发现错误, 无法找到子表 ${tableName}`, 'r');
        }
        return result;
    }

    /**
     * 获取子表数据
     * @param tableName 
     * @param chilerenData 
     */
    private _getChildTable = (tableName: string, chilerenData: Array<DetailChildrenDataType>):DetailChildrenDataType | undefined => {
        let result: DetailChildrenDataType | undefined = undefined;
        const childIndex = chilerenData.findIndex(v => v.moduleName === tableName);
        if (~childIndex) {
            result = chilerenData[childIndex];
        }
        return result;
    }

    /** 获取运算符 */
    private _getOperator = (num: number, custom_cond: string): string => {
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

    /** 判定主表子表 */
    private _tableInfo = (dynamicField: EditRuleFilesType): { tableName: string, fieldName: string, tableType: string } => {
        let tableName: string = dynamicField.field[0];
        const reg: RegExp = /\.xml/i;
        let fieldName: string = dynamicField.field[1];
        let tableType: string = reg.test(dynamicField.field[0]) ? 'm' : 's';
        const result = { tableName, fieldName, tableType };
        return result;
    }

    /** 打印信息 */
    private _printInfo = (rule: EditRulesType, allData: Array<DetailItemDataTpye>, chilerenData: Array<DetailChildrenDataType>): void => {
        this._tools.print(`\n\n--------------------------动态表单 start------------------------------`)
        this._tools.print(`数据分析:`);
        const symbol: string = this._getOperator(rule.condition, rule.custom_cond);
        const itemData: DetailItemDataTpye = this._getItemData(rule.field, allData);
        this._tools.print(`if(${itemData.name}(${itemData.key})${symbol}${rule.con_val}){`, 'b');
        if (Array.isArray(rule.dynamic_fields)) {
            rule.dynamic_fields.forEach((dynamic_field: EditRuleFilesType) => {
                const { tableName, fieldName, tableType } = this._tableInfo(dynamic_field);
                const isHidden: boolean = dynamic_field.hidden === "true";
                const isRequired: boolean = dynamic_field.required === "true";
                const isReadonly: boolean = dynamic_field.readonly === "true";
                if (tableType === 'm') {
                    const dynamicfieldData: DetailItemDataTpye = this._getItemData(dynamic_field.field[1], allData);
                    const key: string = dynamicfieldData.key;
                    const name: string = dynamicfieldData.name;
                    this._tools.print(`主表(${tableName})-字段[${name}](${key}):${isHidden ? '隐藏' : ''},${isRequired ? '必填' : ''},${isReadonly ? '只读' : ''}`, 'b');
                }
                if (tableType === 's') {
                    const childrenItems: ListItemType[] = this._getChildrenItems(tableName, fieldName, chilerenData);
                    if (childrenItems.length >= 1) {
                        const item: ListItemType = childrenItems[0];
                        this._tools.print(`子表[${item.name}](${item.key}):${isHidden ? '隐藏' : ''},${isRequired ? '必填' : ''},${isReadonly ? '只读' : ''}`, 'b');
                    }
                }

            });
        }
        this._tools.print(`}`, 'b');
    }
}