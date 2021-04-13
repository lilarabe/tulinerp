import { Component } from '@angular/core';



@Component({
  selector: 'card-header',
  templateUrl: 'card-header.html',
  inputs: ['label'],
})
export class CardHeaderComponent {

  public label: string = '';

  constructor() {}

}
