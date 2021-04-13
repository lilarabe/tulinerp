import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToolsProvider } from '../../../../serves/tools.service';
import { ListItemClass } from '../list-item';
@Component({
  selector: 'list-item-date',
  templateUrl: 'list-item-date.html',
  outputs: ['overflow'],
  host: {
    class: '',
  },
})
export class ListItemDateComponent extends ListItemClass {
  /** 时间显示类型 */
  @Input() type: string = "date";
  /** 显示值 */
  public datetimeValue: string = '';

  public isOverflowAt: boolean = false;

  constructor(
    protected tools: ToolsProvider,
  ) { super(); }

  ngOnInit() {
    switch (this.type) {
      case 'date':
        this.datetimeValue = this.tools.dataStrFormat(this.value, 'date');
        break;
      case 'datetime':
        this.datetimeValue = this.tools.dataStrFormat(this.value, 'datetime');
        this.isOverflowAt = true;
        break;
      case 'yearmonth':
        this.datetimeValue = this.tools.dataStrFormat(this.value, 'yearmonth');
        break;
      default:
        this.datetimeValue = this.value;
        break;
    }
  }

  ngOnChanges(): void {
  }

  /** 是否溢出 */
  public isOverflow = (e: boolean): void => {
    if (e) {
      // this._elRef.nativeElement.classList.add('w100');
    }
  }

}
