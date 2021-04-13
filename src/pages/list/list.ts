import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content, Events, Navbar } from 'ionic-angular';
import { AjaxService } from '../../serves/ajax.service';
import { ToolsProvider } from '../../serves/tools.service';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { MsgService } from "../../serves/msg.service";
import { ListFilterComponent } from "../../components/list-filter/list-filter";
import { ListProvider } from "../../providers/list/list";
import { FilterDataType } from "../../interface/filter.interface";
import { ListType } from '../../interface/list.interface';
import { DataInformService } from '../../providers/multifile/dataInform.service';
import { EditPage } from '../../pages/edit/edit';


// @IonicPage({
//   name: 'list',
//   segment: 'list/:moduleName',
//   defaultHistory: ['home']
// })
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  @ViewChild(Content) content: Content;

  @ViewChild(Navbar) navBar: Navbar;

  /*列表数据*/
  public listData: Array<ListType> = [];

  /** 筛选数据 */
  protected filterData: FilterDataType[] = [];

  /*头部数据*/
  public headerData: any = {};

  /*发送的数据*/
  public postData: any = {};

  /*搜索数据*/
  public postSearchData: any = {};

  /*模块名称*/
  public moduleName: string = '';

  /*是否加载中*/
  public isLoading: boolean = false;

  /*列表页标题*/
  public title: string;

  /** 是否可添加 */
  public isAdd: boolean = false;

  /*搜索数据*/
  public searchDataValue: string = "";

  /*是否能翻页*/
  public canFlippingPage: boolean = true;

  /*页数*/
  public totalPages: number;

  /** 总共数据 */
  public totalNum: number = 0;

  /** 语言数据 */
  public langs: any = {};

  /** 搜索下拉数据 */
  public searchOptions: Array<string> = [];

  public page: number = 1;

  /** 是否请求完成 */
  public isLoaded: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    protected ajax: AjaxService,
    protected tools: ToolsProvider,
    public msg: MsgService,
    protected _modalCtrl: ModalController,
    protected _listProvider: ListProvider,
    protected _events: Events,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _dataInform: DataInformService,
  ) {
  }

  ionViewDidLoad() {
  }
  

  ngOnInit() {}

  /*编辑页数据更改，刷新列表页*/
  ionViewWillEnter() {
    this._init();
    const listData: Array<any> = this._listProvider.getListData(this.moduleName);
    if (Array.isArray(listData)) {
      this.listData = listData;
    }
  }

  ionViewWillUnload() {
    const addTopic: string = `listAddAction-${this.moduleName}`;
    this._events.unsubscribe(addTopic);
  }

  private _init = () => {
    this.moduleName = this.navParams.get('moduleName');
    this.headerData.Type = this.moduleName;
    this.listData = [];
    this.totalPages = 1;
    this.headerData.page = 1;
    this.postData.searchData = this.postSearchData;
    /** 将所有传入的参数合并，作为请求列表的params参数 */
    this.headerData = this.tools.extend(this.headerData, this.navParams.data);
    // this._getFilterData();
    this._iniData();
    this._catchListDataUpdataEvent();
  }

  /** 初始化数据 */
  protected _iniData = (): void => {
    this.headerData.page = 1;
    this.getListData$().delay(0).subscribe(res => {
      this.isLoading = false;
      if (res.status === 1) {
        this.title = res.payload.title;
        this.listData = res.payload.listData;
        // this._changeDetectorRef.markForCheck();
        this._changeDetectorRef.detectChanges();
        const listLength: number = this.listData.length;
        this.canFlippingPage = listLength < res.payload.num ? false : true;
        this.totalNum = +res.payload.total;
        /** 权限 */
        this.isAdd = !!res.payload.isAdd;
        this.content.scrollToTop(0);
        this.searchOptions = [];
      }
    });
  }




  /**
   * @description 打开筛选窗口
   * @memberof ListPage
   */
  public openFilterModal = (): void => {
    /** 清空搜索内容 */
    this.searchDataValue = "";
    const modal = this._modalCtrl.create(ListFilterComponent, { filterData: this.filterData });
    modal.present();
    /** 关闭 modal 赋值 */
    modal.onDidDismiss((value: object) => {
      if (this.tools.isNotUndefined(value)) {
        // console.log(`list 页接收到:`);
        // console.log(value);
        /** 过滤数据 */
        this.postData.filterData = value;
        this.headerData.search = 'filterSearch';
        this._iniData();
        /** 更改 filterData 的 value, 目的为了保存已经修改的 value, 再次打开modal默认显示已经选中值 */
        this.filterData.forEach((filterItem) => {
          for (let key in value) {
            if (key === filterItem.key) {
              filterItem.value = value[key];
            }
          }
        });
      }
    });
  }

  /*请求列表数据流*/
  protected getListData$ = (): Observable<any> => {

    this.isLoading = true;
    /** 真实数据 */
    return this.ajax.loadData({
      title: '请求列表数据',

      method: "post",
      uri: 'list_data.php',

      // method: "get",
      // url:"assets/data/list_data_aa.json",

      // method: "get",
      // url:"assets/data/list.data.json",

      params: this.headerData,
      data: {
        data: this.postData,
      },
      delay: 0,
    }).map((res) => {
      if (Array.isArray(res.payload.listData)) {
        this._listProvider.setListDataAttr(res.payload.listData);
        this.filterListDisplayData(res.payload.listData);
      }
      /** 请求完成 */
      this.isLoaded = true;
      return res;
    });

    /** mock 数据 */
    // return this.ajax.loadData({
    //   title: '请求列表数据',
    //   method: "get",
    //   url: 'assets/data/list.data.1.json',
    //   params: this.headerData,
    // });

  }

  /** 过滤列表的显示数据 */
  protected filterListDisplayData = (listData: any[]) => {
    listData.map((items: any) => {
      if (Array.isArray(items.itemData)) {
        items.itemData = items.itemData
          /** 过滤 value 为空的数据 */
          // .filter((item: any) => {
          //   return item.value !== '';
          // })
          .filter((item: any) => {
            return item.isHidden !== true;
          })
          /** 过滤 标签 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-tag';
          })
          /** 过滤 描述 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-desc';
          })
          /** 过滤 图片 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-image';
          })
          /** 过滤 文件 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-file';
          })
          /** 过滤 开关 选择器 */
          .filter((item: any) => {
            return item.selector !== 'display-toggle';
          })
          /** 强制增加 title 选择器 */
          .map((item: any, idx: number) => {
            if (idx === 0 && item.selector !== 'display-title') item.selector = 'display-title';
            return item;
          })
          /** 最多显示 */
          .filter((item: any, idx: number) => {
            return idx < 5;
          });
      }
    });
  }


  /** 捕获列表修改事件 */
  protected _catchListDataUpdataEvent = (): void => {
    /** add 事件 */
    const addTopic: string = `listAddAction-${this.moduleName}`;
    this._events.subscribe(addTopic, () => {
      this._iniData();
    });
    /** del 事件 */
    const delTopic: string = `listDelAction-${this.moduleName}`;
    this._events.subscribe(delTopic, () => {
      this.totalNum--;
    });

  }

  /** 请求下一页数据 */
  public asyncNextPage = async (): Promise<any> => {
    return new Promise((resolve) => {
      if (!this.isLoading && this.canFlippingPage) {
        this.headerData.page++;
        this.getListData$().delay(0).subscribe(res => {
          if (res.status === 1) {
            const listLength: number = res.payload.listData.length;
            this.listData = this.listData.concat(res.payload.listData);
            this.totalPages = res.payload.total;
            this.canFlippingPage = listLength < res.payload.num ? false : true;
            if (this.canFlippingPage) {
              resolve(true);
            }
          }
          this.isLoading = false;
        });
      }
    });
  }

  /**下拉刷新 */
  public doRefresh = (refresher): void => {
    this.headerData.page = 1;
    this.getListData$().delay(0).subscribe(res => {
      if (res.status === 1) {
        this.listData = res.payload.listData;
        this.totalNum = +res.payload.total;
        const listLength: number = this.listData.length;
        this.canFlippingPage = listLength < res.payload.num ? false : true;
      }
      this.isLoading = false;
      refresher.complete();
    });
  }

  public inputSearch = (keyword: string): void => {
    this.searchDataValue = keyword;
    if (this.searchDataValue === '') {
      this.postSearchData.data = this.searchDataValue;
      this.headerData.page = 1;
      this._iniData();
    }
    // const params = { ...this.headerData, keyword: this.searchDataValue };
    // this._listProvider.getSearchSelectData(params).subscribe(res => {
    //   if (Array.isArray(res.payload.data)) {
    //     this.searchOptions = res.payload.data;
    //   }
    // });
  }

  /** 点击选择搜索 option */
  public optionSelected = (option: string): void => {
    this._iniData();
    this.searchDataValue = option;
    this.searchInput('');
  }

  /** 点击搜索 */
  public searchInput = (keyword: string): void => {
    this.searchDataValue = keyword;
    this.postSearchData.data = this.searchDataValue;
    this.headerData.page = 1;
    this._iniData();
  }

  /** 搜索取消 */
  public searchClear = (): void => {
    this.searchDataValue = '';
    this.postSearchData.data = this.searchDataValue;
    this.headerData.page = 1;
    this._iniData();
  }

  /**
   * @description 主表新增
   * @memberof ListPage
   */
  public add = (): void => {
    this.navCtrl.push(EditPage, { ...this.headerData, moduleName: this.moduleName, action: 'add' });
  }

  /**
   * @description 获取过滤数据
   * @protected
   * @memberof ListPage
   */
  protected _getFilterData = (): void => {
    // this._listProvider.getFilterData(this.moduleName).subscribe(res => {
    //   this.filterData = res.payload.filterData || [];
    // });
  }

}