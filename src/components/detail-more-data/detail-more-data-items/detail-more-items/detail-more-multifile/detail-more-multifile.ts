import { Component } from '@angular/core';
import { OpenBrowserProvider } from '../../../../../providers/open-browser/open-browser';
import { DetailMoreItemComponent } from '../detail-more-item';

@Component({
  selector: 'detail-more-multifile',
  templateUrl: 'detail-more-multifile.html'
})
export class DetailMoreMultifileComponent extends DetailMoreItemComponent {
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
