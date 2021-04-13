import { Injectable } from '@angular/core';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { ToolsProvider } from "../../serves/tools.service";


@Injectable()
export class BrowserProvider {

    /** debug? */
    private _isDebug: boolean = true;

    /** 浏览器配置 */
    private _options: ThemeableBrowserOptions = {
        statusbar: {
            color: '#ffffffff'
        },
        toolbar: {
            height: 44,
            color: '#67a9f8'
        },
        title: {
            color: '#ffffff',
            showPageTitle: true
        },
        backButton: {
            image: 'back',
            imagePressed: 'back_pressed',
            align: 'left',
            event: 'backPressed'
        },
        forwardButton: {
            image: 'forward',
            imagePressed: 'forward_pressed',
            align: 'left',
            event: 'forwardPressed'
        },
        closeButton: {
            wwwImage: 'assets/images/browser/close.png',
            align: 'left',
            event: 'closePressed'
        },
        customButtons: [
            {
                image: 'share',
                imagePressed: 'share_pressed',
                align: 'right',
                event: 'sharePressed'
            }
        ],
        menu: {
            image: 'menu',
            imagePressed: 'menu_pressed',
            title: 'Test',
            cancel: 'Cancel',
            align: 'right',
            items: [
                {
                    event: 'helloPressed',
                    label: 'Hello World!'
                },
                {
                    event: 'testPressed',
                    label: 'Test!'
                }
            ]
        },
        backButtonCanClose: true
    };

    constructor(
        private _themeableBrowser: ThemeableBrowser,
        private _tools: ToolsProvider,
    ) { }



    /**
     * @description 创建浏览器窗口 target: _self _blank _system
     * @memberof BrowserProvider
     */
    public create = (url: string, target: string = "_system"): void => {
        const browser: ThemeableBrowserObject = this._themeableBrowser.create(url, target, this._options);
        browser.on('closePressed').subscribe(data => {
            this._tools.printDebugMsg(`关闭`, this._isDebug);
            this._tools.printDebugMsg(data, this._isDebug);
            browser.close();
        });
    }
}