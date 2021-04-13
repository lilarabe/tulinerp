import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, AlertController, Alert, NavParams } from 'ionic-angular';
import { AjaxService, ResponseDataType } from '../../serves/ajax.service';
import { MsgService } from '../../serves/msg.service';


@Component({
  selector: 'chat',
  templateUrl: 'chat.html',
  host: {},
})
export class ChatComponent {

  @ViewChild('chatListElementRef') chatListElementRef: ElementRef;

  /** 发送消息信息 */
  public msgModel: string = '';
  /** 消息列表 */
  public chatList: Array<ChatListType> = [];
  /** At接收者列表 */
  private _aterList: Array<AterType> = [];
  /** 接收者名字 */
  public aterNames: Array<string> = [];
  /** 接收者ID */
  private _aterIds: Array<string> = [];
  /** 接收到的参数 */
  private _params: ParamsType = {};


  constructor(
    private _viewCtrl: ViewController,
    private _alertCtrl: AlertController,
    private _navParams: NavParams,
    private _ajax: AjaxService,
    private _msg: MsgService,
  ) {

  }

  ionViewDidLoad(): void {
    this._init();
  }

  /** 初始化数据 */
  private _init = async () => {
    this._params.ActionID = this._navParams.get('ActionID') || '';
    this._params.module = this._navParams.get('moduleName') || '';
    this.chatList = await this._getChatList();
    this._aterList = await this._getAterList();
    this._scrollToEnd();
  }

  /** 取消 */
  public dismiss = () => {
    this._viewCtrl.dismiss('chat-dismiss');
  }

  /** 选择At接收者 */
  public selectAters = async () => {
    if (this._aterList.length === 0) {
      this._msg.toast(`没有可选用户`);
      return;
    }
    /** 被选中者 */
    const selecteder = await this._alert();
    this._aterIds = selecteder.ids;
    this.aterNames = selecteder.names;
  }

  /** 发送消息 */
  public sendMsg = async (): Promise<void> => {
    const msg: string = this.msgModel;
    const aterIds: Array<string> = this._aterIds;
    this.msgModel = '';
    if (msg) {
      const isSendOK: boolean = await this._send(msg, aterIds);
      if (isSendOK) {
        this.chatList = await this._getChatList();
        this.aterNames = [];
        this._aterIds = [];
        this._aterList.map(v => { v.checked = false; });
        this._scrollToEnd();
      } else {
        this._msg.toast('发送失败');
      }
    }
  }

  /** 获取焦点 */
  public inputFocus = () => {
    this._scrollToEnd();
  }

  /** 聊天界面滚动到底 */
  private _scrollToEnd = async () => {
    setTimeout(() => {
      const listElement = this.chatListElementRef;
      listElement.nativeElement.scrollTop = 100000;
    });
  }

  /** 获取消息列表 */
  private _getChatList = (): Promise<Array<ChatListType>> => {
    return new Promise((resolve) => {
      this._ajax.loadData({
        method: 'get',
        title: '获取消息列表',
        uri: 'User_message.php',
        params: {
          Type: 'getNews',
          module: this._params.module,
          ActionID: this._params.ActionID,
        },
      }).subscribe((res: ResponseDataType) => {
        if (res.status === 1 && res.payload) {
          if (Array.isArray(res.payload.Discuss)) {
            res.payload.Discuss.map((aters: ChatListType) => {
              if (!Array.isArray(aters.call_user)) {
                /** mock */
                // aters.call_user = [{ name: "李国涛" }, { name: "任炜" }, { name: "吴小双" }, { name: "陈婵" }, { name: "李燕文" }];
                aters.call_user = [];
              }
            });
            resolve(res.payload.Discuss);
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });
  }

  /** 获取At接收者列表 */
  private _getAterList = async (): Promise<any> => {
    return new Promise((resolve) => {
      this._ajax.loadData({
        method: 'get',
        title: '获取@接收者列表',
        uri: 'User_message.php',
        // url: 'assets/data/at.data.json',
        params: {
          Type: 'getUser',
          module: this._params.module,
          ActionID: this._params.ActionID,
        },
      }).subscribe((res: ResponseDataType) => {
        if (res.status === 1 && Array.isArray(res.payload.Calluser)) {
          res.payload.Calluser.forEach((ater: AterType) => {
            ater.checked = false;
          });
          resolve(res.payload.Calluser);
        } else {
          resolve([]);
        }
      });
    });
  }

  /** alert */
  private _alert = (): Promise<{ ids: Array<string>; names: Array<string> }> => {
    return new Promise((resolve) => {
      const alert: Alert = this._alertCtrl.create();
      alert.setTitle(`请选择`);
      alert.setSubTitle(`可多选`);
      alert.addButton({
        text: '确定',
        handler: (res: Array<string>) => {
          const ids: Array<string> = [];
          const names: Array<string> = [];
          res.map(str => {
            const arr: Array<string> = str.split(`|`);
            ids.push(arr[0]);
            names.push(arr[1]);
          });
          const result = { ids, names };
          resolve(result);
        },
      });
      this._aterList.forEach((ater) => {
        alert.addInput({
          type: 'checkbox',
          label: ater.name,
          value: `${ater.id}|${ater.name}`,
          checked: ater.checked,
          handler: (res) => {
            ater.checked = res.checked;
          }
        });
      });
      alert.present();
    });
  }

  /** 发送信息 */
  private _send = (msg: string, aterIds: Array<string> = []): Promise<boolean> => {
    return new Promise((resolve) => {
      this._ajax.loadData({
        method: 'post',
        title: '发送信息',
        uri: 'User_message.php',
        isLoading: true,
        loadingCss: 'loading-delay',
        params: {
          Type: 'addDiscuss',
        },
        data: {
          module: this._params.module,
          ActionID: this._params.ActionID,
          Discuss: {
            content: msg,
            CallUser: aterIds,
          },
        },
      }).subscribe(res => {
        if (res.status === 1 && res.payload.AddDiscuss === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

}

/** 消息列表数据类型 */
interface ChatListType {
  /** 信息 */
  content: string;
  /** 创建时间 */
  create_at: string;
  /** 发送者 */
  realname: string;
  /** 是否本人发送 */
  isUserCall: boolean;
  /** @ 用户 */
  call_user: Array<ChatListAtersType>;
}
/** @ 用户 */
interface ChatListAtersType {
  name: string;
}

/** 接收者数据类型 */
interface AterType {
  /** 用户名 */
  name: string;
  /** 用户ID */
  id: string;
  /** 是否被选择 */
  checked: boolean;
}

/** 接收参数 */
interface ParamsType {
  /** 模块名 */
  module?: string;
  /** id */
  ActionID?: string;
}