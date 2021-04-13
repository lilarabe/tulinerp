import { ListItemsType } from "./list.interface";

/*详细信息 数据类型*/

/** 详细数据 */
export interface DetailMoreDataType {
    groupName: string;
    isOpen: boolean;
    itemData: Array<DetailItemDataTpye>;
    /** 组显示 */
    group_Display: boolean;
    /** 分组是否显示 */
    // showGroup:boolean;
}

export interface DetailItemDataTpye {
    name: string;
    value: any;
    selector: string;
    key: string;
    realvalue?: any;
    setStyle?: any;
    numberValue?: number;
    /** 字段是否显示 */
    isHide?: boolean;
    /** 单位 */
    displayunit?: string,
}

export const DefaultMoreDataItemData: DetailItemDataTpye = {
    name: '',
    value: '',
    selector: '',
    key: ''
}


/** 子表数据 */
export interface DetailChildrenDataType {
    displayStyle: string;
    isAdd: boolean;
    /** 是否可编辑 */
    isEdit?: boolean;
    moduleName: string;
    name: string;
    listData: Array<ListItemsType>;
    /** 显示字段 */
    showFieldsSet?: Set<string>;
    /** 是否隐藏 */
    isHide?: boolean;
}
/** 子表数据 默认值 */
export const DETAILCHILDDATA: DetailChildrenDataType = {
    displayStyle: 'default',
    isAdd: false,
    isEdit: false,
    moduleName: '',
    name: '',
    listData: [],
    showFieldsSet: new Set(),
}

/** 相关模块数据 */
export interface DetailRelevantModuleDataType {
    /** 名称 */
    name: string;
    /** 图标图片路径 */
    iconImage?: string;
    /** 图标背景色 */
    iconColor?: string;
    /** 动作 */
    action: 'list' | 'add' | 'link' | 'openWeapp' | 'ajax' | 'detail';
    /** 模块名 */
    moduleName?: string;
    /** get 参数 */
    params?: any;
    /** 显示数量 */
    badge?: number;
    /** url 地址 */
    url?: string;
    /** title */
    title?: string;
    /** 图标地址 */
    imageUrl?: string;
    /** 小程序参数 */
    weapp?: DetailRelevantModuleDataWeappType;
    /** ajax方法 */
    method?: string;
    /** ajax发送数据 */
    data?: object;
}

/** 小程序打开或者分享 */
export interface DetailRelevantModuleDataWeappType {
    /** 原始Id */
    appid: string;
    /** 打开小程序路径 */
    path: string;
    /** 小程序启动参数 */
    query?: object;
}

export interface TopMenuExtraBtns {
    /** 显示名称 */
    name: string;
    /** 类型 1:ajax请求 2：打开detail */
    action: 'ajax' | 'detail';
    /** 请求地址 */
    url?: string;
    /** 参数 */
    params?: any;
}
