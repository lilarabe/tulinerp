
import { Component, Input } from '@angular/core';
import { DetailMoreItemComponent } from '../detail-more-item';
import { Modal, ModalController } from 'ionic-angular';
import { DisplayDescShowComponent } from '../../../../display-items/display-desc/display-desc-show/display-desc-show';
import { ToolsProvider } from '../../../../../serves/tools.service';

@Component({
  selector: 'detail-more-date',
  templateUrl: 'detail-more-date.html'
})
export class DetailMoreDateComponent extends DetailMoreItemComponent {
  /** 时间显示类型 */
  @Input() type: string = "date";
  /** 显示值 */
  public datetimeValue: string = '';
  /** 是否溢出 */
  public isOverflow: boolean = false;

  private _modal: Modal;

  constructor(
    private _modalCtrl: ModalController,
    protected tools: ToolsProvider,
  ) {
    super();
  }

  ngOnInit(): void {
    switch (this.type) {
      case 'date':
        this.datetimeValue = this.tools.dataStrFormat(this.moreDataItemData.value, 'date');
        break;
      case 'datetime':
        this.datetimeValue = this.tools.dataStrFormat(this.moreDataItemData.value, 'datetime');
        break;
      case 'yearmonth':
        this.datetimeValue = this.tools.dataStrFormat(this.moreDataItemData.value, 'yearmonth');
        break;
      default:
        this.datetimeValue = this.moreDataItemData.value;
        break;
    }
  }
  /** 测试是否溢出 */
  public testOverflow = (e: boolean) => {
    this.isOverflow = e;
  }
  /** 文字预览 */
  public textView = (): void => {
    /** 文字长度 */
    const strLen: number = this.moreDataItemData.value.length;
    if (this.isOverflow && strLen > 20) {
      this._modal = this._modalCtrl.create(DisplayDescShowComponent, { value: this.moreDataItemData.value });
      this._modal.present();
    }
  }

}
