import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChartProvider } from "../../../providers/chart/chart";

// @IonicPage({
//   name: 'chartDetail',
//   segment: 'chartDetail',
//   defaultHistory: ['chart']
// })
@Component({
  selector: 'page-chart-detail',
  templateUrl: 'chart-detail.html',
})
export class ChartDetailPage {

  @ViewChild('chart') chart;

  public chartOption = {
    title: {
      text: 'demo'
    },
    tooltip: {},
    legend: {
      data: ['销量']
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  public chartOptions: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chartProvider: ChartProvider,
  ) {

  }

  ionViewDidLoad() {
    this.getData();
  }


  private getData = (): void => {
    this.chartProvider.getChartDetailData(this.navParams.data.postData).subscribe(res => {
      if (Array.isArray(res.payload.chartData)) {
        res.payload.chartData.forEach(v => {
          this.selectChart(v);
        });
      }
    });
  }

  /**
   * @description 选择渲染报表类型
   * @private
   * @memberof ChartDetailPage
   */
  private selectChart = (data): void => {
    let option = {};
    switch (data.type) {
      case 'line':
        option = this.chartProvider.resetBarLineData(data);
        break;
      case 'bar':
        option = this.chartProvider.resetBarLineData(data);
        break;
      case 'pie':
        option = this.chartProvider.resetPieData(data);
        break;
      default:
        break;
    }
    this.chartOptions.push(option);
  }


}
