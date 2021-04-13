import { Component, Input, Inject, forwardRef, ElementRef } from '@angular/core';
import { TabsComponent } from '../tabs';


@Component({
  selector: 'tab',
  templateUrl: 'tab.html',
  host:{
    'class':'tl-tab',
  }
})
export class TabComponent {

  @Input('label') label: string = '';
  public active: boolean = false;

  /** 标记红点 */
  @Input() isMark: boolean = false;

  constructor(
    @Inject(forwardRef(() => TabsComponent)) private _parent: TabsComponent,
    public el: ElementRef,
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    setTimeout(()=>{
      this._parent.setChildrenActive();
    });
  }

  ngOnChanges(): void {}

}
