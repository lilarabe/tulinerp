import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TpProvider } from '../../providers/tp/tp';
import { ChartListType } from "../../interface/chart.interface";
import { ChartProvider } from "../../providers/chart/chart";
import { ChartDetailPage } from "./chart-detail/chart-detail";




// @IonicPage({
//   name: 'chart',
//   segment: 'chart'
// })
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {

  /** 报表数据 */
  public chartList: Array<ChartListType> = [];
  /** 报表详情页面 */
  public chartDetailPage = ChartDetailPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public tp: TpProvider,
    private chartProvider: ChartProvider) {
  }

  ionViewDidLoad() {
    this.chartProvider.getChartListData().subscribe((res) => {
      this.chartList = res.payload.chartList;
    });
  }



}
