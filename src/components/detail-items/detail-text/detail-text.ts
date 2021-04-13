import { Component } from '@angular/core';
import { DetailItemComponent } from "../detail-item/detail-item";
import { NavController } from 'ionic-angular';
import { DetailPage } from '../../../pages/detail/detail';


@Component({
  selector: 'detail-text',
  templateUrl: 'detail-text.html'
})
export class DetailTextComponent extends DetailItemComponent {

  constructor(
    private _navCtrl: NavController,
  ) {
    super();
  }

  /**
   * @description push的其他详情页
   * @memberof DetailItemsComponent
   */
  public pushFkModulePage = (e:Event): void => {
    // e.stopPropagation();
    const moduleName: string = this.fkModuleName || '';
    const id: string = this.fkModuleId || '';
    if ( !!moduleName && !!id ) {
      this._navCtrl.push(DetailPage,{moduleName, id});
    }
  }

}
