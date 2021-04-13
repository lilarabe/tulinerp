import { Component } from '@angular/core';
import { ListItemClass } from '../list-item';
import { TpProvider } from '../../../../providers/tp/tp';
import { OpenBrowserProvider } from '../../../../providers/open-browser/open-browser';


@Component({
  selector: 'list-item-image',
  templateUrl: 'list-item-image.html',
  host: {
    'class': 'list-item-image',
  },
})
export class ListItemImageComponent extends ListItemClass {

  public btnText: string = '预览图片';

  constructor(
    private _tp: TpProvider,
    private _openBrowserProvider: OpenBrowserProvider,
  ) { super(); }

  ngOnChanges() {
    this.btnText = this._isImage(this.value) ? '预览图片' : '查看文件';
  }

  /** 浏览器打开 */
  public openBrowser = async (webPath: string) => {
    if (webPath) {
      this._openBrowserProvider.openBrowser(webPath);
    }
  }

  /** 图片预览 */
  public previewImage = (src: string): void => {
    if(this._isImage(src)){
      this._tp.openPreviewImageModal([{ src }]);
    } else {
      this.openBrowser(src);
    }
  }

  /** 是否是图片文件 */
  private _isImage = (src: string): boolean => {
    const suffixSet:Set<string> = new Set(['jpg','png','gif','bmp']);
    let suffix: string = '';
    if(src){
      suffix = src.slice(src.lastIndexOf('.')+1).toLocaleLowerCase();
    }
    return suffixSet.has(suffix);
  }

}
