import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'chart',
  templateUrl: 'chart.html'
})
export class ChartComponent {

  @ViewChild('chart') public chart: ElementRef;

  @Input() public option: any = {};

  constructor() {
  }

  ngOnChanges() {
    this.render();
  }

  /**
   * @description 渲染报表
   * @private
   * @memberof ChartComponent
   */
  private render = (): void => {
    const myChart = echarts.init(this.chart.nativeElement);
    myChart.setOption(this.option);
  }

}
