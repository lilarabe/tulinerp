import { Injectable } from '@angular/core';

@Injectable()
export class IndexedDbService {

  private indexedDB: any = window.indexedDB || window['mozIndexedDB'] || window['webkitIndexedDB'];

  private db: any;

  /*过期时间*/
  private timeLimit: number = Infinity;

  private debug: boolean = false;

  private isIndexedDbSupported: boolean = false;

  constructor() {
    this.isIndexedDbSupported = this.test();
  }

  private showDebug = (msg): void => {
    if (this.debug) {
      console.log(msg);
    }
  }

  /*验证是否支持IndexedDb*/
  private test = (): boolean => {
    let result: boolean = false;
    if (this.indexedDB) {
      this.showDebug("您的浏览器支持IndexedDB数据库。");
      result = true;
    } else {
      this.showDebug("您的浏览器不支持IndexedDB数据库。");
      result = false;
    }
    return result;
  }

  public clear = (): any => {
    this.indexedDB.deleteDatabase('cacheDB');
    this.indexedDB.deleteDatabase('cacheDataDB');
    this.indexedDB.deleteDatabase('cacheImages');
  }

  private open = (objStoreName: string = 'cacheData', dbName: string = 'cacheDB', v: number = 1): any => {
    // this.clear();
    return new Promise((resolve, reject) => {
      const request = this.indexedDB.open(dbName, v);
      request.onsuccess = (event): void => {
        this.db = request.result;
        resolve('打开成功');
      };
      request.onerror = function (event) {
        reject('打开失败');
      };
      request.onupgradeneeded = (event): void => {
        this.db = request.result;
        if (!this.db.objectStoreNames.contains(objStoreName)) {/*是否 存在 objStoreName*/
          const objectStore = this.db.createObjectStore(objStoreName, { keyPath: "id", autoIncrement: true });
          objectStore.createIndex("key", "key", { unique: true });
          resolve('创建成功');
        }
      };
    });
  }

  /*遍历*/
  public list = (limit: number = Infinity, objStoreName: string = 'cacheData', dbName = 'cacheDB'): any => {
    /*查询结果*/
    const searchResult: Array<any> = [];
    return new Promise((resolve, reject) => {
      if (this.isIndexedDbSupported) {

        this.open(objStoreName, dbName).then((msg) => {
          this.showDebug(msg);

          const transaction = this.db.transaction(objStoreName, 'readwrite');
          const objStore = transaction.objectStore(objStoreName);
          objStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              if (searchResult.length < limit) {
                searchResult.unshift(cursor.value.data);
              }
              cursor.continue();
            } else {
              this.showDebug('遍历完成');
              resolve(searchResult);
            }
            resolve(searchResult);
          };
          objStore.openCursor().onerror = (event) => {
            this.showDebug('遍历错误');
            reject(searchResult);
          };

        }, (msg) => {
          this.showDebug(msg);
          reject(searchResult);
        });

      } else {
        this.showDebug('不支持IndexedDB');
        reject();
      }
    });
  }

  // private search = (key: string, objStoreName: string = 'cacheData'): any => {
  //   return new Promise((resolve, reject) => {
  //     const transaction = this.db.transaction(objStoreName, 'readwrite');
  //   });
  // }

  private getByIndex = (key, objStoreName: string = 'cacheData'): any => {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(objStoreName, 'readwrite');
      transaction.oncomplete = function (event) {
      };
      transaction.onerror = function (event) {
      };
      transaction.onabort = function (event) {
      };
      const objStore = transaction.objectStore(objStoreName);
      const index = objStore.index('key');
      const request = index.get(key);
      request.onsuccess = (e) => {
        const now = +new Date();
        const result = e.target.result;
        if (!result) {
          reject('没有找到数据');
        } else if (now - result.time > this.timeLimit) {
          reject('数据过期');
          this.remove(result.id, objStoreName);
        } else {
          this.showDebug('找到数据');
          resolve(result);
        }
      };
    });
  }

  private remove = (key, objStoreName: string = 'cacheData'): void => {
    const transaction = this.db.transaction(objStoreName, 'readwrite');
    transaction.oncomplete = function (event) {
    };
    transaction.onerror = function (event) {
    };
    transaction.onabort = function (event) {
    };
    const objStore = transaction.objectStore(objStoreName);
    const request = objStore.delete(key);
    request.onsuccess = (e) => {
      this.showDebug('成功删除数据');
    };
  }

  public get = (key, objStoreName = 'cacheData', dbName = 'cacheDB'): any => {
    const promise = new Promise((resolve, reject) => {
      this.open(objStoreName, dbName).then((msg) => {
        this.showDebug(msg);
        this.getByIndex(key, objStoreName).then(
          (data) => {
            resolve(data);
          },
          () => {
            this.showDebug(msg);
            reject();
          });
      }, (msg) => {
        this.showDebug(msg);
        reject();
      });
    });
    return promise;
  }


  public set = (key, data = {}, objStoreName: string = 'cacheData', dbName = 'cacheDB'): any => {
    return new Promise((resolve, reject) => {
      this.open(objStoreName, dbName).then((msg) => {
        this.showDebug(msg);
        const transaction = this.db.transaction(objStoreName, 'readwrite');
        const objStore = transaction.objectStore(objStoreName);
        const insertData = {
          key: key,
          time: +new Date(),
          data: data
        };
        /*如果有数据，删除后重新插入*/
        const index = objStore.index('key');
        const requestSearch = index.get(key);
        requestSearch.onsuccess = (e) => {
          const result = e.target.result;
          if (!result) {
            this.showDebug('没有找到数据');
            const requestAdd = objStore.add(insertData);
            requestAdd.onsuccess = () => {
              this.showDebug('成功插入数据');
              resolve();
            };
          } else {
            const requestDel = objStore.delete(result.id);
            requestDel.onsuccess = () => {
              this.showDebug('成功删除数据');
              const requestAdd = objStore.add(insertData);
              requestAdd.onsuccess = () => {
                this.showDebug('成功插入数据');
                resolve();
              };
            };
          }
        };
      }, (msg) => {
        this.showDebug(msg);
        reject();
      });
    });

  }

  /*模糊查询*/
  public like = (keyword: string = '', objStoreName: string = 'cacheData', dbName = 'cacheDB'): any => {
    /*查询结果*/
    const searchResult: Array<any> = [];
    return new Promise((resolve, reject) => {
      if (this.isIndexedDbSupported) {
        this.open(objStoreName, dbName).then((msg) => {
          this.showDebug(msg);
          const transaction = this.db.transaction(objStoreName, 'readwrite');
          const objStore = transaction.objectStore(objStoreName);
          objStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              const reg = new RegExp('^' + keyword, 'gi');
              if (reg.test(cursor.value.key)) {
                searchResult.push(cursor.value.data);
              }
              cursor.continue();
            } else {
              this.showDebug('遍历完成');
              resolve(searchResult);
            }
          };
        }, (msg) => {
          this.showDebug(msg);
          reject(searchResult);
        });
      } else {
        this.showDebug('不支持IndexedDB');
        reject(searchResult);
      }
    });
  }

  /*设定缓存过期时间*/
  public time = (val: number = 0): void => {
    this.timeLimit = val * 1;
  }

}
