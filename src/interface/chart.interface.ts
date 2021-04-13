/**
 * 报表 列表 数据类型
 */
export interface ChartListType {
    "chartId": String,/** 报表ID */
    "chartName": String,/** 报表名称 */
}

/**
 * 报表 详情 数据类型
 */
export interface ChartDetailType {
    "title": String, /** 报表名称 */
    "type": String, /** 显示标识 */
    "data": Array<any>,/** 报表数据 */
}