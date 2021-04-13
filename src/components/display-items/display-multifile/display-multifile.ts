import { Component } from '@angular/core';
import { OpenBrowserProvider } from '../../../providers/open-browser/open-browser';
import { DisplayItemComponent } from '../display-item/display-item';

/**
 * Generated class for the DisplayMultifileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'display-multifile',
  templateUrl: 'display-multifile.html'
})
export class DisplayMultifileComponent extends DisplayItemComponent {
  public FileInfo: Array<any> = [];
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
