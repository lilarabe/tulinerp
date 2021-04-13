import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";

@Component({
  selector: 'display-date',
  templateUrl: 'display-date.html'
})
export class DisplayDateComponent extends DisplayItemComponent {


  constructor() {
    super();
  }

}
