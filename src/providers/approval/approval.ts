import { Injectable } from '@angular/core';
import { DetailItemDataTpye, DetailMoreDataType } from 'interface/detail.interface';
import { AlertController, Alert } from 'ionic-angular';
import { ToolsProvider } from '../../serves/tools.service';
import { ApprovalerDataType, EditFieldsType } from '../../interface/approval.interface';
import { MsgService } from '../../serves/msg.service';


@Injectable()
export class ApprovalProvider {

  constructor(
    private _alertCtrl: AlertController,
    private _tools: ToolsProvider,
    private _msg: MsgService,
  ) {
  }

  /**
   * @description 打开下一审批节点选择框
   * @param type 同意还是驳回 yes or no
   * @memberof ApprovalProvider
   */
  public selectApprovaler = (uers: Array<ApprovalerDataType> = [], type: 'yes' | 'no', title: string = `下一审批节点`, subTitle: string = `选择审批人`): Promise<string> => {
    return new Promise((resolve, reject) => {
      if(!Array.isArray(uers) || uers.length === 0){
        this._msg.toast(`审批人列表错误`);
        resolve('');
      }
      if (uers.length === 1) {
        resolve(uers[0].value);
      } else {
        const alert: Alert = this._alertCtrl.create();
        alert.setTitle(title);
        alert.setSubTitle(subTitle);

        alert.addButton({
          text: '取消',
          role: 'cancel',
          handler: () => {
            resolve('');
          },
        });
        const okBtnText: string = type === 'no' ? '确定' : '提交审批';
        alert.addButton({
          text: okBtnText,
          handler: (userId: string) => {
            resolve(userId);
          },
        });

        uers.forEach((approvaler, k) => {
          const checked: boolean = k === 0 ? true : false;
          alert.addInput({
            type: 'radio',
            /** 如果有name属性 显示name  */
            label: approvaler.name || approvaler.label,
            value: approvaler.value,
            checked: checked,
          });
        });

        alert.present();
      }

    });
  }


  /** 验证主表字段是否必填 */
  public testRequiredFields = (baseOpenFiled: Array<EditFieldsType>, moreData: Array<DetailMoreDataType>): { result: boolean, fieldName: String } => {
    let result = { result: true, fieldName: '' };
    if (Array.isArray(baseOpenFiled)) {
      for(let i=0 ; i < baseOpenFiled.length ; i++){
        const v = baseOpenFiled[i];
        const item = this._getMasterItemData(v.key, moreData);
        if (item.value === '' && item.selector !== 'hidden') {
          result.result = false;
          result.fieldName = item.name;
          return result;
        }
      }
    }
    return result;
  }

  
  /** 验证主表字段是否必填 */
  public testRequiredNotFields = (baseOpenFiled: Array<EditFieldsType>, moreData: Array<DetailMoreDataType>): { result: boolean, fieldName: Array<String>} => {
    let result = { result: true, fieldName:[] };
    if (Array.isArray(baseOpenFiled)) {
      for(let i=0 ; i < baseOpenFiled.length ; i++){
        const v = baseOpenFiled[i];
        const item = this._getMasterItemData(v.key, moreData);
        if (item.value === '' && item.selector !== 'hidden') {
          result.result = false;
          result.fieldName.push(item.key);
        }
      }
    }
    return result;
  }



  /** 通过key获取主表显示数据 */
  private _getMasterItemData = (key: string, moreData: Array<DetailMoreDataType>): DetailItemDataTpye => {
    let result: DetailItemDataTpye = { name: '', value: '', selector: '', key: '' };
    let allData: Array<DetailItemDataTpye> = [];
    /** 将 moreData 有效数据 合并到 allData */
    moreData.forEach(v => { allData = [...allData, ...v.itemData.filter(v => v.key)]; });
    const itemsData: DetailItemDataTpye[] = allData.filter((v) => v.key === key);
    if (itemsData.length >= 1) {
      result = itemsData[0];
    } else if (itemsData.length === 0) {
      this._tools.print(`算公式错误:无法在主表数据中找到key: ${key}`, 'r');
    }
    if (this._tools.isNumberString(result.realvalue)) {
      this._tools.print(`算公式警告:主表字段[${result.name}](${result.key})不是有效数字${result.realvalue}`, 'y');
      result.realvalue = (result.realvalue + '').replace(/\,/g, '');
    }
    return result;
  }

}
