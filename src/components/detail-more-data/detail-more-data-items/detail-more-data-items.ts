import { Component, Input } from '@angular/core';
import { IonicStorageService } from '../../../serves/ionic-storage.service';
import { DetailMoreDataType } from '../../../interface/detail.interface';
import { EditPage } from '../../../pages/edit/edit';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'detail-more-data-items',
  templateUrl: 'detail-more-data-items.html'
})
export class DetailMoreDataItemsComponent {

  @Input() moduleName: string = '';

  @Input() moduleId: string = '';

  @Input() moreData: DetailMoreDataType[] = [];

  @Input() isEdit: boolean = true;

  public title: string = '';

  constructor(
    private _navCtrl: NavController,
    private _ionicStorageService: IonicStorageService,
  ) {
  }

  ngOnChanges() {
    if (Array.isArray(this.moreData)) {
      this.moreData.map(async (items) => {
        const key: string = `${this.moduleName}+${items.groupName}`;
        items.isOpen = await this._ionicStorageService.get(key);
        if (items.isOpen === null) {
          items.isOpen = true;
        }
        if (Array.isArray(items.itemData)) {
          /** 如果没有字段，分组不显示 */
          items.group_Display = items.itemData.length > 0 ? items.group_Display : false;
          // items.showGroup=items.itemData.length > 0 ? true : false;
          /** 如果字段都不显示，分组不显示 */
          const hidenItems = items.itemData.filter((v)=>(v.isHide || v.selector === 'hidden'));
          if(items.itemData.length === hidenItems.length){
            items.group_Display = false;
            // items.showGroup=false;
          }
        }

      });
    }
  }

  /** 推入编辑页 */
  public pushEditPage = (): void => {
    const id: string = this.moduleId;
    const moduleName: string = this.moduleName;
    this._navCtrl.push(EditPage, { moduleName, id });
  }

}
