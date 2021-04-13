import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { MsgService } from '../../../serves/msg.service';
import { UploadFileInfoType } from "../../../interface/file.interface";
import { OpenBrowserProvider } from '../../../providers/open-browser/open-browser';


@Component({
  selector: 'edit-multifile',
  templateUrl: 'edit-multifile.html'
})
export class EditMultifileComponent extends EditItemComponent {

  @Input() public fileMaxSize: number = 1000;

  @Input() public fileTypeNames: Array<string> = [];

  public FileInfo: Array<any> = [];
  // public filePath: string = '';

  // public fileBase64: string = '';

  constructor(
    private _msg: MsgService,
    private _openBrowserProvider: OpenBrowserProvider,
    protected validators: FormValidatorsService,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    if(this.formControl.value.length>0){
      this.FileInfo=this.formControl.value;
    }
    
  }

  ngOnChanges() {
  }


  /** 删除 */
  public del = (e): void => {
    const confirm = this._msg.confirm('您确定要删除吗?');
    confirm.onDidDismiss(res => {
      if (res) {
        this.FileInfo.splice(e,1);
        this.formControl.setValue(this.FileInfo);
      }
    });
  }

  /** 预览 */
  public view = async (e) => {
    if(e.suffixName){
      return;
    }
    if(e.filePath){
      this._openBrowserProvider.openBrowser(e.filePath);
    }
  }

  /** 获取上传文件信息 */
  public getUploadFileInfo = (fileInfo: Array<UploadFileInfoType>): void => {
    fileInfo.forEach((v,i) => {
      this.FileInfo.push({
        fileBase64:"",
        filePath:"",
        fileName: "",
        fileSize: 0,
        suffixName:""
      })
      this.FileInfo[this.FileInfo.length-1].fileBase64=v.base64;
      this.FileInfo[this.FileInfo.length-1].filePath=v.filePath;
      this.FileInfo[this.FileInfo.length-1].fileName=v.fileName;
      this.FileInfo[this.FileInfo.length-1].fileSize=v.size;
      this.FileInfo[this.FileInfo.length-1].suffixName=v.suffixName;
    });
    this.formControl.setValue(this.FileInfo);
    this.formControl.markAsDirty();
  }


}

