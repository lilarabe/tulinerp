import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { ToolsProvider } from "../serves/tools.service";
import { AlertController } from 'ionic-angular';
import { IonicStorageService } from "./ionic-storage.service";

/**
 * @description 语言服务
 * @author da
 * @export
 * @class I18nService
 */
@Injectable()
export class I18nService {

    private langsSource = new Subject<any>();

    /**
     * @description 现有的语言标识 
     * @private
     * @type {string[]}
     * @memberof I18nService
     */
    public langsKeys: string[] = ["cn", "en"];


    /** 所有的语言数据 */
    private langsData: any[] = [];

    /** 当前语言数据 */
    private currLangData: any = {};

    /** 当前语言标识 */
    private currLang: string = "cn";

    /** 是否正在发出请求 */
    private isRequiring = false;

    constructor(
        private http: Http,
        private tools: ToolsProvider,
        private alertCtrl: AlertController,
        private _ionicStorageService: IonicStorageService,
    ) {
    }

    /**
     * @description 获取所有语言数据
     * @private
     * @memberof I18nService
     */
    private getLangs = (): Observable<any> => {
        return Observable.create((observer) => {
            const langs: Array<any> = [];
            this.langsKeys.forEach((v, k) => {
                const item: any = {};
                this.http.get(`assets/i18n/${v}.json`)
                    .map(res => {
                        return res.json();
                    })
                    .subscribe(res => {
                        item.key = v;
                        item.value = res;
                        langs.push(item);
                        if (k === this.langsKeys.length - 1) {
                            this.langsData = langs;
                            observer.next(langs);
                        }
                    });
            });
        });
    }


    /**
     * @description 根据参数返回语言数据
     * @private
     * @memberof I18nService
     */
    private setLangs = () => {
        let result = {};
        this.langsData.forEach((v) => {
            if (v.key === this.currLang) {
                result = v.value;
            }
        });
        this.currLangData = result;
    }

    /**
     * @description 改变语言
     * @memberof I18nService
     */
    public set = (lang: string): void => {
        this.currLang = lang;
        this._ionicStorageService.set('langKey', this.currLang).then(() => {
            this.setLangs();
            this.langsSource.next(this.currLangData);
        });
    }

    /**
     * @description 获取语言数据
     * @memberof I18nService
     */
    public get = (): Observable<any> => {
        /** 延迟发射数据流 */
        setTimeout(() => {

            if (this.tools.isNullObject(this.currLangData)) {
                if (!this.isRequiring) {
                    this.isRequiring = true;
                    this.getLangs().subscribe(() => {
                        /** 判断是否已经存储语言标识 */
                        this._ionicStorageService.get('langKey').then((res) => {
                            if (res) {
                                this.set(res);
                            } else {
                                this._ionicStorageService.set('langKey', this.currLang);
                                this.set(this.currLang);
                            }
                            this.isRequiring = false;
                        });
                    });
                }
            } else {
                this.langsSource.next(this.currLangData);
            }
        });
        return this.langsSource.asObservable();
    }

    /**
     * @description 选择语言
     * @memberof I18nService
     */
    public selectLangs = (): void => {
        this._ionicStorageService.get('langKey').then((currLangKey) => {
            if (currLangKey) {
                const alert = this.alertCtrl.create({
                    title: this.currLangData.HOME_SELECTLANGUAGE,/*选择语言*/
                    buttons: [
                        {
                            text: this.currLangData.HOME_CANCEL,/*取消*/
                        },
                        {
                            text: this.currLangData.HOME_OK,/*确定*/
                            handler: (data) => {
                                this.set(data);
                            }
                        }
                    ]
                });

                this.langsKeys.forEach((langKey) => {
                    let label: string = '';
                    let checked: boolean = currLangKey === langKey;
                    switch (langKey) {
                        case 'cn':
                            label = '中文';
                            break;
                        case 'en':
                            label = 'English';
                            break;
                        default:
                            label = "";
                            break;
                    }
                    const alertInputOptions: any = {};
                    alertInputOptions.type = "radio";
                    alertInputOptions.value = langKey;
                    alertInputOptions.label = label;
                    alertInputOptions.checked = checked;
                    alert.addInput(alertInputOptions);
                });

                alert.present();
            }
        });
    }

}