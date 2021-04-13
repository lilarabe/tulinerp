import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, Slides } from 'ionic-angular';

/**
 * @description 图片预览组件
 * @author da
 * @export
 * @class PreviewImageComponent
 */
@Component({
  selector: 'preview-image',
  templateUrl: 'preview-image.html'
})
export class PreviewImageComponent {

  @ViewChild('slides') slides: Slides;
  /** 图片数组 */
  public imgArray: SlidesImagesType[] = [];
  /** 图片索引 */
  public index: number = 0;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
    this.imgArray = this.navParams.get('imgArray');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
  }

  public dismiss = (): void => {
    this.viewCtrl.dismiss();
  }

  public ionSlideDidChange = (): void => {
    //console.log(1);
  }

  /** 打开菜单 */
  public openMenu = (e:Event):void => {
  }

}

/**
 * @description 轮播图的数据结构
 * @author da
 * @export
 * @interface SlidesImagesType
 */
export interface SlidesImagesType {
  src: string,
}
