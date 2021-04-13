import { Component, ElementRef, ViewChild, Input, forwardRef, Inject } from '@angular/core';
import { StepsComponent } from '../steps';


@Component({
  selector: 'step',
  templateUrl: 'step.html',
  host: {
    '(click)': 'onStepClick()',
  },
})
export class StepComponent {

  /** 线 */
  @ViewChild('line') public lineRef: ElementRef;
  /** 标题 */
  @Input('title') public title: string = '';
  /** 隐藏 */
  @Input('isHidden') public isHidden: boolean = false;
  /** 索引 */
  @Input()
  public get index(): number { return this._index }
  public set index(idx: number) { this._index = +idx }
  private _index: number = 0;

  /** 状态  */
  @Input()
  public get status(): string { return this._status }
  public set status(v: string) { this._status = v }
  private _status: 'previous' | 'current' | 'next' | string = 'next';

  /** id  */
  @Input() public activeId: string = '';


  constructor(
    @Inject(forwardRef(() => StepsComponent)) private _parent: StepsComponent,
  ) { }


  ngOnChanges(): void {
    setTimeout(() => {
      this._parent.setStepStatus();
    });
  }

  /** 组件点击 */
  public onStepClick = (): void => {
    if (this.status === 'previous') {
      this._parent.activeIdChange.emit(this.activeId);
      this._parent.activeChange.emit(this.index);
    }
  }

}
