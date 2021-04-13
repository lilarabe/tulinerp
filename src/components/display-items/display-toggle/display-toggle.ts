import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";



@Component({
  selector: 'display-toggle',
  templateUrl: 'display-toggle.html'
})
export class DisplayToggleComponent extends DisplayItemComponent {

  constructor() {
    super();
  }

}
