import { Pipe, PipeTransform } from '@angular/core';
import { GroupDataType } from '../../interface/edit.interface';

/** 过滤没有必填数据组 */
@Pipe({
  name: 'editPageGroup',
})
export class EditPageGroupPipe implements PipeTransform {
  transform(editGroupData: GroupDataType[]): GroupDataType[] {
    editGroupData = editGroupData.filter((group) => {
      let hasRequired: boolean = false;
      group.fieldArray.forEach((field) => {
        if(field.valids.find(valid => valid === 'required')) hasRequired = true;
      });
      return hasRequired;
    });
    return editGroupData;
  }
}
