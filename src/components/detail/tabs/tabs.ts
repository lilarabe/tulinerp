import { Component, Input, ContentChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { TabComponent } from './tab/tab';


@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html',
  host: {
    'class': 'tl-tabs'
  }
})
export class TabsComponent {
  /** 激活的索引 */
  @Input('activeIndex') private _activeIndex: number = 0;
  public get activeIndex(): number { return this._activeIndex; }
  public set activeIndex(v: number) { this._activeIndex = v; }
  @Output() public activeIndexChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() labelShow:boolean=true;


  /** 子组件 tab */
  @ContentChildren(TabComponent) public tabComponents: QueryList<TabComponent>;

  constructor(
  ) { }

  ngOnChanges(): void {
    this.setChildrenActive();
  }

  public labelClick = (idx:number) => {
    this.activeIndex = idx;
    this.activeIndexChange.emit(this.activeIndex);
    this.setChildrenActive();
  }

  public setChildrenActive = () => {
    if(!this.tabComponents) return;
    this.tabComponents.forEach((tab: TabComponent, idx) => {
      tab.active = this.activeIndex === idx;
    });
  }



}
