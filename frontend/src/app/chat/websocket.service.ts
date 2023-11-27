import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

export type WebSocketEvent = "notif";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private retryDelay = 2000;
  private errorDisconnect:boolean = true;

  constructor() {}

  public connect(): Observable<WebSocketEvent> {
    this.ws = new WebSocket(`${environment.wsUrl}/notifications`);
    const events = new Subject<WebSocketEvent>();

    this.ws.onmessage = () => events.next("notif");
    this.ws.onclose = () => {
      events.complete();
      if(this.errorDisconnect)
        this.reconnect();
    };
    this.ws.onerror = () => events.error("error");

    return events.asObservable();
  }

  private reconnect() {
    setInterval(() => {
      this.connect();
    }, this.retryDelay);
  }

  public disconnect() {
    this.ws?.close();
    this.ws = null;
    this.errorDisconnect=false;
  }
}
