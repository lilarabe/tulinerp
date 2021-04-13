import { Injectable } from '@angular/core';
import { ToolsProvider } from './tools.service';
import { MsgService } from './msg.service';
import { AjaxService } from './ajax.service';
// import { AppGlobalType } from '../interface/global.interface';
import { LoginProvider } from '../providers/login/login';
import { WxConfigType, WX_JSSDK_CONFIG, WxAgentConfigType, WX_JSSDK_AGENT_CONFIG } from '../interface/wx.jssdk.interface';
import { IonicStorageService } from './ionic-storage.service';
// declare const app_global: AppGlobalType;


@Injectable()
export class WxService {

    /** 微信用户ID */
    public wxUserid: string = '';

    constructor(
        private _tools: ToolsProvider,
        private _msg: MsgService,
        private _ajax: AjaxService,
        private _loginProvider: LoginProvider,
        private _ionicStorageService: IonicStorageService,
    ) {
    }


    /** 获取 微信 CODE */
    public getWxCodeByUrl = (): string => {
        const code: string = this._tools.urlToObj(window.location.href).query.code || '';
        if (!code) this._msg.toast('获取微信 CODE 失败');
        return code;
    }

    


    /** 微信自动登录 */
    public wxAutoLogin = async (): Promise<any> => {
        this.wxUserid = await this._ionicStorageService.get('wxUserid');
        // const code: string = this.getWxCodeByUrl();
        /** url params */
        const urlParams: any = this._tools.urlToObj(window.location.href).query;
        /** 企业微信 code */
        const code: string = urlParams.code || '';
        /** 模块名 */
        const module: string = urlParams.module || '';
        /** 模块 id */
        const actionid: string = urlParams.actionid || '';
        /** push 页面名称 */
        // const topage: string = urlParams.topage || '';
        /** site */
        const site: string = urlParams.site || '';
        /** get 数据 */
        const params: any = {LoginAction: 'Login', 'QYWX_CORD': code, module, actionid, site };
        return new Promise((resolve) => {
            if (code === '') {
                resolve(true);
                return;
            }
            this._ajax.loadData({
                uri: 'login.php',
                method: 'post',
                title: '微信自动登录',
                params,
                testToken: false,
            }).subscribe(async (res) => {
                
                if (res.status === 1) {
                    this.wxUserid = res.payload.userid || '';
                    await this._ionicStorageService.set('wxUserid', this.wxUserid);
                    if (res.payload.token) {
                        await this._loginProvider.login(res);
                    } else if (res.payload.userid) {
                        this.wxUserid = res.payload.userid;
                        
                    }
                    
                }
                resolve(true);
            });
        });
    }

    /** 获取微信jssdk config */
    public getJssdkConfig = async (url: string = window.location.href): Promise<any> => {
        /** url params */
        const urlParams: any = this._tools.urlToObj(window.location.href).query;
        /** site */
        const site: string = urlParams.site || '';
        return new Promise((resolve) => {
            this._ajax.loadData({
                uri: 'enterWechat.php',
                method: 'post',
                title: '获取微信jssdk config',
                params: { wxsign: 1, site },
                data: { url },
                // testToken: false,
            }).subscribe(async (res) => {
                let config: WxConfigType = WX_JSSDK_CONFIG;
                if (res.status === 1) {
                    const appId: string = res.payload.corpid;
                    const timestamp: string = res.payload.timestamp;
                    const nonceStr: string = res.payload.noncestr;
                    const signature: string = res.payload.signature;
                    config = {...config, appId, timestamp, nonceStr, signature};
                }
                resolve(config);

            });
        });
    }

    /** 获取微信jssdk agentConfig */
    public getJssdkAgentConfig = async (url: string = window.location.href): Promise<any> => {
        /** url params */
        const urlParams: any = this._tools.urlToObj(window.location.href).query;
        /** site */
        const site: string = urlParams.site || '';
        return new Promise((resolve) => {
            this._ajax.loadData({
                uri: 'enterWechat.php',
                method: 'post',
                title: '获取微信jssdk agentConfig',
                params: { wxsign: 2 , site},
                data: { url },
            }).subscribe(async (res) => {
                let agentConfig: WxAgentConfigType = WX_JSSDK_AGENT_CONFIG;
                if (res.status === 1) {
                    const corpid: string = res.payload.corpid;
                    const agentid: string = res.payload.agentid;
                    const timestamp: string = res.payload.timestamp;
                    const nonceStr: string = res.payload.noncestr;
                    const signature: string = res.payload.signature;
                    agentConfig = {...agentConfig, corpid, agentid, timestamp, nonceStr, signature};
                }
                resolve(agentConfig);

            });
        });
    }


}