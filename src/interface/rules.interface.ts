/** 动态表单数据 */
export interface EditRulesType {
    /** 字段名称 */
    "field": string;
    /** 规则标记 */
    "condition": number;
    /** 值 */
    "con_val": string;
    /** 影响字段 */
    "dynamic_fields": Array<EditRuleFilesType>;
    /** 自定义规则 */
    custom_cond: string,
    /** 隐藏时清除 */
    hideclear: string,
    /** 子表操作 */
    Son_Table: {
        /** 子表显示 or 隐藏 */
        Display: "'hidden'" | "'show'",
        /** 子表表名 */
        Table_Name: string,
    }[],
}

export interface EditRuleFilesType {
    /** 字段名称 */
    "field": string[];
    /** 是否隐藏 */
    "hidden": string;
    /** 是否必填 */
    "required": string;
    /** 是否只读 */
    "readonly": string;
}

/** 元数据类型 */
export interface MetaDataType {
    /** 主表数据 */
    "main": Map<string, string>;
    /** 子表数据 */
    "sub": Map<string, Array<Map<string, string>>>;
}