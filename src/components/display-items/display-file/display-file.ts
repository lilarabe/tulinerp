import { Component } from '@angular/core';
import { DisplayItemComponent } from '../display-item/display-item';
import { OpenBrowserProvider } from '../../../providers/open-browser/open-browser';


@Component({
  selector: 'display-file',
  templateUrl: 'display-file.html'
})
export class DisplayFileComponent extends DisplayItemComponent {

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
