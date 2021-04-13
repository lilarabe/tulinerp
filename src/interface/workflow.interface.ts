/** 工作流数据类型 */


/** tabs获取工作流信息 */
export interface WorkflowTabsInfoType {
    /** 角标 */
    badge: number,
}

/** 工作流类别 */
export interface WorkflowCategoryType {
    /** 名称 */
    categoryName: string,
    /** 角标 */
    badge: number,
    /** 模块名 */
    moduleName: string,
    /** 角标颜色 */
    badgeColor?: 'gray' | 'red',
}