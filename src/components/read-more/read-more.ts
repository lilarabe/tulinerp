import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'read-more',
  templateUrl: 'read-more.html'
})
export class ReadMoreComponent {

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
