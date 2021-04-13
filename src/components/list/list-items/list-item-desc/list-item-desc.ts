import { Component } from '@angular/core';
import { ListItemClass } from '../list-item';
import { TpProvider } from '../../../../providers/tp/tp';

@Component({
  selector: 'list-item-desc',
  templateUrl: 'list-item-desc.html',
  host: {
    'class': 'list-item-desc',
  },
})
export class ListItemDescComponent extends ListItemClass {
  /** 是否溢出 */
  public isOverflow: boolean = false;

  constructor(
    private _tp: TpProvider,
  ) { super(); }

  /** 是否溢出 */
  public testIsOverflow = (e: boolean): void => {
    if (e) {
      this.isOverflow = true;
    }
  }

  public readMore = (value: string) => {
    if (this.isOverflow) {
      this._tp.readMoreModal(value);
    }
  }

}
