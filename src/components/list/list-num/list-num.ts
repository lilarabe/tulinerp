import { Component, Input } from '@angular/core';


@Component({
  selector: 'list-num',
  templateUrl: 'list-num.html'
})
export class ListNumComponent {

  @Input() public totalNum: number = 0;

  constructor() {}

}
