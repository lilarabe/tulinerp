import { Component, Input } from '@angular/core';
import { DetailMoreDataType } from '../../interface/detail.interface';


@Component({
  selector: 'detail-more-data',
  templateUrl: 'detail-more-data.html'
})
export class DetailMoreDataComponent {

  @Input() moreData: DetailMoreDataType[] = [];

  @Input() moduleName: string = '';

  @Input() moduleId: string = '';

  /** 显示按钮 */
  @Input() isShowMore: boolean = false;

  @Input() isEdit: boolean = true;

  constructor() {
  }

  ngOnChanges() {
  }

}
