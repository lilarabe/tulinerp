import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Injectable()
export class DataInformService {

    //判断是否是从审批点击同意进入编辑页的，
    private _isApprove: boolean = false;

    private _isApproveSource = new Subject<boolean>();

    public isApprove$ = this._isApproveSource.asObservable();

    public _isGoAdd:boolean=false;
    public _isGoDetail:boolean=false;

    /**仅限approval-log使用 */
    public isHaveA:boolean=false;

    public isEditSave:boolean=false;

    public init = () => {
        this._isApproveSource = new Subject<boolean>();
        this.isApprove$ = this._isApproveSource.asObservable();
    }

    public destroy = () => {
        this._isApproveSource.unsubscribe();
    }

    getIsApprove(): boolean {
        return this._isApprove;
    }
    setIsApprove(e: boolean) {
        this._isApprove = e;
    }

    setIsApproveTrue(){
        this._isApproveSource.next(true);
    }

    setIsApproveFalse(){
        this._isApproveSource.next(false);
    }

    setEditSave(e: boolean){
        this.isEditSave=e;
    }

    getEditSave():boolean{
        return this.isEditSave;
    }
}