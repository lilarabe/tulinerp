import { Component } from '@angular/core';
import { ListItemClass } from '../list-item';


@Component({
  selector: 'list-item-default',
  templateUrl: 'list-item-default.html',
  outputs: ['overflow'],
  host: {
    class: '',
  },
})
export class ListItemDefaultComponent extends ListItemClass {

  constructor(
  ) { super(); }

  ngOnInit() {
  }

  ngOnChanges(): void {
  }

  /** 是否溢出 */
  public isOverflow = (e:boolean):void => {
    if(e){
      // this._elRef.nativeElement.classList.add('w100');
    }
  }

}
