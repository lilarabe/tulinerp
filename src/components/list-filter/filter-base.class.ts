import { Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';



export class FilterBaseClass implements OnInit, OnChanges {

    /** formControl 名称 */
    @Input() public inputFormControlName: string = "";

    /** formGroup */
    @Input() public inputFormGroup: FormGroup;

    /** formControl */
    public formControl: FormControl;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this._creatFormControl();
    }



    /**
     * @description 创建 FormControl
     * @protected
     * @memberof FilterBaseClass
     */
    protected _creatFormControl = (): void => {
        this.formControl = this.inputFormGroup.get(this.inputFormControlName) as FormControl;
    }

}