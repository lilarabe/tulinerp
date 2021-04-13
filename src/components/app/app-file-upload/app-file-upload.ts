import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUpLoaderService } from "../../../serves/file-up-loader.service";
import { ToolsProvider } from "../../../serves/tools.service";
import { MsgService } from "../../../serves/msg.service";
import { UploadFileInfoType } from "../../../interface/file.interface";



@Component({
  selector: 'app-file-upload',
  templateUrl: 'app-file-upload.html'
})
export class AppFileUploadComponent {

  /**
   * 如许上传文件类型名称:["jpg","png","git"]
   */
  @Input() fileTypeNames: Array<string> = [];
  /** 如许上传文件大小 单位：M */
  @Input() fileMaxSize: number = 1000;
  /** 输出文件信息 */
  @Output() uploadFileInfoEvent: EventEmitter<UploadFileInfoType> = new EventEmitter();

  /** 上传文件信息 */
  private uploadFileInfo: UploadFileInfoType = {
    fileName: "",
    fileSize: 0,
    filePath: "",
    fileType: "",
    base64: "",
    suffixName:"",
    size:0,
  };

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
    const loader = this._msg.loading('数据处理中...');
    const files: Array<File> = event.target.files;
    if (files.length > 0) {
      loader.present(); 
      this.uploadFileInfo.fileName = files[0].name;
      this.uploadFileInfo.fileSize = this._tools.changeFileSize(files[0].size);
      this.uploadFileInfo.size = files[0].size;
      this.uploadFileInfo.fileType = files[0].type;
      this.uploadFileInfo.filePath = this._tools.fileToBlobUrl(files[0]);
      /** 文件后缀名 */
      this.uploadFileInfo.suffixName= this._tools.getFileSuffixName(files[0].name);
      /** 文件名是否OK */
      let isSuffixOk: boolean = true;
      if(this.fileTypeNames.length > 0){
        isSuffixOk = this._tools.isStringInArray(this.uploadFileInfo.suffixName, this.fileTypeNames);
      }

      if(!isSuffixOk){
        this._msg.toast(`请上传${this.fileTypeNames.join(',')}文件`);
      } else if (this.uploadFileInfo.fileSize >= this.fileMaxSize){
        this._msg.toast(`上传文件不可大于${this.fileMaxSize}M`);
      } else {
        const base64: string = await this._fileUpLoaderService.getBase64Code(files[0]);
        this.uploadFileInfo.base64 = base64;
        this.uploadFileInfoEvent.emit(this.uploadFileInfo);
      }
      loader.dismiss();
    }

  }

}
