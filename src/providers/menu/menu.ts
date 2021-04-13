
import { Injectable } from '@angular/core';
import { AjaxService } from '../../serves/ajax.service';
import { Events } from 'ionic-angular';

const defaultMenuData: any = {
  status: 0,
  payload: {
    moduleCategory: [],
  }
}


@Injectable()
export class MenuProvider {

  private _menuData: any = defaultMenuData;

  constructor(
    private _ajax: AjaxService,
    private _events: Events,
  ) { }


  public get menuData(): any {
    return this._menuData;
  }

  public set menuData(v: any) {
    this._menuData = v;
  }




  /** 获取首页数据 */
  public getMenuData = async (): Promise<any> => {
    return new Promise((reslove) => {
      this._ajax.loadData({
        method: 'get',
        title: '获取功能页module列表',
        uri: `menu.php`,
        isLoading: true,
        loadingCss: 'loading-delay',
        delay: 0,
      }).subscribe((res) => {
        let result: any = defaultMenuData;
        if (res.status === 1) {
          /*添加默认图标*/
          if (Array.isArray(res.payload.moduleCategory)) {
            res.payload.moduleCategory.map(v => {
              v.moduleList.map(v1 => {
                if (v1.src == '') {
                  // v1.src = './assets/images/home-default-icon.png';
                  // v1.src = './assets/images/default.png';
                }
              });
            });
          }
          result = res;
        }
        this.menuData = result;
        this._events.publish('menuDataReady', result);
        reslove(result);
      });
    });
  }

}
