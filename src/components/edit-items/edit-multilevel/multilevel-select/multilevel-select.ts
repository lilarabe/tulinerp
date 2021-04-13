import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'multilevel-select',
  templateUrl: 'multilevel-select.html'
})
/**
 * 没有任何页面或组件使用到此组件
 * 备注人：戴江凯
 */
export class MultilevelSelectComponent {

  @Input() public valueArray: Array<any> = [];
  @Input() public readonly: boolean = false;
  @Input() public disable: boolean = false;
  @Input() public selectData:Array<string> = [];
  @Input() public selectIndex: number = 0;

  @Output() uploadSelectData: EventEmitter<Array<string>> = new EventEmitter();

  public nowData:any={};

  constructor() {
   

  }
  ngOnInit(): void {
    this.nowData= this.valueArray.find(v=>v.value===this.selectData[this.selectIndex]);
  }

  onChange(e){
    this.nowData= this.valueArray.find(v=>v.value===e);
    this.selectData.splice(+this.selectIndex+1,this.selectData.length-(+this.selectIndex+1))
    this.uploadSelectData.emit(this.selectData);
  }

  informSuperior(e){
    this.selectData=e;
    this.uploadSelectData.emit(this.selectData);
  }

}
