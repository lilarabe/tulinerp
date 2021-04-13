import { Injectable } from '@angular/core';
import { File, Entry, DirectoryEntry } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { MsgService } from '../msg.service';
import { ToolsProvider } from '../tools.service';

@Injectable()
export class FileProvider {

  /**
   * 是否debug?
   */
  private isDebug: boolean = false;
  /**
   * 临时文件夹名称
   */
  private tempDir: string = 'temp';
  /**
   * 系统目录
   */
  private directory: string = this.file.cacheDirectory;
  /**
   * 是否在APP中
   */
  private isApp: boolean = this.platform.is('cordova');


  constructor(
    private platform: Platform,
    private file: File,
    private _msg: MsgService,
    private _tools: ToolsProvider,
  ) {
    if (this.platform.is('android')) {
      this.directory = this.file.cacheDirectory;
    } else if (this.platform.is('ios')) {
      this.directory = this.file.cacheDirectory;
    }
    if (this.isApp) {
      this.createTempDir();
    }
  }

  /**
   * @description 创建临时文件夹
   * @private
   * @memberof FileProvider
   */
  public createTempDir = (dirName: string = this.tempDir): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (this.isApp) {
          this.directory = this.directory || this.file.cacheDirectory;
          const res: any = `createDir: directory:${this.directory}, dirName:${dirName}`;
          this.showMsg(res);
          this.file.checkDir(this.directory, dirName).then(
            (res) => {
              if (res) {
                const res: any = `已经存在:${dirName}，无法再次创建`;
                this.showMsg(res);
                resolve(`${this.directory}${dirName}/`);
              } else {
                this.file.createDir(this.directory, dirName, false).then(
                  () => {
                    const msg: any = `创建1:${dirName}成功`;
                    this.showMsg(msg);
                    resolve(`${this.directory}${dirName}/`);
                  },
                  () => {
                    const msg: any = `创建1:${dirName}失败`;
                    this.showMsg(msg);
                    reject(msg);
                  }
                );
              }
            },
            (err) => {
              this.file.createDir(this.directory, dirName, false).then(
                () => {
                  const msg: any = `创建:2${dirName}成功`;
                  this.showMsg(msg);
                  resolve(`${this.directory}${dirName}/`);
                },
                () => {
                  const msg: any = `创建2:${dirName}失败`;
                  this._msg.alert(msg);
                  this.showMsg(msg);
                  reject(msg);
                }
              );
            }
          );
        } else {
          const msg: any = `不在App中，无法创建:${dirName}`;
          this.showMsg(msg);
          reject(msg);
        }
      });
    });
  }

  /**
   * @description 获取文件夹的文件
   * @memberof FileProvider
   */
  public listFiles = (path: string, dirName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (this.isApp) {
        this.file.listDir(path, dirName).then(
          (entry: Entry[]) => {
            const msg: any = `listFiles:${JSON.stringify(entry)}`;
            this.showMsg(msg);
            resolve();
          },
          (err) => {
            const msg: any = `listFiles listDir error:${JSON.stringify(err)}`;
            this.showMsg(msg);
            reject(msg);
          }
        );
      } else {
        const msg: any = `listFiles error 不在App中，无法获取文件`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }



  /**
   * @description 列出文件夹内容
   * @memberof FileProvider
   */
  public listAll = (): Promise<any> => {
    const paths: Array<string> = [];
    paths.push(this.file.dataDirectory);
    paths.push(this.file.cacheDirectory);
    return new Promise((resovle, reject) => {
      if (this.isApp) {
        paths.forEach((path: string) => {
          this.showMsg(`${path}`);
          this.file.listDir(path, "").then((entrys: Entry[]) => {
            entrys.forEach((entry: Entry) => {
              console.log(entry);
              this.showMsg(JSON.stringify(entry));
            });

          });

        });
      } else {
        const msg: any = `列出文件夹内容:不在APP中无法列出文件夹内容`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }

  /**
   * @description 把文件拷贝到临时目录
   * @memberof FileProvider
   */
  public copyFileToTemp = (path: string, fileName: string, newFileName: string): Promise<any> => {
    this.directory = this.directory || this.file.cacheDirectory;
    const newPath: string = this.directory + this.tempDir + '/';
    return new Promise((resolve, reject) => {
      this.showMsg(`copyFileToTemp-path:${path},fileName:${fileName},newPath:${newPath},newFileName:${newFileName}`);
      this.file.copyFile(path, fileName, newPath, newFileName).then(
        () => {
          const res: any = `拷贝文件到临时目录成功：${newPath + newFileName}`;
          this.showMsg(res);
          resolve({ path: newPath, name: newFileName });
        },
        () => {
          const res: any = `拷贝文件到临时目录报错：${newPath + newFileName}`;
          this._msg.alert(`拷贝文件到临时目录报错：path:${path},fileName:${fileName},newPath:${newPath},newFileName:${newFileName}`);
          this.showMsg(res);
          reject(res);
        }
      );
    });
  }

  /**
 * @description 验证文件是否存在
 * @private
 * @memberof VideoProvider
 */
  public checkFile = (path, name): Promise<any> => {
    return new Promise((resovle, reject) => {
      this.file.checkFile(path, name).then(
        (bool) => {
          if (bool) {
            this.showMsg(`checkFile成功：${path + name}`);
            // this._msg.alert(`文件验证成功：${path + name}`);
            resovle({ path: path, name: name });
          } else {
            this.showMsg(`checkFile报错：${path + name}`);
            this._msg.alert(`文件验证失败：${path + name}`);
            reject();
          }
        },
        (error) => {
          this.showMsg(`checkFile报错-无法获取文件：${path + name}`);
          this.showMsg(`error：${JSON.stringify(error)}`);
          this._msg.alert(`文件验证失败：${path + name}`);
          reject();
        }
      );
    });
  }



  /**
   * @description 扫描文件
   * @memberof FileProvider
   */
  public scanFiles = (): Promise<any> => {
    return new Promise((resovle, reject) => {
      if (this.isApp) {

      } else {
        const msg: any = `扫描文件报错:不在APP中无法扫描文件`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }

  /**
   * @description 清空临时文件夹
   * @memberof FileProvider
   */
  public clearTempDir = (): Promise<any> => {
    return new Promise((resovle, reject) => {
      if (this.isApp) {
        this.directory = this.directory || this.file.cacheDirectory;
        this.file.listDir(this.directory, this.tempDir).then(
          (entry: Entry[]) => {
            const path: string = this.directory + this.tempDir;
            let count: number = entry.length;
            if (entry.length > 0) {
              entry.forEach(v => {
                if (v.isFile) {
                  this.file.removeFile(path, v.name).then(
                    () => {
                      count--;
                      if (count <= 0) {
                        const msg: any = `已清空：${path}`;
                        this.showMsg(msg);
                        resovle();
                      }
                    }
                  );
                }
              });
            } else if (entry.length === 0) {
              const msg: any = `${path}无文件`;
              this.showMsg(msg);
              resovle();
            }
          },
          (err) => {
            const msg: any = `clearTempDir listDir error:${JSON.stringify(err)}`;
            this.showMsg(msg);
            reject();
          }
        );
      } else {
        const msg: any = `clearTempDir报错:不在APP中无法`;
        this.showMsg(msg);
        reject(msg);
      }

    });
  }

  /**
   * @description 删除某个文件
   * @memberof FileProvider
   */
  public delFile = (path: string, fileName: string): Promise<any> => {
    return new Promise((resovle, reject) => {
      if (this.isApp) {
        this.file.removeFile(path, `${fileName}`).then(
          () => {
            const msg: any = `delFile 删除成功：${path + fileName}`;
            this.showMsg(msg);
            resovle(msg);
          },
          () => {
            const msg: any = `delFile 删除失败：${path + fileName}`;
            this.showMsg(msg);
            reject(msg);
          }
        );
      } else {
        const msg: any = `delFile报错:不在APP中无法删除`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }



  /**
   * @description 强制清除文件
   * @memberof FileProvider
   */
  public clearFiles = (): Promise<any> => {
    return new Promise((resovle, reject) => {
      if (this.isApp) {

      } else {
        const msg: any = `强制清除文件报错:不在APP中无法清除文件`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }

  public getLocalFileUrl = (fileUrl: string): Promise<any> => {
    return new Promise((resovle, reject) => {
      if (this.isApp) {
        this.file.resolveLocalFilesystemUrl(fileUrl).then(
          (entry: Entry) => {
            const msg: any = `getLocalFileUrl成功:${JSON.stringify(entry)}`;
            this.showMsg(msg);
            resovle();
          },
          (err) => {
            const msg: any = `getLocalFileUrl报错:${JSON.stringify(err)}`;
            this.showMsg(msg);
            reject(msg);
          }
        );
      } else {
        const msg: any = `getLocalFileUrl报错:不在APP中无法获取文件的url`;
        this.showMsg(msg);
        reject(msg);
      }
    });
  }

  /**
   * @description 获取文件的base64
   * @memberof FileProvider
   */
  public getBase64 = async (path: string, file: string): Promise<string> => {
    try {
      const base64: string = await this.file.readAsDataURL(path, file);
      return base64;
    } catch (err) {
      const msg: any = `getBase64 error: ${JSON.stringify(JSON.stringify(err))}`;
      this.showMsg(msg);
      this._msg.alert(`获取文件base64错误:path:${path},name:${file}`);
      return ``;
    }
  }

  /** 根据文件路径，获取文件bans64 */
  public getBase64ByPath = async (filePath: string): Promise<string> => {
    const path: string = this._tools.getFilePathAndName(filePath).filePath;
    const name: string = this._tools.getFilePathAndName(filePath).fileName;
    /** 文件是否存在 */
    const hasFile = await this.checkFile(path,name);
    let base64: string = '';
    if(hasFile){
      base64 = await this.getBase64(path, name);
    }
    return base64;
  }

  /**
   * @description 在外部 创建 temp 文件夹
   * @memberof FileProvider
   */
  public creatExternalTempDir = (): Promise<string> => {
    return new Promise((resovle, reject) => {
      this.platform.ready().then(() => {
        if (this.platform.is('cordova') && this.platform.is('android')) {
          const dir: string = this.file.externalDataDirectory;// externalDataDirectory, externalRootDirectory
          const tempDirName: string = 'temp';
          this.showMsg(`creatExternalTempDir temp 会创建在:${dir}`);
          this.file.checkDir(dir, tempDirName).then(
            (res) => {
              if (res) {
                this.showMsg(`creatExternalTempDir checkDir: 文件夹存在，无需创建`);
                resovle(`${dir}${tempDirName}/`);
              } else {
                reject();
              }
            },
            (error) => {
              //this.showMsg(`creatExternalTempDir checkDir error:${JSON.stringify(error)}`);
              this.file.createDir(dir, tempDirName, true).then(
                (directoryEntry: DirectoryEntry) => {
                  this.showMsg(`creatExternalTempDir createDir ok:${JSON.stringify(directoryEntry)}`);
                  resovle(`${dir}${tempDirName}/`);
                },
                (error) => {
                  this.showMsg(`creatExternalTempDir createDir error:${JSON.stringify(error)}`);
                  reject();
                }
              );
            }
          );
        }
      });

    });
  }

  /**
   * @description 显示信息
   * @private
   * @memberof FileProvider
   */
  private showMsg = (msg: any): void => {
    if (this.isDebug) {
      alert(JSON.stringify(msg));
    }
  }

}