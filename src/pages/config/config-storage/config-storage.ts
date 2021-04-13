import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MsgService } from '../../../serves/msg.service';
import { IonicStorageService } from '../../../serves/ionic-storage.service';



@Component({
  selector: 'page-config-storage',
  templateUrl: 'config-storage.html',
})
export class ConfigStoragePage {

  public type: string = 'storage';

  public storageData = [];

  public mapData: any[] = [];

  public localForageOptions: string = '';

  public href: string = window.location.href;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _storage: Storage,
    private _msg: MsgService,
    private _ionicStorageService: IonicStorageService,
  ) {
  }

  ionViewDidLoad() {
    this._getStorageData();
    this._getMapData();
  }

  private _getStorageData = (): void => {
    this.storageData = [];
    this._storage.ready().then((localForage: LocalForage) => {
      const localForageOptions: LocalForageOptions = localForage.config();
      this.localForageOptions = JSON.stringify(localForageOptions);
    });
    this._storage.forEach((value, key, index) => {
      value = JSON.stringify(value);
      this.storageData.push({ value, key, index });
    });
  }

  private _getMapData = (): void => {
    this.mapData = [];
    this._ionicStorageService.getMap().forEach((value, key) => {
      value = JSON.stringify(value);
      this.mapData.push({ value, key });
    });

  }

  public del = (item): void => {
    const confirm = this._msg.confirm('您确定要删除吗?');
    confirm.onDidDismiss(res => {
      if (res) {
        this._ionicStorageService.del(item.key).then(() => {
          this._getStorageData();
        });
      }
    });
  }

}
