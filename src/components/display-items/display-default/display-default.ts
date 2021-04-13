import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";

@Component({
  selector: 'display-default',
  templateUrl: 'display-default.html'
})
export class DisplayDefaultComponent extends DisplayItemComponent {


  constructor() {
    super();
  }

}
