import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class IonicStorageService {

    /** storage Map */
    private _storageMap = new Map<string, any>();

    constructor(private _storage: Storage) {
        this._init();
    }

    private _init = async () => {
        /** 获取url上的site参数，用作本地存储的数据库名称 */
        let site: string = 'default';
        const href: string = window.location.href;
        href.replace(/site=(\w+)/i, ($input, $site) => {
            site = $site;
            return href;
        });
        await this.setStorageConfig(site);
    }

    /**
     * 配置本地存储
     * @param name 本地数据库名称
     */
    public setStorageConfig = async (name: string): Promise<any> => {
        const options: LocalForageOptions = { name };
        const localForage: LocalForage = await this._storage.ready();
        return new Promise((resolve) => {
            const result: boolean = localForage.config(options);
            resolve(result);
        });
    }

    /** 验证Storage是否可用 */
    public ready = async (): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._storage.set('key', 'value')
                .then(val => {
                    if (val === 'value') {
                        resolve(true);
                    } else {
                        reject();
                    }
                    this._storage.remove('key');
                })
                .catch(() => {
                    reject();
                });
        });
    }

    public set = async (key: string, value: any): Promise<any> => {
        this._storageMap.set(key, value);
        return await this._storage.set(key, value);
    }

    public get = async (key: string): Promise<any> => {
        return new Promise((resolve) => {
            if (this._storageMap.has(key)) {
                resolve(this._storageMap.get(key));
            } else {
                this._storage.get(key).then(res => {
                    if (res !== null) {
                        this._storageMap.set(key, res);
                    }
                    resolve(res);
                });
            }
        });
    }

    public del = async (key: string): Promise<any> => {
        this._storageMap.delete(key);
        return await this._storage.remove(key);
    }

    public clear = async (): Promise<any> => {
        this._storageMap.clear();
        return await this._storage.clear();
    }

    public getMap = (): Map<string, any> => {
        return this._storageMap;
    }

}