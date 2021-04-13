// import { ListItemsType } from "./list.interface";

import { FormControl, FormGroup } from "@angular/forms";

/*field 数据类型*/
export interface EditDataType {
  key: string;
  placeholder: string;
  selector: string;
  serial?: number;
  value?: any;
  disable?: boolean;
  readonly?: boolean;
  valueArray?: Array<{ name: string, value: any, isHidden: boolean }>;
  valids?: Array<string>;
  asyncValids?: Array<string>;
  displayValue?: string;
  tips?: string;
  fileMaxSize?: number;
  fileTypeNames?: Array<string>;
  autocompleteParams?: any;
  params?: any;
  displayFormat?: string;
  minDate?: string;
  maxDate?: string;
  metaData?: EditDataType;
  isHidden?: boolean;
  props?:string;
  formControl?: FormControl,
  /** 单位 */
  displayunit?: string,
}


/*主表分组数据类型*/
export interface GroupDataType {
  name?: string;
  expanded?: boolean;
  fieldArray: Array<EditDataType>;
  hidden?: boolean;
  valid?: boolean,
  index: number,
  /** 自定义 分组Id */
  groupId: string,
  /** 分组是否存在必填字段 */
  hasRequiredFields: boolean,
  /** 是否必填分组是最后一个 */
  // isLastRequiredGroup?: boolean,
  /** 是否分组所有字段可以更改 */
  isGroupFieldsCanEdit?: boolean,
}
/** 子表类型 */
export interface EditChildTabType {
  /** 显示形式 */
  displayStyle?: 'gallery' | 'list';
  /** 表名 */
  moduleName: string;
  /** 显示名称 */
  name?: string;
  /** 子表数据 */
  listData?: ChildGroupDataType[],
  /** 元数据 */
  metaData?: ChildGroupDataType,
  metaForm?: FormGroup,
  /**是否能添加 */
  add?: boolean,
  /** 子表是否隐藏 */
  hidden?: boolean,
  /** 是否可编辑 */
  edit?: boolean,
  /** 未改变的数据 */
  oldData?: EditChildTabType,
}

export interface ChildGroupDataType {
  /** 主键字段 */
  primaryKey?: string,
  /** 子表分组 */
  groups: GroupDataType[],
}


export interface EditChildTabGalleryType {
  id: string;
  src: string;
}

/** edit 提交数据 */
export interface PostEditDataType {
  data: { [index: string]: any };
  childrenData: Array<PostChildrenDataType>;
}

/** 子表提交数据 */
export interface PostChildrenDataType {
  [index: string]: Array<{ [index: string]: any }>,
}

/** 子表删除的数据 */
export interface DeleteChildrenDataType {
  tableName: string,
  delData: PostChildrenDataType,
}

/** 子表删除事件 参数 */
export interface ChildDelEventParams {
  /** 子表表名 */
  tableName: string,
  /** 删除索引 */
  delIndex: number,
}

/** 步骤数据 */
export interface StepsData {
  title: string,
  id: string,
}

/** 保存提交参数 */
export interface EditSaveQueryParams {
  /** 表名 */
  Type: string,
  /** id */
  ActionID?: string,
  /** SystemAction */
  SystemAction: 'DoInput',
  /** saveAcrion */
  saveAcrion: 'submit',
  /** 审批人id */
  approvalerId?: string,
  /** 审批状态 */
  approvalStatus?: number,
  /** 表单打开时间戳 */
  openTime?:number,
  /** 定时获取冲突信息需要的时间戳 */
  HasUpdated?:number
}

/** 关联数据 */
export interface RelevantionData {
  key: string,
  value: any,
}

/** 默认新增元数据 */
// export const AddChildMetaData:ChildGroupDataType = {
//   groups: []
// }

/** 页面初始化的 sheetlink */
export interface AddDefaultTrigger {
  main: { column: string, workflowId: string }[]
}