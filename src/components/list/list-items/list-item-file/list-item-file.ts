import { Component } from '@angular/core';
import { ListItemClass } from '../list-item';
import { OpenBrowserProvider } from '../../../../providers/open-browser/open-browser';


@Component({
  selector: 'list-item-file',
  templateUrl: 'list-item-file.html',
  host: {
    class: 'list-item-file',
  },
})
export class ListItemFileComponent extends ListItemClass {

  constructor(private _openBrowserProvider: OpenBrowserProvider, ) { super(); }

  /** 浏览器打开 */
  public openBrowser = async (webPath: string) => {
    if (webPath) {
      this._openBrowserProvider.openBrowser(webPath);
    }
  }

}
