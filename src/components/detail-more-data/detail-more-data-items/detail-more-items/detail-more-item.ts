import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DefaultMoreDataItemData, DetailItemDataTpye } from '../../../../interface/detail.interface';

@Component({
    selector: 'DetailMoreItemComponent',
    template: '',
})
export class DetailMoreItemComponent implements OnInit, OnChanges { 

    @Input() moreDataItemData: DetailItemDataTpye = DefaultMoreDataItemData;

    /** label 最大显示字数 */
    public labelMaxLen: number = 7;

    constructor(){}

    ngOnInit() {
    }
  
    ngOnChanges() {
    }


    
}