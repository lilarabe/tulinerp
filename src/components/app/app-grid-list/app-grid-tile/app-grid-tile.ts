import { Component, Input, ElementRef } from '@angular/core';


/**
 * @description gird-list 的 子组件
 * @author da
 * @export
 * @class AppGridTileComponent
 */
@Component({
  selector: 'app-grid-tile',
  templateUrl: 'app-grid-tile.html',
  exportAs: 'appGridTile',
  host: {
    "class": "app-grid-tile",
  },
})
export class AppGridTileComponent {

  /** 行数 */
  @Input() colspan: number;
  /** 列数 */
  @Input() rowspan: number;

  constructor(
    private _element: ElementRef,
  ) {
  }

  /**
   * @description 设置 tile 样式
   * @memberof AppGridTileComponent
   */
  public _setStyle = (property: string, value: any): void => {
    (this._element.nativeElement.style as any)[property] = value;
  }

}
