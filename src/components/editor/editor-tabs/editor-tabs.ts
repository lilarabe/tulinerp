import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'editor-tabs',
  templateUrl: 'editor-tabs.html'
})
export class EditorTabsComponent {
  /** 当前激活的索引 */
  @Input() activeIndex: number = 0;
  @Output() activeIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() activeLabelChange: EventEmitter<EditorTabsLabel> = new EventEmitter();
  @Input() activeId: string = '';
  @Output() activeIdChange: EventEmitter<string> = new EventEmitter();
  /** 标签 */
  @Input() labels: EditorTabsLabel[] = [];

  constructor() { }

  /** 激活标签 */
  public activeLabel = (label: EditorTabsLabel, idx: number) => {
    this.activeIndex = idx;
    this.activeIndexChange.emit(this.activeIndex);
    this.activeLabelChange.emit(label);
    this.activeIdChange.emit(label.id);
  }

}

export interface EditorTabsLabel {
  label: string,
  id: string,
}