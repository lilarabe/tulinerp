import { Injectable } from '@angular/core';
import { ToolsProvider } from '../../serves/tools.service';
import { DetailMoreDataType, DetailItemDataTpye, DetailChildrenDataType } from '../../interface/detail.interface';
import { EditFormulaItemData } from '../../providers/edit/edit-formula';
import { ListItemsType, ListItemType } from '../../interface/list.interface';
import { DetailFormularRunResyltType } from '../../interface/formula.interface';
import { MsgService } from '../../serves/msg.service';
import { ApprovalDataType } from '../../interface/approval.interface';

/** 计算公式 */
@Injectable()
export class DetailFormulaProvider {

    constructor(
        private _tools: ToolsProvider,
        private _msg: MsgService,
    ) {
    }

    /** 设置计算公式 */
    public setEditFormula = (moreData: Array<DetailMoreDataType>, formulaData: Array<EditFormulaItemData>, chilerenData: Array<DetailChildrenDataType>): void => {
        /** 设置moreData */
        this._setMoreData(moreData);
        formulaData.forEach((v: EditFormulaItemData) => {
            /** 审批提交时不触发 */
            switch (v.call_type) {
                case 0:/** 默认触发字段改变运行 */
                    // this._runFormulaFormat(moreData, chilerenData, v.code);
                    break;
                case 1:/** 子表改变 */
                    // this._runFormulaFormat(moreData, chilerenData, v.code);
                    break;
                case 2:/** 列表加载 */
                    this._runFormulaFormat(moreData, chilerenData, v.code);
                    break;
                case 3:/** 加载运行 */
                    this._runFormulaFormat(moreData, chilerenData, v.code);
                    break;
                case 4:/** 提交运行 */
                    // this._runFormulaFormat(moreData, chilerenData, v.code);
                    break;
                case 5:/** 提交审批流运行 */
                    break;
                case 6:
                    /** ( 审批提交) 同意 运行 */
                    break;
                default:
                    break;
            }
        });
    }
    /** 审批流提交计算公式 */
    public setEditApprovalFormula = (
        moreData: Array<DetailMoreDataType>,
        formulaData: Array<EditFormulaItemData>,
        chilerenData: Array<DetailChildrenDataType>,
        approvalData: ApprovalDataType,
    ): boolean => {
        /** 计算公式是否触发 return false */
        let isOk: boolean = true;
        /** 设置moreData */
        this._setMoreData(moreData);
        formulaData.forEach((v: EditFormulaItemData) => {
            /** 只有审批提交时触发 */
            if (v.call_type == 5 || (v.call_type == 6 && v.field === approvalData.node_now)) {
                const result: DetailFormularRunResyltType = this._runFormulaFormat(moreData, chilerenData, v.code);
                if (!result.isCodeReturnFalse) {
                    isOk = false;
                }
            }
        });
        return isOk;
    }

    /** 展开所有主表数据 */
    private _setMoreData = (moreData: Array<DetailMoreDataType>): void => {
        let allMorData: Array<DetailItemDataTpye> = [];
        moreData.forEach(v => { allMorData = [...allMorData, ...v.itemData.filter(v => v.key)]; });
    }

    /** 通过tableName获取子表数据 */
    private _getChildrenTable = (key: string, chilerenData: Array<DetailChildrenDataType>): DetailChildrenDataType => {
        let result: DetailChildrenDataType = { displayStyle: '', isAdd: false, moduleName: '', name: '', listData: [] };
        const childrenTable: Array<DetailChildrenDataType> = chilerenData.filter(v => v.moduleName === key);
        if (childrenTable.length >= 1) {
            result = childrenTable[0];
        } else if (childrenTable.length === 0) {
            this._tools.print(`算公式错误:无法在数据中找到子表: ${key}`, 'r');
        }
        return result;
    }

