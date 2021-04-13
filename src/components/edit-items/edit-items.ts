import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { ChildDelEventParams, ChildGroupDataType, EditChildTabType, EditDataType, GroupDataType } from "../../interface/edit.interface";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SheetlinkFetchData } from '../../interface/components/sheetlink.interface';




@Component({
  selector: 'edit-items',
  templateUrl: 'edit-items.html'
})
export class EditItemsComponent implements OnInit, OnChanges {

  /*主表表单数据*/
  @Input() public editGroupData: Array<GroupDataType> = [];
  /** 编辑数据 */
  @Input() public fieldArray: Array<EditDataType> = [];
  /** 响应式表单名称 */
  @Input() public inputFormGroup: FormGroup;
  /** 主表表单 */
  @Input() public mainForm: FormGroup;
  /** 模块名称 */
  @Input() public moduleName: string = "";
  /** 分组名称 */
  @Input() public groupName: string = "";
  /** 是否展开 */
  @Input() public expanded: boolean = true;
  /** 请求参数 */
  @Input() public requireData: any = {};
  /** 新增 or 编辑 edit or add */
  @Input() public action: string = '';
  /** 分组索引 */
  // @Input() public indexGroup: number = 0;
  /** 选中分组索引 */
  // @Input() public indexSelectedGroup: number = 0;
  /** 当前子表数据 */
  @Input() public childData: EditChildTabType;
  /** 当前单条子表数据 */
  @Input() public childItemData: ChildGroupDataType = null;
  /** 子表form */
  @Input() public childFormArray: FormArray;
  /** 子表 index */
  @Input() public childGroupIndex: number;

  @Input() public clearHidden:boolean=false;
  /** 子表 删除 */
  @Output() childDelEvent: EventEmitter<ChildDelEventParams> = new EventEmitter();
  /** 子表增加事件 */
  @Output() public sheetlinkChildAddEvent: EventEmitter<SheetlinkFetchData> = new EventEmitter();


  public form: FormGroup = this._fb.group({});

  constructor(
    private _fb: FormBuilder,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }


  /**
   * isRequired 是否必填
   */
  public isRequired(valids: string[]): boolean {
    let result: boolean = false;
    result = !!valids.find(v => v == 'required');
    return result;
  }

  /** 子表删除 */
  public onChildDell = async () => {
    this.childDelEvent.emit({ tableName: this.childData.moduleName, delIndex: this.childGroupIndex, });
  }
  /** sheetlink 子表增加事件 */
  public onSheetlinkChildAddEvent = (sheetlinkData: SheetlinkFetchData) => {
    this.sheetlinkChildAddEvent.emit(sheetlinkData);
  }

}


