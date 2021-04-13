import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AjaxService } from '../../serves/ajax.service'
import { ListPage } from '../list/list';
import { ListProvider } from '../../providers/list/list';
import { IframePage } from '../iframe/iframe';
import { AppGlobalType } from 'interface/global.interface';

declare let app_global: AppGlobalType;


// @IonicPage({
//   name: 'home',
//   segment: 'home'
// })
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public panelData: Array<any> = [];

  constructor(
    private _navCtrl: NavController,
    private _ajax: AjaxService,
    private _listProvider: ListProvider,
  ) {
    this.getData();
  }

  ionViewWillEnter() {
    /** 清除列表数据 */
    this._listProvider.clearListData();
  }

  private getData = (): void => {
    this._ajax.loadData({
      method: 'get',
      title: '获取首页module列表',
      uri: `Index_Panel.php`,
    }).delay(0).subscribe(
      res => {
        if (res.status === 1) {
          this.panelData = res.payload.Panel;
        }
      }
    );
  };

  public onItemClick = (item): void => {
    const type: string = item.Type;
    let url: string = '';
    let title: string = '';
    switch (type) {
      case 'Chart':
        url = app_global.baseUrl + item.Url;
        title = item.Name;
        this._navCtrl.push(IframePage, { url, title });
        break;
      default:
        console.log(`无法匹配 type`);
        break;
    }
  }

  public onShortcutItemClick = (item): void => {
    const type: number = item.Type;
    switch (type) {
      case 0:
        const moduleName: string = item.Module;
        this._navCtrl.push(ListPage, { moduleName });
        break;
      case 1:
        const url: string = item.Url;
        const title: string = item.Title;
        this._navCtrl.push(IframePage, { url, title });
        break;
      default:
        console.log(`无法匹配 type`);
        break;
    }
  }

}
