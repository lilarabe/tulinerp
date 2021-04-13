/** 热更新文件信息 */
export interface ChcpType {
    /** 版本号 */
    release: string;
    /** 所需最小的外壳app版本 */
    min_native_interface: number;
    /** 更新模式 
     * start - app启动时安装更新. 默认值.
     * esume - app从后台切换过来的时候安装更新.
     * now - web内容下载完毕即安装更新.
    */
    update: 'start' | 'esume' | 'now';
    /** 更新地址 */
    content_url: string;
    /** apk包名. 如果指定了 - 引导用户到 Google Play Store 的app页面. */
    android_identifier: string;
    /** ios应用标识号, 比如: id345038631. 如果指定了 - 引导用户到 App Store 的app页面. */
    ios_identifier: string;
}