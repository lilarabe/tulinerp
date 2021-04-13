import { Component, ContentChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { StepComponent } from './step/step';


@Component({
  selector: 'steps',
  templateUrl: 'steps.html'
})
export class StepsComponent {
  /** 设置当前激活步骤 */
  @Input('active') public active: number = 0;
  @Output() public activeChange: EventEmitter<number> = new EventEmitter<number>();
  @Input('activeId') public activeId: string = '';
  @Output() public activeIdChange: EventEmitter<string> = new EventEmitter<string>();
  /** 子组件 step */
  @ContentChildren(StepComponent) public stepComponents: QueryList<StepComponent>;
  /** 子集个数 */
  @Input() public stepLength:number;
  
  constructor() {}

  ngOnChanges(): void {
    this.setStepStatus();
  }


  /** 设置 step子组件 的 status */
  public setStepStatus = (): void => {
    if(!this.stepComponents) return;
    this.active = this.active > this.stepComponents.length -1 ? this.stepComponents.length-1 : this.active;
    // this.stepComponents.forEach((step: StepComponent, idx) => {
    //   if (idx < +this.active) step.status = 'previous';
    //   if (idx == +this.active) step.status = 'current';
    //   if (idx > +this.active) step.status = 'next';
    // });
    this.stepComponents.forEach((step)=>{
      step.status = 'next';
    });
    for(let step of this.stepComponents.toArray()){
      if(step.activeId !== this.activeId){
        step.status = 'previous';
      }
      if(step.activeId === this.activeId){
        step.status = 'current';
        break;
      }
    }
  }

}