    /** 通过key获取主表显示数据 */
    private _getMasterItemData = (key: string, moreData: Array<DetailMoreDataType>): DetailItemDataTpye => {
        let result: DetailItemDataTpye = { name: '', value: '', selector: '', key: '' };
        let allData: Array<DetailItemDataTpye> = [];
        /** 将 moreData 有效数据 合并到 allData */
        moreData.forEach(v => { allData = [...allData, ...v.itemData.filter(v => v.key)]; });
        const itemsData: DetailItemDataTpye[] = allData.filter((v) => v.key === key);
        if (itemsData.length >= 1) {
            result = itemsData[0];
        } else if (itemsData.length === 0) {
            this._tools.print(`算公式错误:无法在主表数据中找到key: ${key}`, 'r');
        }
        if (this._tools.isNumberString(result.realvalue)) {
            this._tools.print(`算公式警告:主表字段[${result.name}](${result.key})不是有效数字${result.realvalue}`, 'y');
            result.realvalue = (result.realvalue + '').replace(/\,/g, '');
        }
        return result;
    }

    /** 子表金额累计 */
    private _childrenSum = (tableName: string, fieldName: string, chilerenData: Array<DetailChildrenDataType>): number => {
        let sum: number = 0;
        const childrenTable: DetailChildrenDataType = this._getChildrenTable(tableName, chilerenData);
        childrenTable.listData.map((items: ListItemsType) => {
            items.itemData.map((item: ListItemType) => {
                if (item.key === fieldName) {
                    if (!isNaN(+item.value)) {
                        sum += +item.value;
                    } else {
                        sum += 0;
                        this._tools.print(`计算公式错误:子表金额累计-table: ${tableName}, field: ${fieldName}不是数字。`, 'r');
                    }
                }
            });
        });
        return sum;
    }

    /** 辅助代码替换 */
    private _helpCodeReplace = (strCode: string, moreData: Array<DetailMoreDataType>): void => {
        this._tools.print(`\n\n----------------------------计算公式 start----------------------------------`);
        this._tools.print(`伪代码:`, 'b');
        this._tools.print(`${strCode}`);
        this._tools.print(`辅助代码:`, 'b');
        /** 把没用的去掉 */
        strCode = strCode.replace(/\(\s?(string)|(number)\s?\)/ig, ``);
        /** 主表字段替换 */
        strCode = strCode.replace(/M\.(\w+)/ig, (input, key) => {
            let result: string = input;
            /** 验证主表key是否存在 */
            const item: DetailItemDataTpye = this._getMasterItemData(key, moreData);
            if (item.name) {
                result = `[${item.name}](key:${key},value:${item.realvalue})`;
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
                const item: DetailItemDataTpye = this._getMasterItemData(key, moreData);
                result += `[${item.name}](${key})颜色`
            }
            return result;
        });
        this._tools.print(strCode);
    }

