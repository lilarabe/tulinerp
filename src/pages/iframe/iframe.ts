import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


// @IonicPage()
@Component({
  selector: 'page-iframe',
  templateUrl: 'iframe.html',
})
export class IframePage {

  /** iframe src 属性 */
  public iframeSrc: SafeResourceUrl = "";

  /** 标题 */
  public title: string = "";

  constructor(
    private _navParams: NavParams,
    private _domSanitizer: DomSanitizer,
  ) {
    this.iframeSrc = this._domSanitizer.bypassSecurityTrustResourceUrl(this._navParams.get("url"));
    // this.iframeSrc = this._domSanitizer.bypassSecurityTrustResourceUrl('https://www.163.com');
    this.title = this._navParams.get("title");
  }

}
