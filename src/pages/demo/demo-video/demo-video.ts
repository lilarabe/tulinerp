import { Component } from '@angular/core';




@Component({
  selector: 'page-demo-video',
  templateUrl: 'demo-video.html',
})
export class DemoVideoPage {

  constructor() {
  }

  ionViewDidLoad() {
  }

  public uploadFileInfo = (e): void => {
    console.log(e);
  }

}
