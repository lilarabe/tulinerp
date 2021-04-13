import { Component, Input } from '@angular/core';


@Component({
  selector: 'grid-list',
  templateUrl: 'grid-list.html'
})
export class GridListComponent {

  @Input() public items: itemsType = { cols: 1, itemData: [] };

  /** 是否可以操作 */
  @Input() public operate: boolean = true;

  /** 行高(单位px) */
  public rowHeight: number = 30;

  constructor() {
  }

  ngOnChanges() {
    this._resetDefaultAttr();
  }

  /** 设置默认数据 */
  private _resetDefaultAttr = (): void => {
    /** 设置默认 cols */
    if (!this.items) {
      this.items.cols = 1;
    }
    /** 设置默认的 rowspan */
    if (this.items && Array.isArray(this.items.itemData)) {
      this.items.itemData.forEach((v) => {
        v.rowspan = 1;
        if (+v.colspan <= 0 || +v.colspan > this.items.cols) {
          v.colspan = this.items.cols;
        }
      });
      /** 清除选择器 display-image, hidden */
      // this.items.itemData = this.items.itemData.filter(v => v.selector !== 'display-image');
      // this.items.itemData = this.items.itemData.filter(v => v.selector !== 'hidden');

    }
  }
}

interface itemsType {
  cols: string | number; /** 每行分几份 */
  itemData: Array<any>; /** 每份数据 */
}