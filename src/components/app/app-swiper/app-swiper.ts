/** 
 * 安装：https://www.swiper.com.cn/
 * npm i --save-dev swiper
 * npm i --save-dev @types/swiper
 */
import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import Swiper from 'swiper';
// import { Swiper as SwiperESM, Navigation, History } from 'swiper/dist/js/swiper.esm';
import { ElementRef } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import { DownloadService } from '../../../serves/native/download.service';
// declare let Swiper: any;

@Component({
  selector: 'app-swiper',
  templateUrl: 'app-swiper.html'
})
export class AppSwiperComponent {

  @ViewChild('containerSelector') containerSelector: ElementRef;

  /** 图片数组 */
  public imgArray: SwiperType[] = [];

  /** 图片索引 */
  public index: number = 0;

  /** 显示菜单 */
  public showMenu: any = {
    /** 菜单 */
    showMenu: false,
    /** 下载 */
    showDownload: false,
  };

  constructor(
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _download: DownloadService,
    private _actionSheetCtrl: ActionSheetController,
  ) {
    this.imgArray = this._navParams.get('imgArray');
    this.index = this._navParams.get('index');
    this.showMenu = this._navParams.get('showMenu');
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this._renderSwiper();
    });
  }

  ionViewDidEnter() {
  }

  /** 渲染swiper */
  private _renderSwiper = (): void => {
    const swiper = new Swiper(this.containerSelector.nativeElement, {
      initialSlide: this.index,//设定初始化时slide的索引
      zoom: true,//双击,手势缩放
      loop: false,//循环切换
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        slideChange: () => {
          setTimeout(() => {
            const realIndex: number = swiper ? swiper.realIndex : 0;
            this.index = realIndex;
          });
        },
      },
    });
  }

  /** 关闭 */
  public dismiss = (): void => {
    this._viewCtrl.dismiss();
  }

  /**
   * @description 弹出ActionSheet
   * @memberof AppSwiperComponent
   */
  public onActionSheet = (): void => {
    const isShowDownload: boolean = !!(this.showMenu.showDownload);
    if ( isShowDownload === false ) {
      return void 0;
    }
    let actionSheet = this._actionSheetCtrl.create();
    actionSheet.setTitle('');
    actionSheet.addButton({
      text: '取消',
      role: 'cancel',
      handler: () => { }
    });
    /** 下载图片 */
    if(isShowDownload){
      actionSheet.addButton({
        text: '保存图片',
        handler: () => {
          const imagePath: string = this.imgArray[this.index].src;
          // const imagePath: string = 'assets/images/card.jpg';
          // const imagePath: string = 'http://sc.68design.net/photofiles/201901/CrXaxz6VjZ.jpg';
          // const imagePath: string = 'https://qjjfwpt.quanzhuejia.com/uploadfiles/qjjfwpt/data/t_weiguanzhuti_dongtai_wj_tupian_101547518501.jpg?md5=7023c2612241df85d74bbcd9e38bed93';
          this._download.downloadImageToAlbum(imagePath);
        }
      });
    }
    actionSheet.present();
  }

  public onImageClick = () => {
    this.dismiss();
  }

}


export interface SwiperType {
  src: string,
}
