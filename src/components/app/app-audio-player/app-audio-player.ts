import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-audio-player',
  templateUrl: 'app-audio-player.html'
})
export class AppAudioPlayerComponent {

  /** 音频文件路径 */
  @Input() src: string = "";

  constructor(
  ) {
  }

  ngOnChanges() {
  }

}
