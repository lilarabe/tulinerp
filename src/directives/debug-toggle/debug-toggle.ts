import { Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigPage } from '../../pages/config/config';
import { NavController } from 'ionic-angular';
import { MsgService } from '../../serves/msg.service';

/**
 * debug 模式 开启 关闭
 */
@Directive({
  selector: '[debug-toggle]',
  host:{
    '(click)': 'onClick()'
  }
})
export class DebugToggleDirective {

  private _clickEvent = new Subject();
  private _clickCount = 0;

  constructor(
    private _navCtrl: NavController,
    private _msg: MsgService,
  ) {
    this._clickEvent.debounceTime(1000).subscribe(count => {
      if (count >= 10) {
        this._msg.passwordConfirm('请输入进入配置页密码').then((password) => {
          if (password === '123') {
            this._navCtrl.push(ConfigPage);
          }
        });
      }
      this._clickCount = 0;
    });
  }

  public onClick = ():void => {
    this._clickEvent.next(++this._clickCount);
  }

}
