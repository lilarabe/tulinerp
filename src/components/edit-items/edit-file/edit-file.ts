import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { MsgService } from '../../../serves/msg.service';
import { UploadFileInfoType } from "../../../interface/file.interface";
import { OpenBrowserProvider } from '../../../providers/open-browser/open-browser';


@Component({
  selector: 'edit-file',
  templateUrl: 'edit-file.html'
})
export class EditFileComponent extends EditItemComponent {

  @Input() public fileMaxSize: number = 1000;

  @Input() public fileTypeNames: Array<string> = [];

  public filePath: string = '';

  public fileBase64: string = '';

  constructor(
    private _msg: MsgService,
    private _openBrowserProvider: OpenBrowserProvider,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    this.filePath = this.formControl.value;
  }

  ngOnChanges() {
  }


  /** 删除 */
  public del = (): void => {
    const confirm = this._msg.confirm('您确定要删除吗?');
    confirm.onDidDismiss(res => {
      if (res) {
        this.filePath = '';
        this.fileBase64 = '';
        this.formControl.setValue("");
      }
    });
  }

  /** 预览 */
  public view = async () => {
    if(this.filePath){
      this._openBrowserProvider.openBrowser(this.filePath);
    }
  }

  /** 获取上传文件信息 */
  public getUploadFileInfo = (fileInfo: UploadFileInfoType): void => {
    this.fileBase64 = fileInfo.base64;
    this.filePath = fileInfo.filePath;
    this.formControl.setValue(this.fileBase64);
    this.formControl.markAsDirty();
  }


}
