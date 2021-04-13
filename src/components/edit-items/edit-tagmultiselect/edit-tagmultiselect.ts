import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { ToolsProvider } from "../../../serves/tools.service";
import { FormValidatorsService } from '../../../serves/form-validators.service';


@Component({
  selector: 'edit-tagmultiselect',
  templateUrl: 'edit-tagmultiselect.html'
})
export class EditTagmultiselectComponent extends EditItemComponent {

  /** 最大选择数 */
  @Input() public limit: number = 999;

  public selectData:Array<string> = [];

  constructor(
    private _tools: ToolsProvider,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.selectData = this.formControl.value ?  this.formControl.value.split(",") : [];
  }

  ngOnChanges(){
  }

  public doSelect = (selectedItem):void => {
    
    if (this._tools.isStringInArray(selectedItem.value, this.selectData)) {
      const index:number = this.selectData.indexOf(selectedItem.value);
      this.selectData.splice(index, 1);
    } else {
      if(this.selectData.length >= this.limit) return;
      this.selectData.push(selectedItem.value);
    }
    this.formControl.setValue(this.selectData.join(','));
  }


  /**
   * @description 是否被选中
   * @memberof EditTagmultiselectComponent
   */
  public isSelect = (selectedItem):boolean => {
    return this._tools.isStringInArray(selectedItem.value, this.selectData);
  }

}
