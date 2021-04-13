import { Injectable } from '@angular/core';
import { DetailMoreDataType, DetailItemDataTpye, DetailChildrenDataType, DETAILCHILDDATA } from '../../interface/detail.interface';
import { EditFieldsType } from '../../interface/approval.interface';
import { ToolsProvider } from '../../serves/tools.service';


@Injectable()
export class DetailFieldsDisplayProvider {

  constructor(
    private _tools: ToolsProvider,
  ) { }

  /** 设置主表隐藏字段 */
  public hideMasterFields = (moreData: Array<DetailMoreDataType>, masterFieldsSet: Set<string>): Promise<Set<string>> => {
    return new Promise((resolve) => {
      const result: Set<string> = new Set();
      if(masterFieldsSet.size === 0){
        resolve(result);
      }
      const itemsData: Array<DetailItemDataTpye> = this._getMasterItemsData(moreData);
      itemsData.map((item: DetailItemDataTpye) => {
        /** value 是否为空 */
        const isValueEmpty: boolean = item.value === '';
        /** 字段 */
        const field: string = item.key;
        if (masterFieldsSet.has(field)) {/** 设置显示字段 */
          item.isHide = false;
        } else if (isValueEmpty && item.selector !== 'hidden') {/** 设置隐藏字段 */
          item.isHide = true;
          result.add(field);
        }
      });
      this._tools.print(`主表隐藏字段:`, `y`);
      result.forEach((key: string)=>{
        const item: DetailItemDataTpye = this._getMasterItemData(key, moreData);
        this._tools.print(`[${item.name}](${item.key})`, `b`);
      });
      resolve(result);
    });
  }
  /** 设置主表显示字段 */
  public showMasterFields = (moreData: Array<DetailMoreDataType>) => {
    const itemsData: Array<DetailItemDataTpye> = this._getMasterItemsData(moreData);
    itemsData.map(v => { v.isHide = false; });
  }
  /** 设置字表字段 */
  public setChildrenFields = (chilerenData: Array<DetailChildrenDataType>, chilerenFieldsMap: Map<string, Array<EditFieldsType>>) => {
    chilerenFieldsMap.forEach((fields, tableName) => {
      /** 显示字段 */
      const showFieldsSet: Set<string> = new Set();
      const tableData: DetailChildrenDataType = this._getChildTable(tableName, chilerenData)
      if (tableData.moduleName) {
        /** 设置显示字段 */
        fields.map(v => {
          showFieldsSet.add(v.key);
        });
        tableData.showFieldsSet = showFieldsSet;
        /** 可添加 */
        tableData.isAdd = true;
        tableData.isEdit = true;
        tableData.listData.map(v => {
          /** 可删除 */
          v.isDel = true;
          /** 可编辑 */
          v.isEdit = true;
          /** 显示字段 */
          v.showFieldsSet = showFieldsSet;
        });

      }
    });
  }

  /** 展开所有主表数据 */
  private _getMasterItemsData = (moreData: Array<DetailMoreDataType>): Array<DetailItemDataTpye> => {
    let allMorData: Array<DetailItemDataTpye> = [];
    moreData.forEach(v => { allMorData = [...allMorData, ...v.itemData.filter(v => v.key)]; });
    return allMorData;
  }

  /** 获取子表数据 */
  private _getChildTable = (tableName: string, chilerenData: Array<DetailChildrenDataType>): DetailChildrenDataType => {
    let result: DetailChildrenDataType = DETAILCHILDDATA;
    const tableData: DetailChildrenDataType = chilerenData.filter(v => v.moduleName === tableName)[0];
    if (tableData) {
      result = tableData;
    } else {
      this._tools.print(`找不到子表:${tableName}`, `y`);
    }
    return result;
  }

  /** 通过key获取主表显示数据 */
  private _getMasterItemData = (key: string, moreData: Array<DetailMoreDataType>): DetailItemDataTpye => {
    let result: DetailItemDataTpye = { name: '', value: '', selector: '', key: '' };
    let allData: Array<DetailItemDataTpye> = [];
    moreData.forEach(v => { allData = [...allData, ...v.itemData.filter(v => v.key)]; });
    const itemsData: DetailItemDataTpye[] = allData.filter((v) => v.key === key);
    if (itemsData.length >= 1) {
      result = itemsData[0];
    } else if (itemsData.length === 0) {
      this._tools.print(`显示字段:无法在主表数据中找到key: ${key}`, 'r');
    }
    return result;
  }


}
