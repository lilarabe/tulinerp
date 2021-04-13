import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ListPage } from '../list/list';
import { IonicStorageService } from '../../serves/ionic-storage.service';
import { MenuProvider } from '../../providers/menu/menu';


// @IonicPage({
//   name: 'menu',
//   segment: 'menu'
// })
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  public moduleCategory: Array<any> = [];
  /** 搜索关键词 */
  public keyword: string = '';
  /** 搜索结果 */
  public searchResult: any[] = [];

  public title: string = '首页';

  /**
   * 默认图标颜色
   */
  public defaultIconColors: Array<string> = [
    /** 蓝色 */
    '#3178ff',
    /** 黄色 */
    '#f8b467',
    /** 红色 */
    '#fc6666',
    /** 青色 */
    '#72dced',
  ];


  constructor(
    private _navCtrl: NavController,
    private _ionicStorageService: IonicStorageService,
    private _events: Events,
    private _menuProvider: MenuProvider,
  ) {
    this._events.subscribe('menuDataReady', (res)=>{
      this._setData(res);
    });
  }

  ionViewDidLoad() {
    this._setData(this._menuProvider.menuData);
  }

  ionViewWillEnter() {
    this.keyword = '';
    this.searchResult = [];
  }

  /** 设置 title */
  private _setTitle = (): void => {
    this._ionicStorageService.get('company').then(res => {
      this.title = res ? `${res} - 首页` : `首页`;
    });
  }

  private _setData = (res: any): void => {
    this._setTitle();
    if (res.status === 1) {
      this.moduleCategory = res.payload.moduleCategory;
    }
  }

  /** push 到列表页*/
  public pushListPage = (moduleName: string): void => {
    this._navCtrl.push(ListPage, { moduleName });
  }


  /** 扫描二维码 */
  public getQrCode = (qrcode: string) => {
    console.log(`扫描二维码结果:${qrcode}`);
  }

  /** 搜索 */
  private _search = (keyword: string) => {
    this.searchResult = [];
    const strReg: string = `[\\d|\\D]*(${keyword})[\\d|\\D]*`;
    const reg: RegExp = new RegExp(strReg, "i");
    this.moduleCategory.map((category) => {
      if (Array.isArray(category.moduleList)) {
        const categoryName: string = category.categoryName;
        category.moduleList.map((module) => {
          const name: string = module.name;
          const key: string = module.key;
          name.replace(reg, ($input, $keyword) => {
            if ($keyword) {
              const result: any = { name, key, categoryName };
              this.searchResult.push(result);
            }
            return $input;
          });
        });
      }
    });
  }
  /** 搜索取消事件 */
  public searchClear = () => {
    this.searchResult = [];
  }
  /** 自动搜索事件 */
  public inputSearch = (keyword: string) => {
    this._search(keyword);
  }
  /** 点击搜索事件 */
  public searchInput = (keyword: string) => {
    this._search(keyword);
  }

}
