import { Component, Input } from '@angular/core';
import { EditDataType } from '../../../../interface/edit.interface';


@Component({
  selector: 'edit-public-state',
  templateUrl: 'edit-public-state.html'
})
export class EditPublicStateComponent {
  
  /** 字段数据 */
  @Input() public fieldData: EditDataType;

  constructor() {}

}
