import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'app-video-player',
  templateUrl: 'app-video-player.html'
})
export class AppVideoPlayerComponent {

  /** 视频文件路径 */
  @Input() src: string = "";

  /** 预览图 */
  @Input() poster: string = './assets/images/poster.jpg';

  private _isIos: boolean = this._platform.is('ios');

  constructor(
    private _platform: Platform,
  ) {
  }

  ngOnChanges() {
    if (!this.poster) {
      this.poster = './assets/images/poster.jpg';
    }
    if(this._isIos){
      this.poster = this.poster.replace(/^file:\/\//i,'');
    }
  }

}
