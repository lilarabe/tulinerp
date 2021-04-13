import { Injectable } from '@angular/core';
import { AjaxService, ResponseDataType } from "../../serves/ajax.service";
import { Observable } from 'rxjs';
import { Events } from 'ionic-angular';
import { ListItemsType } from '../../interface/list.interface';


/**
 * @description 列表页服务
 * @author da
 * @export
 * @class ListProvider
 */
@Injectable()
export class ListProvider {

  /** 列表页数据 key:moduleName value:列表数据(array) */
  public _listData = new Map<string, Array<any>>();

  constructor(
    private _ajax: AjaxService,
    protected _events: Events,
  ) {
  }


  /**
   * @description 设置列表数据
   * @memberof ListProvider
   */
  public setListData = (key: string, listData: Array<any>): void => {
    this._listData.set(key, listData);
  }


  /**
   * @description 清除列表数据
   * @memberof ListProvider
   */
  public clearListData = (): void => {
    this._listData.clear();
  }


  /**
   * @description 编辑列表数据
   * @memberof ListProvider
   */
  public editListData = (key: string, editId: string, editData: any): void => {
    if (Array.isArray(this._listData.get(key))) {
      const index: number = this._listData.get(key).findIndex(v => v.id === editId);
      if (index !== -1) {
        const itemData: Array<any> = this._listData.get(key)[index].itemData || [];
        itemData.forEach(v => {
          if (editData[v.colName] !== undefined) {
            v.value = editData[v.colName];
            console.info(`编辑列表数据:在key:${key}列表数据中,id:${editId}的数据修改字段:${v.colName} - value:${v.value}`);
          } else {
            console.error(`编辑列表数据报错:无法在editData数据中找到 ${v.colName} 的字段`);
          }
        });
        // this._listData.get(key).splice(index, 1);
      } else {
        console.error(`编辑列表数据报错:无法在key:${key}列表数据中找到id:${editId}的数据`);
      }
    } else {
      console.error(`编辑列表数据报错:无法找到key:${key}的列表数据`);
    }
  }



  /**
   * @description 添加列表数据
   * @memberof ListProvider
   */
  public addListData = (key: string, addItem?: ListItemsType): void => {
    // if (Array.isArray(this._listData.get(key))) {
    //   this._listData.get(key).splice(0, 0, addItem);
    // }
    /** 列表新增事件发送 */
    const topic: string = `listAddAction-${key}`;
    this._events.publish(topic);
  }


  /**
   * @description 删除一条列表数据
   * @returns 返回删除后的列表数据
   * @memberof ListProvider
   */
  public delListData = (key: string, delId: string): Array<any> => {
    if (Array.isArray(this._listData.get(key))) {
      const index: number = this._listData.get(key).findIndex(v => v.id === delId);
      if (index !== -1) {
        this._listData.get(key).splice(index, 1);
        const topic: string = `listDelAction-${key}`;
        this._events.publish(topic);
      }
    }
    return this._listData.get(key) || [];
  }


  /**
   * @description 获取列表数据
   * @memberof ListProvider
   */
  public getListData = (key: string): Array<any> => {
    return this._listData.get(key);
  }

  /**
   * @description 主表删除 item
   * @memberof ListProvider
   */
  public delItem = (itemId, moduleName): Observable<any> => {
    return this._ajax.loadData({
      method: 'get',
      title: '删除列表数据',
      uri: 'delete.php',
      params: {
        SystemAction: 'DoDelete',
        Type: moduleName,
        ActionID: itemId
      }
    });
  }


  /**
   * @description 子表删除 item
   * @memberof ListProvider
   */
  public delChildItem = (tableName: string, itemId: string): Observable<any> => {
    return this._ajax.loadData({
      method: 'get',
      title: '删除列表数据',
      uri: 'delete.php',
      params: {
        action: 'delChildItem',
        tableName: tableName,
        itemId: itemId
      }
    });
  }


  /**
   * @description 列表页-获取过滤数据
   * @private
   * @memberof ListProvider
   */
  public getFilterData = (moduleName: string): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      title: "列表页-获取过滤数据",
      method: "get",
      // url: "assets/data/filter.data.json",
      uri: "filter_list_data.php",
      params: {
        Type: moduleName,
        search: "filterSearch"
      }
    });
  }

  /** 获取搜索下拉数据 */
  public getSearchSelectData = (params): Observable<ResponseDataType> => {
    return this._ajax.loadData({
      method: 'get',
      url: 'assets/data/autocomplete.data.json',
      // method: 'post',
      // uri: 'autocomplete.php',
      title: '获取搜索下拉数据',
      params,
    });
  }

  /**
   * 设置列表数据 属性
   * @param listData 
   */
  public setListDataAttr = (listData: Array<ListItemsType>) => {
    listData.forEach(list => {
      /** 设置 是否暂存 属性 */
      if (list.isTempSave === undefined) {
        list.isTempSave = false;
        list.itemData.forEach(item => {
          if (item.colName === 'tempsave' && item.value === '暂存') list.isTempSave = true;
        });
      } else {
        list.isTempSave = !!list.isTempSave;
      }
    });
  }

}
