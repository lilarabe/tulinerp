/** 微信 jssdk config 默认值 */
export const WX_JSSDK_CONFIG: WxConfigType = {
    debug: false,
    beta: true,
    appId: '',
    timestamp: '',
    nonceStr: '',
    signature: '',
    jsApiList: [
        'onHistoryBack', // 监听页面返回事件
        'closeWindow', //关闭当前网页窗口接口
        'hideOptionMenu', // 隐藏右上角菜单接口
        'showOptionMenu', // 显示右上角菜单接口
        'hideMenuItems', // 批量隐藏功能按钮接口

        'onMenuShareTimeline', //分享到朋友圈
        'onMenuShareAppMessage', //分享给朋友
        'onMenuShareQQ', // 分享到QQ
        'onMenuShareWeibo', // 分享到腾讯微博
        'onMenuShareQZone', // 分享到QQ空间

        'startRecord', // 开始录音接口
        'stopRecord', // 停止录音接口
        'onVoiceRecordEnd', // 监听录音自动停止接口
        'playVoice', // 播放语音接口
        'translateVoice', // 识别音频并返回识别结果接口

        'getNetworkType', // 获取网络状态接口
        'openLocation', // 使用微信内置地图查看位置接口
        'getLocation', // 获取地理位置接口
        'scanQRCode', // 调起微信扫一扫接口
    ],
}

/** 微信 jssdk agentConfig 默认值 */
export const WX_JSSDK_AGENT_CONFIG: WxAgentConfigType = {
    corpid: '',
    agentid: '',
    timestamp: '',
    nonceStr: '',
    signature: '',
    jsApiList: [
        'onMenuShareTimeline', //分享到朋友圈
        'onMenuShareAppMessage', //分享给朋友
        'onMenuShareQQ', // 分享到QQ
        'onMenuShareWeibo', // 分享到腾讯微博
        'onMenuShareQZone', // 分享到QQ空间

        'startRecord', // 开始录音接口
        'stopRecord', // 停止录音接口
        'onVoiceRecordEnd', // 监听录音自动停止接口
        'playVoice', // 播放语音接口
        'translateVoice', // 识别音频并返回识别结果接口

        'getNetworkType', // 获取网络状态接口
        'openLocation', // 使用微信内置地图查看位置接口
        'getLocation', // 获取地理位置接口
        'scanQRCode', // 调起微信扫一扫接口
    ],
}

//微信 config
export interface WxConfigType {
    /** 必须这么写，否则wx.invoke调用形式的jsapi会有问题 */
    beta?: boolean,
    /** 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。 */
    debug: boolean,
    /** 企业微信的corpID */
    appId: string,
    /** 生成签名的时间戳 */
    timestamp: number | string,
    /** 生成签名的随机串 */
    nonceStr: string,
    /** 签名 */
    signature: string,
    /** 需要使用的JS接口列表 */
    jsApiList: Array<string>
}

//微信 agentConfig
export interface WxAgentConfigType {
    /** 企业微信的corpid，必须与当前登录的企业一致 */
    corpid: string,
    /** 企业微信的应用id */
    agentid: string,
    /** 生成签名的时间戳 */
    timestamp: number | string,
    /** 生成签名的随机串 */
    nonceStr: string,
    /** 签名 */
    signature: string,
    /** 需要使用的JS接口列表 */
    jsApiList: Array<string>
}

//分享到朋友圈
export interface ShareTimelineType {
    title: string, // 分享标题
    link: string, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl?: string, // 分享图标
    success?: any, // 用户确认分享后执行的回调函数
    cancel?: any, // 用户取消分享后执行的回调函数
}
// 分享到QQ
export interface ShareQQType extends ShareTimelineType {
    desc?: string, // 分享描述
}
//分享给朋友
export interface ShareAppMessageType extends ShareQQType {
    type?: string, // 分享类型,music、video或link，不填默认为link
    dataUrl?: string, // 如果type是music或video，则要提供数据链接，默认为空
}
//分享到腾讯微博
export interface ShareWeiboType extends ShareQQType { }
// 分享到QQ空间
export interface ShareQZoneType extends ShareQQType { }
//分享
export interface ShareType extends ShareAppMessageType { }