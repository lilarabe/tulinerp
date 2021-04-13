import { FormGroup } from "@angular/forms";

/** sheetlink get 数据 */
export interface SheetlinkGetData {
    /** 模块名称 */
    Type: string,
    /** workFlowId */
    DoWorkflow: string,
}

/** sheetlink post 数据 */
export interface SheetlinkPostData {
    /** xxx id */
    choseData: string,
    /** 当前数据 */
    currentData: {
        /** 主表数据 */
        main: any,
        /** 子表数据 */
        sub: any,
    },
}


/** sheetlink 返回 数据 */
export interface SheetlinkFetchData {
    /** 主表要更改的数据 */
    Main?: { [key: string]: SelectedDataType },
    /** 子表相关数据 */
    relation?: {
        /** 子表名称 */
        [tableName: string]: {
            /** 获取子表数据后的动作 */
            NoPrompt: NoPromptEnum,
            /** 新增的子表数据 */
            data: Array<SheetlinkChildData>,
        },
    },
}

/** sheetlink 子表数据 */
export interface SheetlinkChildData {
    /** 子表字段名称 */
    [fieldName: string]: {
        value: any,
        displayValue: any,
    }
}


/** sheetlink 组件  SelectedData */
export interface SelectedDataType {
    /** 键值  */
    key: string;
    /** 填充值 */
    value: any;
    /** 显示值 */
    displayValue?: string;
}

/** sheetlink 组件 SheetlinkParams */
export interface SheetlinkParamsType {
    workFlowId?: string; // 流程ID
    moduleName: string; // 模块名
    /** 是否触发 sheetlink ajax 请求 */
    nocascadesheetlink?: boolean,
    /** 编辑页数据 */
    editData: any,
    /** 主表表单 */
    mainForm: FormGroup,
}

/** 获取子表数据后的动作 */
export enum NoPromptEnum {
    /** 提示对话框，是否清空子表数据 */
    confirm = 0,
    /** 不弹出，直接清空，再增加新内容 */
    clearAdd = 1,
    /** 不弹出，直接追加新内容 */
    concat = 2,
}