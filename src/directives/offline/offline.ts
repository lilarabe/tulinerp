import { Directive, ElementRef } from '@angular/core';
import { MsgService } from '../../serves/msg.service';

@Directive({
  selector: '[offline]' // Attribute selector
})
export class OfflineDirective {

  constructor(
    private _elRef: ElementRef,
    private _msg: MsgService
  ) {
    if (!navigator.onLine) {
      this.updateNetworkStatus();
    }
    window.addEventListener('online', this.updateNetworkStatus, false);
    window.addEventListener('offline', this.updateNetworkStatus, false);
  }

  private updateNetworkStatus = (): void => {
    if (navigator.onLine) {
      this._elRef.nativeElement.classList.remove('offline');
    }
    else {
      this._msg.toast('离线状态');
      this._elRef.nativeElement.classList.add('offline');
    }
  }
}
