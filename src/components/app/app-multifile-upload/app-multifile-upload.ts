import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUpLoaderService } from "../../../serves/file-up-loader.service";
import { ToolsProvider } from "../../../serves/tools.service";
import { MsgService } from "../../../serves/msg.service";
import { UploadFileInfoType } from "../../../interface/file.interface";


@Component({
  selector: 'app-multifile-upload',
  templateUrl: 'app-multifile-upload.html'
})
export class AppMultifileUploadComponent {

  /**
   * 如许上传文件类型名称:["jpg","png","git"]
   */
  @Input() fileTypeNames: Array<string> = [];
  /** 如许上传文件大小 单位：M */
  @Input() fileMaxSize: number = 1000;
  /** 输出文件信息 */
  @Output() uploadFileInfoEvent: EventEmitter<Array<UploadFileInfoType>> = new EventEmitter();

  /** 上传文件信息 */
  private uploadFileInfo: Array<UploadFileInfoType> = [];

  constructor(
    private _fileUpLoaderService: FileUpLoaderService,
    private _tools: ToolsProvider,
    private _msg: MsgService,
  ) {
  }


  /**
   * @description 获取文件的 base64
   * @memberof AppFileUploadComponent
   */
  public getFileInfo = async (event) => {
    this.uploadFileInfo=[];
    let state:boolean=true;
    const loader = this._msg.loading('数据处理中...');
    const files: Array<File> = event.target.files;
    if (files.length > 0) {
      loader.present(); 
        for(let i:number=0;i<files.length;i++){
        this.uploadFileInfo.push({
          fileName: "",
          fileSize: 0,
          filePath: "",
          fileType: "",
          base64: "",
          suffixName:"",
          size:0,
        })
        this.uploadFileInfo[i].fileName = files[i].name;
        this.uploadFileInfo[i].fileSize = this._tools.changeFileSize(files[i].size,'m');
        this.uploadFileInfo[i].fileType = files[i].type;
        this.uploadFileInfo[i].filePath = this._tools.fileToBlobUrl(files[i]);
        this.uploadFileInfo[i].size = files[i].size;
        /** 文件后缀名 */
        this.uploadFileInfo[i].suffixName = this._tools.getFileSuffixName(files[i].name);
        /** 文件名是否OK */
        let isSuffixOk: boolean = true;
        if(this.fileTypeNames.length > 0){
          isSuffixOk = this._tools.isStringInArray(this.uploadFileInfo[i].suffixName, this.fileTypeNames);
        }
  
        if(!isSuffixOk){
          this._msg.toast(`请上传${this.fileTypeNames.join(',')}文件`);
          state=false;
        } else if (this.uploadFileInfo[i].fileSize >= this.fileMaxSize){
          this._msg.toast(`上传文件不可大于${this.fileMaxSize}M`);
          state=false;
        } else {
          const base64: string = await this._fileUpLoaderService.getBase64Code(files[i]);
          this.uploadFileInfo[i].base64 = base64;
          
        }
      }
      if(state){
        this.uploadFileInfoEvent.emit(this.uploadFileInfo);
      }
      loader.dismiss();
    }

  }

}
