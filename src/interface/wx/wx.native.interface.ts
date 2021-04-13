/**
 * app 微信分享参数类型
 */
export interface WXShareParamsType {
    /**
     * 分享到
     * Wechat.Scene.SESSION : 0 // 聊天界面
     * Wechat.Scene.TIMELINE : 1 // 朋友圈
     * Wechat.Scene.FAVORITE : 2 // 收藏
     */
    "scene": number,
    /**
     * 分享文本
     */
    "text"?: string,
    /**
     * 分享媒体消息内容
     */
    "message"?: WXShareParamsMessageType,
}

/**
 * 分享媒体消息类型
 */
export interface WXShareParamsMessageType {
    /** 标题 */
    "title": string,
    /** 描述 */
    "description": string,
    /** 缩略图 */
    "thumb"?: string,
    "mediaTagName"?: string,
    "messageExt"?: string,
    "messageAction"?: string,
    "media": WXShareParamsMessageMediaType,
}

/**
 * 
 */
export interface WXShareParamsMessageMediaType {
    /**
     *  APP:     1,
        EMOTION: 2,
        FILE:    3,
        IMAGE:   4,
        MUSIC:   5,
        VIDEO:   6,
        WEBPAGE: 7,
        MINI:8
     */
    "type": number,
    "image"?: string,
    "webpageUrl"?: string,
    /** 打开小程序类型 */
    "programType"?: number,
    /** 小程序原始id */
    "username"?: string,
    /** 小程序页面路径 */
    "path"?: string,
}



/**
 * 分享文字参数类型
 */
export interface WXShareParamsTextType {
    /** 分享的文字 */
    "text": string,
    /** 场景 */
    "scene": number,
}


/**
 * 分享图片参数类型
 */
export interface WXShareParamsImageType {
    /** 分享的图片路径 */
    "image": string,
    /** 场景 */
    "scene": number,
}


/**
 * 分享链接类型
 */
export interface WXShareParamsLinkType {
    /** 分享标题 */
    "title": string,
    /** 描述 */
    "description": string,
    /** 缩略图 */
    "thumb": string,
    /** 网址 */
    "webpageUrl": string,
    /** 场景 */
    "scene": number,
}


/**
 * 分享小程序类型
 */
export interface WXShareParamsMiniType {
    /** 分享标题 */
    "title": string,
    /** 打开小程序类型 可选默认0 */
    "programType"?: number,
    /** 缩略图 */
    "thumb": string,
    /** 网址 */
    "webpageUrl": string,
    /** 小程序原始id */
    "username": string
    /** 小程序页面路径 */
    "path": string,
    /** 启动参数 */
    "query"?: object,
}


/**
 * 打开小程序参数类型
 */
export interface WXOpenParamsMiniType {
    /** 小程序原始id */
    "username": string
    /** 小程序页面路径 */
    "path": string,
    /** 启动参数 */
    "query"?: object,
    /** 可选默认0 正式版:0, 开发版:1, Preview:2 */
    "programType"?: number,
}



/**
 * 微信授权成功返回数据类型
 */
export interface WXAuthSuccessResultType {
    /** 用户换取access_token的code，仅在ErrCode为0时有效 */
    code: string;
    /** 
     * 第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用sendReq时传入，
     * 由微信终端回传，state字符串长度不能超过1K
     *  */
    state: string;
    /** 
     * 微信客户端当前语言 zh_CN
     */
    lang: string;
    /** 
     * 微信用户当前国家信息 CN
    */
    country: string;
}



export interface WXPayParamsType {
    /** timestamp */
    timestamp: string,
    /** sign */
    sign: string,
    /** prepayid */
    prepayid: string,
    /** noncestr */
    noncestr: string,
    /** partnerid */
    partnerid: string,
}