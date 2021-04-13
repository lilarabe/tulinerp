import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WebSocketService {

  private ws: WebSocket;

  constructor() {
  }

  public connect = (url: string): Observable<any> => {
    this.ws = new WebSocket(url);
    return new Observable(
      observer => {
        this.ws.onmessage = (event) => {
          observer.next(event.data);
        };
        this.ws.onerror = (event) => {
          console.error(`ws: ${url} 无法连接`);
          observer.error(event);
        };
        this.ws.onclose = (event) => {
          console.error(`ws: ${url} 连接结束`);
          observer.complete();
        }
      }
    );
  }

  public send = (message: string): void => {
    this.ws.send(message);
  }

}
