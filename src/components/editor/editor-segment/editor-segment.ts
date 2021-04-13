import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'editor-segment',
  templateUrl: 'editor-segment.html'
})
export class EditorSegmentComponent {
  /** 当前激活的索引 */
  @Input() segmentActiveIndex: number = 0;
  @Output() segmentActiveIndexChange: EventEmitter<number> = new EventEmitter();
  /** 标签 */
  @Input() labels: string[] = [];

  constructor() {
  }

  /** 激活标签 */
  public activeLabel = (idx: number) => {
    this.segmentActiveIndex = idx;
    this.segmentActiveIndexChange.emit(this.segmentActiveIndex);
  }
}
