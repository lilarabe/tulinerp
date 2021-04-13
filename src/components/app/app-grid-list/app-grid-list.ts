import { Component, ElementRef, OnInit, AfterContentChecked, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { AppGridTileComponent } from "./app-grid-tile/app-grid-tile";
import { ToolsProvider } from "../../../serves/tools.service";


/**
 * @description grid-list 组件
 * @author da
 * @export
 * @class AppGridListComponent
 */
@Component({
  selector: 'app-grid-list',
  templateUrl: 'app-grid-list.html',
  exportAs: 'appGridList',
  host: {
    'class': 'app-grid-list',
  },
})
export class AppGridListComponent implements OnInit, AfterContentChecked, AfterContentInit {

  /** 每行平分几份 */
  @Input() cols: number;
  /** 行高 */
  @Input() rowHeight: string | number;
  /** 子组件 tile */
  @ContentChildren(AppGridTileComponent) gridTileCmps: QueryList<AppGridTileComponent>;
  /** 是否 debug */
  private _debug: boolean = false;
  /** 记录填充次数 */
  private _fillCount: number = 0;


  /**
   * @description 网格数组: 1:已经占用 0:未被占用
   * [
   *  [1,1,0,0],
   *  [1,1,1,0]
   * ]
   * @private
   * @type {Array<Array<number>>}
   * @memberof AppGridListComponent
   */
  private _gridList: Array<Array<number>> = [];

  constructor(
    private tools: ToolsProvider,
    private _element: ElementRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterContentChecked() {
  }

  ngAfterContentInit() {
    this._layoutTiles();
  }


  /**
   * @description tiles 布局
   * @private
   * @memberof AppGridListComponent
   */
  private _layoutTiles = (): void => {
    /** grid-tile 组件数组 */
    const tiles = this.gridTileCmps.toArray();
    /** 开始时间 */
    const startTime: number = +new Date();
    /** 在 _gridList 中 至少有一行数据 */
    if (this._gridList.length === 0) {
      this._addRow();
    }
    tiles.forEach((tile) => {
      /** 匹配每个 tile 在 grid 中的位置 */
      this._matchTile(tile);
      /** 设置 tile 样式 */
      this._setTileStyle(tile);

    });
    /** 设置list样式 */
    this._setListStyle("height", `calc(${this._gridList.length} * ${this.rowHeight})`);
    /** 结束时间 */
    const endTime: number = +new Date();
    this.tools.printDebugMsg(`填充次数${this._fillCount}`, this._debug);
    this.tools.printDebugMsg(`耗时${endTime - startTime}ms`, this._debug);
    this.tools.printDebugMsg(`填充结果 grid:`, this._debug);
    this.tools.printDebugMsg(this._gridList, this._debug);
  }



  /**
   * @description 匹配 tile 在 grid 中的位置
   * @private
   * @memberof AppGridListComponent
   */
  private _matchTile = (tile): AppGridTileComponent => {
    /** 列数 x */
    const col: number = tile.colspan;
    /** 行数 y */
    const row: number = tile.rowspan;
    /** 是否可以填充 */
    let isFill: boolean = true;

    /** 循环grid   */
    for (let i = 0; i < this._gridList.length; i++) {
      for (let ii = 0; ii < this.cols; ii++) {
        /** 记录成功填充次数 */
        let count: number = 0;
        isFill = false;

        this.tools.printDebugMsg(`grid坐标(${i}, ${ii})`, this._debug);
        /** 循环 tile 占用的单位 */
        for (let j = 0; j < row; j++) {
          for (let jj = 0; jj < col; jj++) {
            /** 记录填充次数 */
            this._fillCount++;
            /** 匹配 */
            if (this.tools.isUndefined(this._gridList[i + j])) {
              this.tools.printDebugMsg(`填充失败:this.tracker[${i + j}]=undefined`, this._debug);
            } else if (this.tools.isUndefined(this._gridList[i + j][ii + jj])) {
              this.tools.printDebugMsg(`填充失败:this.tracker[${i + j}][${ii + jj}]=undefined`, this._debug);
            } else if (this._gridList[i + j][ii + jj] === 1) {
              this.tools.printDebugMsg(`填充失败:this.tracker[${i + j}][${ii + jj}]=1`, this._debug);
            } else if (this._gridList[i + j][ii + jj] === 0) {
              this.tools.printDebugMsg(`填充成功:this.tracker[${i + j}][${ii + jj}]=0`, this._debug);
              count++
            } else {
              this.tools.printDebugMsg(`未知填充:this.tracker[${i + j}][${ii + jj}]=${this._gridList[i + j][ii + jj]}`, this._debug);
            }
          }
        }
        /** 如果 tile 的每个单元都可填充 返回数据 */
        if (count === row * col) {
          this.tools.printDebugMsg(`grid坐标(${i}, ${ii})填充成功`, this._debug);
          isFill = true;
          tile.x = ii;
          tile.y = i;
          for (let k = 0; k < row; k++) {
            this._gridList[k + i].fill(1, ii, ii + col);
          }
          return tile;
        }

      }
    }
    /** 如果都无法匹配，新增一行，在重新匹配 */
    if (isFill === false) {
      this._addRow();
      this._matchTile(tile);
    }
  }



  /**
   * @description 添加一行
   * @private
   * @memberof AppGridListComponent
   */
  private _addRow = () => {
    this.tools.printDebugMsg(`在grid中添加一行`, this._debug);
    const pushRow = [];
    for (let i = 0; i < this.cols; i++) {
      pushRow.push(0);
    }
    this._gridList.push(pushRow);
  }



  /**
   * @description 设置 tile 样式
   * @private
   * @memberof AppGridListComponent
   */
  private _setTileStyle = (tile): void => {
    /** 宽度设定 */
    const percentWidthPerTile: number = 100 / this.cols;
    const widthStyle: string = `calc(${percentWidthPerTile * tile.colspan}%)`;
    tile._setStyle("width", widthStyle);
    /** 高度设定 */
    const heightStyle: string = `calc(${this.rowHeight} * ${tile.rowspan})`;
    tile._setStyle("height", heightStyle);
    /** top设定 */
    const topStyle: string = `calc(${tile.y} * ${this.rowHeight})`;
    tile._setStyle("top", topStyle);
    /** left设定 */
    const leftStyle: string = `calc(${tile.x} * ${percentWidthPerTile}%)`;
    tile._setStyle("left", leftStyle);
  }




  /**
   * @description 设置 list 样式
   * @private
   * @memberof AppGridListComponent
   */
  private _setListStyle = (property: string, value: any): void => {
    (this._element.nativeElement.style as any)[property] = value;
  }


}