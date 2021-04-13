import { Injectable } from '@angular/core';

/** 中文货币转换 */
@Injectable()
export class ChineseMoneyFormatService {
    /** 大写表 */
    private _chineseNumber = new Map<string, number>([
        ['壹', 1], ['贰', 2], ['叁', 3], ['肆', 4], ['伍', 5], ['陆', 6], ['柒', 7], ['捌', 8], ['玖', 9]
    ]);
    /** 金额单位 */
    private _chineseUnit = new Map<string, number>([
        ['亿', 100000000], ['万', 10000], ['仟', 1000], ['佰', 100], ['拾', 10], ['元', 1], ['角', 0.1], ['分', 0.01]
    ]);

    constructor() {
    }

    /** 中文大写数字转换 */
    public chineseToNumber = (chinese: string): number => {
        let result: number = 0;
        /** 匹配单位 */
        const groupReg = /([零|壹|贰|叁|肆|伍|陆|柒|捌|玖|仟|佰|拾]+[亿|万|元|角|分])/g;
        /** 匹配单位数字 */
        const numberReg = /([壹|贰|叁|肆|伍|陆|柒|捌|玖][仟|佰|拾]?)/g;
        /** 分组：[xx亿，xx万，xx元，xx角，xx分] */
        const groupResult: Array<string> = Array.isArray(chinese.match(groupReg)) ? chinese.match(groupReg) : [];
        groupResult.forEach(strUnits => {
            /** 分组单位：亿，万，元，角，分 */
            const groupUnit: number = this._chineseUnit.get(strUnits.substr(-1, 1));
            const numberResult: Array<string> = Array.isArray(strUnits.match(numberReg)) ? strUnits.match(numberReg) : [];
            /** 组 匹配数字：[六百，二十，三] */
            numberResult.forEach((strUnit)=>{
                const number: number = this._chineseNumber.get(strUnit.substr(0, 1));
                const unit: number = this._chineseUnit.get(strUnit.substr(1, 2)) || 1;
                /** 结果累加 */
                result += number * unit * groupUnit;
            });
        });
        return result;
    }

    /** 数字转换中文 */
    public numberToChinese = (number: number): string => {
        return '';
    }

}
