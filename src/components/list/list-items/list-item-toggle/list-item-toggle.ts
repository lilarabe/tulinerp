import { Component } from '@angular/core';
import { ListItemClass } from '../list-item';


@Component({
  selector: 'list-item-toggle',
  templateUrl: 'list-item-toggle.html'
})
export class ListItemToggleComponent extends ListItemClass {

  public type:boolean=false;
  constructor() { super(); 
  if(this.value || this.value=="true"){
    this.type=true;
  }else if(this.value=="false"){
    this.type=false;
  }
  }


}
