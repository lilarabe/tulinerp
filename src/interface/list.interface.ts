/**
 * 列表单位数据类型
 */

export interface ListType {
    /** 是否可添加 */
    isAdd: boolean;
    /** 列表数据 */
    listData: Array<ListItemsType>;
    /** 每页条数 */
    num: number;
    /** 名称 */
    title: string;
    /** 总共条数 */
    total: number;
}
export interface ListItemsType {
    /** 模块名 */
    "Goto_Module"?: string;
    /** id */
    "id": string;
    /** 图片数据 */
    "pic"?: ListItemsPicType;
    /** 设置列数 */
    "cols": number;
    /** 字段数据 */
    "itemData": Array<ListItemType>;
    /** 是否可编辑 */
    "isEdit"?: boolean;
    /** 是否可删除 */
    "isDel"?: boolean;
    /** 子表id */
    "chileren_id"?: string;
    /** 是否被选中 */
    "isSelected"?: boolean;
    /** 显示字段 */
    "showFieldsSet"?: Set<string>;
    /** 审批状态:0:未发起 1:审批中 2:被驳回 3:已归档 */
    "approveStatus"?: 0 | 1 | 2 | 3;
    /** 是否为暂存数据 */
    isTempSave?: boolean,

}

/** 
 * 图片数据类型
*/
export interface ListItemsPicType {
    /** 图片地址 */
    "src": string,
    /** 宽度单位 */
    "width": number,
    /** 宽度单位 */
    "height": number,
}

/** 
 * 字段数据类型
*/
export interface ListItemType {
    /** 标题 */
    "name": string,
    /** 值 */
    "value": string,
    /** 选择器 */
    "selector": string,
    /** 占据长度 */
    "colspan": number,
    /** 设置行数 */
    "rowspan"?: number,
    /** 健值 */
    "key": string,
    colName?: string,
    /** tag 样式 */
    "tagStyle"?: any,
    /** 样式 */
    "setStyle"?: any,
}