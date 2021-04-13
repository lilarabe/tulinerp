import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { OpenBrowserProvider } from '../../../../../providers/open-browser/open-browser';


@Component({
  selector: 'detail-more-file',
  templateUrl: 'detail-more-file.html'
})
export class DetailMoreFileComponent extends DetailMoreItemComponent {

  constructor(
    private _openBrowserProvider: OpenBrowserProvider,
  ) {
    super();
  }

  /** 浏览器打开 */
  public openBrowser = async (webPath: string) => {
    if (webPath) {
      this._openBrowserProvider.openBrowser(webPath);
    }
  }

}
