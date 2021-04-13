
/** 详情页 审批流数据类型 */
export interface ApprovalDataType {
    /** 审批日志数据 */
    logData?: Array<ApprovalLogDataType>;
    /** 审批人数据 */
    approvalerData: Array<ApprovalerDataType>;
    /** 是否待审批 */
    isApprovalPending?: boolean;
    /** 是否审批完成 */
    isComplete?: boolean;
    /** 审批状态 */
    approvalStatus: number;
    /** 模块名称 */
    moduleName?: string;
    /** 模块ID */
    moduleId?: string;
    /** 是否可提交 */
    isSubmit?: boolean;
    /** 是否显示提交按钮 */
    isShowSubmitBtn?: boolean;
    /** 驳回到指定审批人数据 */
    rejectData?: Array<ApprovalerDataType>;
    /** 主表可编辑字段，主表开放字段：必填字段 */
    baseOpenFiled?: Array<EditFieldsType>;
    /** 子表可编辑字段 */
    chilerenOpenFiled?: any;
    /** 审批节点 */
    node_now?: string,
    /** 当前审批人id */
    withdraw?: string,
    /** 下一级审批人节点 */
    Next_node: string,
}

/** 详情页 审批流数据类型 默认数据 */
export const DEFAULT_APPROVAL_DATA: ApprovalDataType = {
    logData: [],
    approvalerData: [],
    isApprovalPending: false,
    isComplete: false,
    isShowSubmitBtn: false,
    approvalStatus: -1,
    moduleName: '',
    moduleId: '',
    rejectData: [],
    Next_node: '',
}

/** 审批人数据类型 */
export interface ApprovalerDataType {
    label: string;
    value: string;
    /** 显示 跟 label 一样 */
    name?: string;
}


/** 审批日志数据类型 */
export interface ApprovalLogDataType {
    /** 审批人 or 发起人 */
    user?: string;
    /** 结果状态 */
    result: 'yes' | 'no' | 'start' | 'end';
    /** 意见 */
    message?: string;
    /** 日期 */
    date: string;
}

/** 可编辑字段 */
export interface EditFieldsType {
    /**key值 */
    key: string;
    /** 表名 */
    TB?: string;
    /** 字段中文名 */
    label?: string;
    /** 是否只读 */
    readonly: boolean;
    /** 是否必填 */
    required: boolean;
}

/** 审批流提交参数 */
export interface ApprovalSubmitParams {
    /** 审批人 id */
    approvalerId: string,
    /** 审批 id */
    ActionID: string,
    /** 模块名称 */
    Type: string,
    /** 下一级审批人节点 */
    Next_node: string,
}