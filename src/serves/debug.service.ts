import { Injectable } from '@angular/core';
import { IonicStorageService } from './ionic-storage.service';
import { AjaxService } from './ajax.service';


@Injectable()
export class DebugService {

    constructor(
        private _ionicStorageService: IonicStorageService,
        private _ajax: AjaxService,
    ) { }

    public setDebugs = async () => {
        const debugStorage: any = await this._ionicStorageService.get('debugConfigs');
        if (debugStorage) {
            const debugConfigs: Array<any> = debugStorage.response.payload.debugConfigs;
            debugConfigs.forEach((v) => {
                switch (v.key) {
                    case 'ajax':
                        this._ajax.setDebug(v.isDebug);
                        break;
                    default:
                        break;
                }
            });
        }
    }

}