import { Component } from '@angular/core';
import { DetailItemComponent } from "../detail-item/detail-item";



@Component({
  selector: 'detail-toggle',
  templateUrl: 'detail-toggle.html'
})
export class DetailToggleComponent extends DetailItemComponent {

  constructor() {
    super();
  }

}
