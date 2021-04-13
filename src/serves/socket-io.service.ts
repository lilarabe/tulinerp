
/// <reference types="@types/socket.io-client" />

import { Injectable } from '@angular/core';


@Injectable()
export class SocketIoService {

    private _default_uri: string = 'http://172.16.11.175:8080';

    private _socket: SocketIOClient.Socket;

    constructor() {
    }

    public connect = (uri: string = this._default_uri): SocketIOClient.Socket => {
        this._socket = io(uri);
        return this._socket;
    }

    public emit = (event: string, ...args: any[]): SocketIOClient.Socket => {
        return this._socket.emit(event, ...args);
    }

    public on = (event: string, fn: Function): SocketIOClient.Emitter => {
        return this._socket.on(event, fn);
    }


}