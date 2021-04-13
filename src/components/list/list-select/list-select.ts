import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'list-select',
  templateUrl: 'list-select.html'
})
export class ListSelectComponent {

 
  @Input() public selectData:Array<string> = [];

  /**数组数据 */
  @Input() public valueArray: Array<any> = [];

  @Input() canSelectParent:boolean = true;

  @Output() uploadSelectData: EventEmitter<Array<string>> = new EventEmitter();

  @Output() uploadSelectAtData: EventEmitter<Array<string>> = new EventEmitter();
  @Input() public thisData:string = '';

  constructor() {
  }

  public checked(v){
    if(!v.children){
      this.thisData=v.value;
      this.change(v);
      return;
    }
    if(this.selectData[this.selectData.length-1] && this.selectData[this.selectData.length-1].length===v.value.length){
       this.selectData.pop();
    }
    this.selectData.push(v.value);
    this.uploadSelectData.emit(this.selectData);
  }

  public change(v){
    if(this.selectData[this.selectData.length-1] && this.selectData[this.selectData.length-1].length===v.value.length){
      this.selectData.pop();
   }
    this.selectData.push(v.value);
    this.uploadSelectAtData.emit(this.selectData);
  }

}
