/** multisheetlink 发送的数据 */
export interface MultisheetlinkSendDataType {
  /** 选中数据字符串 */
  strSelectedData: string,
  /** 选中数据数组 */
  arrSelectedData: string[],
}


/** multisheetlink 接收数据 */
export interface MultisheetlinkParamsType {
  /** 选择健值 */
  selectKey:string,
}