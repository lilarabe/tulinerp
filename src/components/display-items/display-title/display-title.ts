import { Component, OnChanges } from '@angular/core';
import { DisplayItemComponent } from "../display-item/display-item";

@Component({
  selector: 'display-title',
  templateUrl: 'display-title.html'
})
export class DisplayTitleComponent extends DisplayItemComponent implements OnChanges {

  constructor() {
    super();
  }

  ngOnChanges() {
  }

}
