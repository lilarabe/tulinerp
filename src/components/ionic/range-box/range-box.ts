import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'range-box',
  templateUrl: 'range-box.html'
})
export class RangeBoxComponent {

  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 1;
  @Input() step: number = 1;

  @Output() valueChangeEvent: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  public valueChange = () => {
    this.valueChangeEvent.emit(this.value);
  }

}
