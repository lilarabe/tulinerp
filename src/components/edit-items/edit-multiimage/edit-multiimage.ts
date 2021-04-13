import { Component, Input } from '@angular/core';
import { EditItemComponent } from "../edit-item/edit-item";
import { FormValidatorsService } from '../../../serves/form-validators.service';
import { MsgService } from '../../../serves/msg.service';
import { UploadFileInfoType } from "../../../interface/file.interface";
// import { OpenBrowserProvider } from '../../../providers/open-browser/open-browser';
import { Platform } from 'ionic-angular';
import { TpProvider } from '../../../providers/tp/tp';

@Component({
  selector: 'edit-multiimage',
  templateUrl: 'edit-multiimage.html'
})
export class EditMultiimageComponent extends EditItemComponent {

  @Input() public fileMaxSize: number = 1000;

  @Input() public fileTypeNames: Array<string> = [];

  @Input('valueUrl') public valueUrl: Array<any> = [];

  public isCordova: boolean = this._platform.is("cordova");

  public isBrowser: boolean = !this._platform.is("cordova");

  public FileInfo: Array<any> = [];
  // public filePath: string = '';

  // public fileBase64: string = '';

  constructor(
    private _msg: MsgService,
    protected _platform: Platform,
    // private _openBrowserProvider: OpenBrowserProvider,
    protected validators: FormValidatorsService,
    private tpProvider:TpProvider,
  ) {
    super(validators);
  }

  ngOnInit() {
    this.init();
    if(this.valueUrl && this.valueUrl.length>0){
      this.FileInfo=this.valueUrl;
    }else{
      if(this.formControl.value.length>0){
        this.FileInfo=this.formControl.value;
      }
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
  public view = async (e:number) => {
    let array=[];
    this.FileInfo.forEach(v=>{
      array.push({src:v.filePath})
    })
    this.tpProvider.openPreviewImageModal(array,e)
    // this._openBrowserProvider.openBrowser(e.filePath);
  }

  public getNativeCameraData = (base64): void => {
    this.FileInfo.push({
      fileBase64:"",
      filePath:""
    })
    this.FileInfo[this.FileInfo.length-1].fileBase64=base64;
    this.FileInfo[this.FileInfo.length-1].filePath=base64;
    this.formControl.setValue(this.FileInfo);
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

  // public upFiles(FileInfo :Array<{ filePath: string, fileBase64: string }>){
  //   let files:Array<{base64: string }>;
  //   FileInfo.forEach(v => {
  //     files[files.length].base64=v.fileBase64;
  //   });
  //   return files;
  // }


}

