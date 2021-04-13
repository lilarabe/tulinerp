import { Component } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';


@Component({
  selector: 'detail-more-toggle',
  templateUrl: 'detail-more-toggle.html'
})
export class DetailMoreToggleComponent extends DetailMoreItemComponent {

  constructor() {
    super();
  }

  ngOnChanges() {
    this._changeValue();
  }

  /** 改变 value */
  private _changeValue = (): void => {
    if(this.moreDataItemData.realvalue == 0 || this.moreDataItemData.realvalue=="false"){
      this.moreDataItemData.value = '否';
    } else if (this.moreDataItemData.realvalue == 1 || this.moreDataItemData.realvalue=="true"){
      this.moreDataItemData.value = '是';
    }
  }

}
