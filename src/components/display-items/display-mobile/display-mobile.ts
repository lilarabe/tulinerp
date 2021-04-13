import { Component } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";

@Component({
  selector: 'display-mobile',
  templateUrl: 'display-mobile.html'
})
export class DisplayMobileComponent extends DisplayItemComponent {


  constructor() {
    super();
  }

  public doNothing = ():void => {}

}
