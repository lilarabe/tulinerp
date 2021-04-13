import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inform-details',
  templateUrl: 'inform-details.html',
})
export class InformDetailsPage {
  public data: JSON;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get("data");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformDetailsPage');
  }

}