/** autocomplete 组件  发送的 get 数据 */
export interface AutocompletePostParamsType {
    /** 表名 */
    tableName: string;
    /** 模块名 */
    moduleName: string;
}

/** autocomplete 组件  发送的 post 数据 */
export interface AutocompletePostDataType {
    /** 输入值 */
    value: string;
    /** 字段名 */
    key: string;
}

/** autocomplete 组件  传入的参数 */
export interface AutocompleteParams {
    /** 表名 */
    tableName: string;
    /** 模块名 */
    moduleName: string;
}

/** autocomplete 组件  打开 selectModal 的参数 */
export interface AutocompletePostSelectModalType {
    /** 值 */
    value: string;
    /** placeholder */
    placeholder: string;
    /** 字段名 */
    key: string;
    /** 表名 */
    tableName: string;
    /** 模块名 */
    moduleName: string;
}