    /** 伪代码替换 */
    private _codeReplace = (strCode: string): string => {
        /** 数据类型字符串替换 (string) */
        const stringReplace = (strFormula: string): string => {
            return strFormula.replace(/\(\s?string\s?\)\(M\.(\w+)\)/ig, ` getItemMoreData('$1').realvalue `);
        }
        /** 数据类型数字替换 (number) */
        const numberReplace = (strFormula: string): string => {
            return strFormula.replace(/\(\s?number\s?\)\(M\.(\w+)\)/ig, ` +getItemMoreData('$1').realvalue `);
        }
        /** 赋值替换 a=b+c => a.value = b.value+c.value */
        const equationReplace1 = (strFormula: string): string => {
            // const reg: RegExp = /M\.(\w+)\s*=\s*([^;\f\n\r]+)/g;
            const reg: RegExp = /M\.(\w+)\s*=(?!=)\s*([^;\f\n\r]+)/g;
            return strFormula.replace(reg, (input, leftKey, rightCode) => {
                return `getItemMoreData('${leftKey}').value = ${rightCode};\ngetItemMoreData('${leftKey}').realvalue = ${rightCode}`;
            });
        }
        /** 替换真实值, 会出现 value 再次赋值 */
        const equationReplace2 = (strFormula: string): string => {
            return strFormula.replace(/getItemMoreData\('(\w+)'\)\.realvalue\s*=\s*([^;=\f\n\r]+)/g, (input, leftKey, rightCode) => {
                return `getItemMoreData('${leftKey}').value = ${rightCode};\ngetItemMoreData('${leftKey}').realvalue = ${rightCode}`;
            });
        }
        /** return false 替换 */
        const returnFalseReplace = (strFormula: string): string => {
            return strFormula.replace(/return\s+false;/ig, `stop(); return false;`);
        }
        /** return 替换 */
        const returnReplace = (strFormula: string): string => {
            return strFormula.replace(/return\s+(true|false);/ig, ``);
        }
        /** 子表金额累计替换 */
        const childrenSumReplace = (strFormula: string): string => {
            const reg: RegExp = /\(number\)\(\+\)\(S.(\w+)\)\{\(number\)\(S.(\w+)\)\}/ig;
            return strFormula.replace(reg, (input, table, field) => {
                return `childrenSum('${table}','${field}')`;
            });
        }
        /** 子表内部运算替换 */
        const childrenHeadReplace = (strFormula: string): string => {
            const reg: RegExp = /::(\w+)::/g;
            return strFormula.replace(reg, (input, table) => {
                // return `for(var i=0,childData=getChildrenTable('${table}')[i],tableName='${table}' ; i<getChildrenTable('${table}').length ; i++,childData=getChildrenTable('${table}')[i])`;
                return `for(var childData of getChildrenTable('${table}').listData)`;
            });
        }
        /** 数据类型字符串替换 (string) */
        const childrenStringReplace = (strFormula: string): string => {
            return strFormula.replace(/@\(\s?string\s?\)\(S\.(\w+)\)/ig, ` getChildItem('$1',childData).value `);
        }
        /** 数据类型字符串替换 (string) */
        const childrenNumberReplace = (strFormula: string): string => {
            return strFormula.replace(/@\(\s?number\s?\)\(S\.(\w+)\)/ig, ` +getChildItem('$1',childData).value `);
        }
        /** 子表赋值替换 a=b+c => a.value = b.value+c.value */
        const childrenEquationReplace = (strFormula: string): string => {
            return strFormula.replace(/\+?getChildItem\('(\w+)',childData\)\s*=\s*([^;\f\n\r]+)/g, (input, leftKey, rightCode) => {
                return `getChildItem('${leftKey}').value = ${rightCode}`;
            });
        }
        /** 最终替换 */
        const lastWishPeplace = (strFormula: string): string => {
            return strFormula.replace(/M\.(\w+)/g, ` getItemMoreData('$1').realvalue `);
        }
        /** 计算公式替换 */
        const formulaCodeReplace = (strFormula: string): string => {
            let replaceStrFormula: string = strFormula;
            replaceStrFormula = stringReplace(replaceStrFormula);
            // this._tools.print(`字符串类型替换结果:\n${replaceStrFormula}`);
            replaceStrFormula = numberReplace(replaceStrFormula);
            // this._tools.print(`----数字串类型替换结果----`);
            // this._tools.print(`数字串类型替换结果:\n${replaceStrFormula}`);
            // this._tools.print(`----数字串类型替换结果----`);
            replaceStrFormula = equationReplace1(replaceStrFormula);
            // this._tools.print(`----赋值替换替换结果----`);
            // this._tools.print(`赋值替换替换结果1:\n${replaceStrFormula}`);
            // this._tools.print(`----赋值替换替换结果----`);
            replaceStrFormula = equationReplace2(replaceStrFormula);
            // this._tools.print(`----赋值替换替换结果----`);
            // this._tools.print(`赋值替换替换结果2:\n${replaceStrFormula}`);
            // this._tools.print(`----赋值替换替换结果----`);

            replaceStrFormula = returnFalseReplace(replaceStrFormula);
            // replaceStrFormula = returnReplace(replaceStrFormula);
            // this._tools.print(`return替换结果:\n${replaceStrFormula}`);
            replaceStrFormula = childrenSumReplace(replaceStrFormula);
            // this._tools.print(`金额累计替换结果:\n${replaceStrFormula}`);
            replaceStrFormula = childrenHeadReplace(replaceStrFormula);
            // this._tools.print(`子表内部运算替换结果:\n${replaceStrFormula}`);
            replaceStrFormula = childrenStringReplace(replaceStrFormula);
            replaceStrFormula = childrenNumberReplace(replaceStrFormula);
            replaceStrFormula = childrenEquationReplace(replaceStrFormula);
            replaceStrFormula = lastWishPeplace(replaceStrFormula);
            // this._tools.print(`最终替换结果:\n${replaceStrFormula}`);
            return replaceStrFormula;
        }
        this._tools.doNothing(returnReplace);
        /** eval字符串 */
        const evalCode: string = formulaCodeReplace(strCode);
        return evalCode;
    }

