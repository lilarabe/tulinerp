import { Injectable } from '@angular/core';
import { AjaxService, ResponseDataType } from "../../serves/ajax.service";
import { Observable } from 'rxjs';
import { ChartDetailType } from "../../interface/chart.interface";


@Injectable()
export class ChartProvider {

  constructor(private ajax: AjaxService) {
  }

  /**
   * @description 获取报表 列表 数据
   * @public
   * @memberof ChartPage
   */
  public getChartListData = (): Observable<any> => {
    return this.ajax.loadData({
      title: "获取报表 列表 数据",
      method: "get",
      //url: "assets/data/charts.data.json",
      uri: "list_echarts.php",
    });
  }

  /**
   * @description 获取报表 详情 数据
   * @public
   * @memberof ChartProvider
   */
  public getChartDetailData = (postData): Observable<ResponseDataType> => {
    return this.ajax.loadData({
      title: "获取报表 详情 数据",
      method: "post",
      uri: "Charts.php",
      data: postData,
    });
  }

  /**
   * @description 重置报表 bar, line 数据
   * @memberof ChartProvider
   */
  public resetBarLineData = (chartData: ChartDetailType): any => {
    const option: any = {
      title: {
        text: '',
        x: 'center'
      },
      xAxis: {
        data: []
      },
      yAxis: {
      },
      series: [{
        data: [],
        type: 'line', /** bar, line */
      }]
    };
    const names: Array<string> = [];
    const values: Array<any> = [];
    option.title.text = chartData.title;
    chartData.data.forEach(v => {
      names.push(v.name);
      values.push(v.value);
    });
    option.xAxis.data = names;
    option.series[0].data = values;
    option.series[0].type = chartData.type;
    return option;
  }

  /**
   * @description 重置报表 pie 数据
   * @memberof ChartProvider
   */
  public resetPieData = (chartData: ChartDetailType): any => {
    const option: any = {
      title: {
        text: '',
        x: 'center'
      },
      series: [{
        clickable: false,
        radius: '60%',
        center: ['50%', '50%'],
        data: [],
        type: 'pie',
      }]
    };

    option.title.text = chartData.title;
    option.series[0].data = chartData.data;

    return option;
  }


}
