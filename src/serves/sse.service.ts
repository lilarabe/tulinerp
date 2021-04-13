import { Injectable } from '@angular/core';

@Injectable()
export class SseService {

    constructor(
    ) {
    }

    // public test = () => {
    //     console.log(`test`);
    //     this.creat();
    // }

    // /** 测试是否支持SSE */
    // private _isSupport = (): boolean => {
    //     let result: boolean = false;
    //     if ('EventSource' in window) {
    //         result = true;
    //     } else {
    //         console.log('客户端不支持 SSE');
    //         result = false;
    //     }
    //     return result;
    // }
    // /** 建立连接 */
    // public creat = () => {
    //     const url: string = 'http://hotcode.tulindev.com:85/data/sse.php';
    //     if (this._isSupport()) {
    //         // const source = new EventSource(url);
    //         // this._onopen(source);
    //         // this._onmessage(source);
    //         // this._onerror(source);
    //     }

    // }

    // /** 开启连接 */
    // private _onopen = (source) => {
    //     source.onopen = function (event) {
    //         console.log(`onopen:event`);
    //         console.log(event);
    //     };
    // }
    // /** 收到消息 */
    // private _onmessage = (source) => {
    //     source.onmessage = function (event) {
    //         console.log(`onmessage:event`);
    //         console.log(event);
    //     };
    // }
    // /** 发生通信错误 */
    // private _onerror = (source) => {
    //     source.onerror = (event) => {
    //         console.log(`onerror:event`);
    //         console.log(event);
    //         this._close(event);
    //     };
    // }
    // /** 关闭连接 */
    // private _close = (source) => {
    //     source.close();
    // }

}