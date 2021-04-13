import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Events } from 'ionic-angular';


@Component({
  selector: 'edit-public-lable',
  templateUrl: 'edit-public-lable.html'
})
export class EditPublicLableComponent {

  @Input() public inputFormControlName: string = "";

  @Input() public placeholder: string = '';

  @Input() public valids: Array<string> = [];

  @Input() public readonly: boolean = false;

  @ViewChild('title') titleRef: ElementRef;

  /** 记录固定的错误 map */
  public errorMap = new Map<string, any>();

  /** 设置颜色事件 */
  public setColorEvent: string = '';

  /** 清除颜色事件 */
  public clearColorEvent: string = '';

  constructor(
    private _events: Events,
  ) {
  }

  ngOnInit() {
    this.setColorEvent = `setColor-${this.inputFormControlName}`;
    this.clearColorEvent = `clearColor-${this.inputFormControlName}`;
    this._events.subscribe(this.setColorEvent, (res)=>{
      this.titleRef.nativeElement.style.color = res.color;
    });
    this._events.subscribe(this.clearColorEvent, ()=>{
      this.titleRef.nativeElement.style.color = ``;
    });
  }

  ngOnChanges() {
    this._setErrorMap();
  }

  ngOnDestroy(): void {
    this._events.unsubscribe(this.setColorEvent);
    this._events.unsubscribe(this.clearColorEvent);
  }

  /** 设置错误 map */
  private _setErrorMap = (): void => {
    this.errorMap.clear();
    this.valids.forEach((valid: string) => {
      this.errorMap.set(valid, valid);
    });
  }

}
