/**
 * 全局变量类型
 */
export interface AppGlobalType {
    /** 接口前缀 */
    baseUrl?: string,
    /** 语言数据 */
    langs?: Array<any>,
    /** android apk 下载地址 */
    androidApkUrl?: string,
    /** ios 下载 网址 */
    iosBrowserUrl?: string,
    /** android 热跟新地址 */
    androidHotCodePath?: string,
    /** ios 热跟新地址 */
    iosHotCodePath?: string,
    /** 审批后自动关闭 */
    isApprovedClose?: boolean;
    /** 文件路径 */
    fileBaseUrl: string;
    /** 是否在微信 */
    isWeixn: boolean,
    /** 是否在企业微信手机端 */
    isWxWorkMobile: boolean,
    /** 是否在企业微信PC端 */
    isWxWorkPc: boolean,
    /** 登录界面的logo */
    logoUrl?:string,
}