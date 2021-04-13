import { Component, Input } from '@angular/core';
import { ListItemsType } from '../../interface/list.interface';


/**
 * @description 详细页（detail）主表数据 显示
 * @author da
 * @export
 * @class DetailBaseComponent
 */
@Component({
  selector: 'detail-base',
  templateUrl: 'detail-base.html'
})
export class DetailBaseComponent {

  /** 列表数据 */
  @Input() public listData: Array<ListItemsType> = [];


  constructor(
  ) {}

  ngOnChanges() {
  }

}
