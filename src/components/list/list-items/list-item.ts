import { Input } from '@angular/core';


export class ListItemClass {

    /** 标题 */
    @Input() public name: string = "";
    /** 值 */
    @Input() public value: any = "";
    /** 是否可以操作 */
    @Input() public operate: boolean = true;
    /** value 样式 */
    @Input() public setStyle: any = {};

    public labelMaxLen : number = 7;

    constructor() { }

}