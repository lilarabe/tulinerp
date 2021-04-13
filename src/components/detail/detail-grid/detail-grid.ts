import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailRelevantModuleDataType } from '../../../interface/detail.interface';
import { DetailListPage } from '../../../pages/detail/detail-list/detail-list';


@Component({
  selector: 'detail-grid',
  templateUrl: 'detail-grid.html'
})
export class DetailGridComponent {

  @Input() relevantModuleData:Array<DetailRelevantModuleDataType> = [];


  constructor(
    public navCtrl: NavController,
  ) {
  }

  ngOnInit(): void {
  }

  click(e){
    this.navCtrl.push(DetailListPage, { data:e });
  }

}
