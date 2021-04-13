import { Component } from '@angular/core';
import { OpenBrowserProvider } from '../../../../providers/open-browser/open-browser';
import { ListItemClass } from '../list-item';

/**
 * Generated class for the ListItemMultifileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-item-multifile',
  templateUrl: 'list-item-multifile.html',
  host: {
    'class': 'list-item-multifile',
  },
})
export class ListItemMultifileComponent extends ListItemClass {

  constructor(private _openBrowserProvider: OpenBrowserProvider, ) { super(); }

  /** 浏览器打开 */
  public openBrowser = async (webPath: string) => {
    if (webPath) {
      this._openBrowserProvider.openBrowser(webPath);
    }
  }

}
