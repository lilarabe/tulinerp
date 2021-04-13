import { Component } from '@angular/core';
import { DetailRelevantModuleDataType } from '../../../interface/detail.interface';
import { NavController, NavParams } from 'ionic-angular';
import { DetailProvider } from '../../../providers/detail/detail';

@Component({
  selector: 'page-detail-list',
  templateUrl: 'detail-list.html',
})
export class DetailListPage {


  public data: any = {};
  /** 通知detail-list组件更新数据 */
  public alter: boolean = false;
  /**是否第一次进入 */
  public isFirst: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private detailProvider: DetailProvider,
  ) {
  }

  ngOnInit(): void {
    this.data = this.navParams.get("data");
  }

  ionViewCanEnter() {
    if (this.isFirst) {
      this.isFirst = false;
      return;
    }
    this.alter = true;
  }

  accomplish(e){
    console.log('list数据加载完成');
    this.alter = false;
  }
  /**
 * @description push 相关模块页面
 * @memberof DetailPage
 */
  public pushOtherPage = (relevantModuleData: DetailRelevantModuleDataType): void => {
    this.detailProvider.pushOtherPage(relevantModuleData);
  }

}
