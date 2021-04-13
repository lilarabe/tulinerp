import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-textarea',
  templateUrl: 'app-textarea.html'
})
export class AppTextareaComponent {
  /** placeholder */
  @Input() placeholder: string = '请填写';
  /** 传入显示数据 */
  @Input() value: string = '';
  /** 传入样式名称 */
  @Input() classNames: string = '';
  /** 输出数据 */
  @Output() valueChangeEvent = new EventEmitter();
  /** 输出获取焦点事件 */
  @Output() focusEvent = new EventEmitter();

  @ViewChild('textarea') textareaRef: ElementRef;

  constructor() {
    setTimeout(()=>{
      this.textareaRef.nativeElement.focus();
    },2000);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log(changes);
  // }

  @HostListener('keyup', ['$event.target.innerText'])
  onKeyUp(val: string) {
    /** 输出数据 */
    this.valueChangeEvent.emit(val);
  }


  public onFocus = ()=> {
    console.log('focus');
    this.focusEvent.emit();
  }

}