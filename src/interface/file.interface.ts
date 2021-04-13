/** 上传文件信息 */
export interface UploadFileInfoType {
    /** 文件名 */
    fileName?: string,
    /** 文件大小 */
    fileSize?: string | number,
    /** 文件路径 */
    filePath?: any,
    /** 文件类型 */
    fileType?: string,
    /** base64 */
    base64?: string,
    /** 后缀名 */
    suffixName?:string,
    /**字节大小 */
    size?:number,
}