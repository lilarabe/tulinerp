import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";

@Component({
  selector: 'display-datetime',
  templateUrl: 'display-datetime.html'
})
export class DisplayDatetimeComponent extends DisplayItemComponent {


  constructor() {
    super();
  }

}
