import { Component } from '@angular/core';

/**
 * Generated class for the DisplayMultiimageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'display-multiimage',
  templateUrl: 'display-multiimage.html'
})
export class DisplayMultiimageComponent {

  text: string;

  constructor() {
    console.log('Hello DisplayMultiimageComponent Component');
    this.text = 'Hello World';
  }

}