    /** 运行计算公式 */
    private _runFormulaFormat = (moreData: Array<DetailMoreDataType>, chilerenData: Array<DetailChildrenDataType>, strCode: string): DetailFormularRunResyltType => {
        /** 计算公式是否 return false */
        let isCodeReturnFalse: boolean = true;
        /** 通过key获取moreData数据 */
        const getItemMoreData = (key: string) => {
            return this._getMasterItemData(key, moreData);
        }
        /** stop 函数替换 */
        const stop = () => {
            this._tools.print(`计算公式提示:阻止审批提交`, `g`);
            isCodeReturnFalse = false;
        }
        /** alert */
        const alert = (msg: any) => {
            this._msg.toast(msg);
        }
        /** setColor 函数替换 */
        const setColor = (type: string, fieldName: string, color: string): void => {
            const itemData: DetailItemDataTpye = getItemMoreData(fieldName);
            if (itemData.key) {
                getItemMoreData(fieldName).setStyle = { color };
                this._tools.print(`计算公式提示:[设置]字段颜色-[ ${itemData.name} ](${itemData.key})`, 'g');
            }
        };
        /** clearColor 函数替换 */
        const clearColor = (type: string, fieldName: string): void => {
            const itemData: DetailItemDataTpye = getItemMoreData(fieldName);
            if (itemData.key) {
                getItemMoreData(fieldName).setStyle = {};
                this._tools.print(`计算公式提示:[清除]字段颜色-[ ${itemData.name} ](${itemData.key})`, 'g');
            }
        };
        /** 子表金额累计 */
        const childrenSum = (tableName: string, fieldName: string): number => {
            return this._childrenSum(tableName, fieldName, chilerenData);
        }
        /** 通过tableName获取子表数据 */
        const getChildrenTable = (tableName: string): DetailChildrenDataType => {
            const result: DetailChildrenDataType = this._getChildrenTable(tableName, chilerenData);
            return result;
        }
        /** 获取子表字段数据 */
        const getChildItem = (key: string, childData: ListItemsType): ListItemType => {
            let result: ListItemType = { name: '', value: '', key: '', selector: '', colspan: 0 };
            childData.itemData.map((item: ListItemType) => {
                if (item.key === key) {
                    result = item;
                }
            });
            if (result.key === ``) {
                this._tools.print(`算公式错误:无法获取子表数据Key: ${key}`, 'r');
            }
            return result;
        }

        /**
         * 设置任意变量，控制ts不会警告 never used.
         */
        this._tools.doNothing(setColor, clearColor, stop, childrenSum, getChildrenTable, getChildItem,
            alert, confirm);

        /** 打印辅助信息 */
        this._helpCodeReplace(strCode, moreData);
        /** eval字符串 */
        const evalCode: string = this._codeReplace(strCode);
        this._tools.print(`可执行代码:`, 'b');
        this._tools.print(evalCode);
        /** 未知方法 */
        const undifinedFunction: Array<string> = ['showRelevant'];
        /** 是否存在为定义方法 */
        let hasUndefinedFunction: boolean = false;
        undifinedFunction.forEach((fnName: string) => {
            if (evalCode.indexOf(fnName) !== -1) {
                this._tools.print(`计算公式存在未定义方法: ${fnName} ,终止运行`, 'y');
                hasUndefinedFunction = true;
            }
        });
        /** 如果存在未定义方法,计算公式终止运行. */
        if (hasUndefinedFunction) {
            return { isCodeReturnFalse };
        }
        try {
            // eval(evalCode);
            eval(`(function(){${evalCode}})()`);
            this._tools.print(`计算公式执行成功`, 'g');
        }
        catch {
            this._tools.print(`计算公式执行失败`, 'r');
        }
        console.log(`--------------------------------计算公式 end------------------------------\n\n`);

        return { isCodeReturnFalse };
    }

}