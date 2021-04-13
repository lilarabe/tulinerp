import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MsgService } from '../../serves/msg.service';


// @IonicPage()
@Component({
  selector: 'page-multilevel',
  templateUrl: 'multilevel.html',
})
export class MultilevelPage {

  /**value 值 */
  public selectData: Array<string> = [];

  /**数组数据 */
  public valueArray: Array<any> = [];

  /**搜索值 */
  public searchValue: string = '';
  /**导航栏展示数组 */
  public displayData: Array<any> = [];

  /**选中字段*/
  public realValueStr: string = '';

  /**展示的数组对象 */
  public showArray: Array<any> = [];

  /**真实值 */
  public realValue: Array<string> = [];

  /** 父级是否可选 */
  public canSelectParent:boolean=true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private _msg: MsgService,) {
  }

  ionViewDidLoad() {
    this.selectData = this.navParams.get('selectData') || [];
    if(this.selectData[0]===''){
      this.selectData=[];
    }
    this.valueArray = this.navParams.get('valueArray') || [];
    this.canSelectParent = !!this.navParams.get('canSelectParent');
    this.realValue = JSON.parse(JSON.stringify(this.selectData));
    this.setDisplayData();
    this.setRealString();
  }

  /**赋值 */
  setDisplayData(type: string = 'unfold') {
    this.displayData = [];
    let ArrayD = this.valueArray;
    if(this.selectData.length<1){
      this.showArray = ArrayD;
    }
    this.selectData.forEach((v, i) => {
      let nowData = ArrayD.find(c => c.value === v);
      if(!nowData){
        return
      }
      this.displayData.push({ label: nowData.label, value: nowData.value });
      if (this.selectData.length - 1 === i) {
        if (nowData.children && type === 'unfold') {
          this.showArray = nowData.children;
        } else {
          this.showArray = ArrayD;
        }
      }
      ArrayD = nowData.children;
    });
  }

  setRealString(){
    this.realValueStr = '';
    let ArrayD = this.valueArray;
    this.selectData.forEach((v, i) => {
      let nowData = ArrayD.find(c => c.value === v);
      if(!nowData){
        return;
      }
      this.realValueStr+=(nowData.label+"/");
      ArrayD = nowData.children;
    });
  }
  /** 取消 */
  public dismiss = (): void => {
    this.viewCtrl.dismiss({ selectData: [] });
  }

  /**点击确定 */
  public confirm = (): void => {
    if (this.realValue.length < 1) {
      this._msg.toast('未选择选项');
      return;
    }
    this.viewCtrl.dismiss({ selectData: [...this.realValue] });
  }

  /**删除搜索内容 */
  searchClear() {
    this.searchValue = '';
  }

  /**值发生改变 自动搜索 */
  inputSearch(value: string) {
    this.searchValue = value;
  }

  /**点击搜索按钮 */
  searchInput(value: string) {
    this.searchValue = value;
  }

  /**点击导航切换 */
  setLabel(v) {
    if (v === 0) {
      this.selectData = [];
      this.displayData = [];
      this.showArray = this.valueArray;
      return;
    }
    let i = this.selectData.findIndex(s => s === v.value);
    this.selectData.splice(+i + 1, this.selectData.length - (i + 1));
    this.setDisplayData();
  }

  /**展开 */
  doSelect(v) {
    this.selectData = v;
    this.setDisplayData();
  }
  /**选中 */
  doSelectAt(v) {
    this.selectData = v;
    this.setDisplayData('select');
    this.realValue = JSON.parse(JSON.stringify(this.selectData));
    this.setRealString();
  }
}
