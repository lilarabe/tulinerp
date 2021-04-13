import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'display-desc-show',
  templateUrl: 'display-desc-show.html'
})
export class DisplayDescShowComponent {

  public value: string = '';

  constructor(
    private _viewCtrl: ViewController,
    private _navParams: NavParams,
  ) {
    this.value = this._navParams.get('value');
  }


  public dismiss = (): void => {
    this._viewCtrl.dismiss();
  }

}
