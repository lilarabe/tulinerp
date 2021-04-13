import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InformDetailsPage } from '../inform/inform-details/inform-details';
import { AjaxService } from '../../serves/ajax.service';


// @IonicPage({
//   name:'inform',
//   segment:"inform"
// })
@Component({
  selector: 'page-inform',
  templateUrl: 'inform.html',
})
export class InformPage {

  public data:Array<any>=[];

  public moduleCategory: Array<any> = [];
  /** 搜索关键词 */
  public keyword: string = '';
  /** 搜索结果 */
  public searchResult: any[] = [];
  // 标题
  public title:String="全筑e家";

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private _ajax:AjaxService) {
  }

  //获取数据信息
  ionViewDidLoad() {
      this._ajax.loadData({
        title:"获取数据信息",
        method:"get",
        url:"assets/data/dai_demo.json",
        debug:true
      }).subscribe(res=>{
        this.data=res.payload;
      })
  }
  //跳转到详情页面
  public onDetail = (val:Array<any>): void => {
        this.navCtrl.push(InformDetailsPage,{
          data:val
        });
  }

  public searchClear = () => {
    this.keyword="";
  }
  public inputSearch = (e: string) => {
      //自动搜索
      console.log(e)
  }
  public searchInput = (e: string) => {
    //点击搜索
    console.log(e)
  }

    /** 扫描二维码 */
    public getQrCode = (qrCode: string) => {
      console.log(`扫描二维码结果:${qrCode}`);
    }
}