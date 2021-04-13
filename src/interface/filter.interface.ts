/** 过滤列表数据 */
export interface FilterDataType {
    /** 选择器名称 */
    selector: string;
    /** 显示类别名称 */
    name: string;
    /** 选择标识 */
    key: string;
    /** value */
    value?: any;
}

/** select 选择器的 valueArray */
export interface ValueArrayType {
    /** 显示名称 */
    name: string;
    /** value */
    value: any;
    /** 是否被选中 */
    selected: boolean;
}


/** 输出更改数据类型 */
export interface SendFilterItemEventType {
    /** key */
    key: string;
    /** value */
    value: any;
}