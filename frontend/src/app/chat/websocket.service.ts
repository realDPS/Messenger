import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

export type WebSocketEvent = "notif";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private ws: WebSocket | null = null;

  constructor() {}

  public connect(): Observable<WebSocketEvent> {
    this.ws = new WebSocket(`${environment.wsUrl}/notifications`);
    const events = new Subject<WebSocketEvent>();

    this.ws.onopen=()=> events.next("notif");
    this.ws.onmessage = () => events.next("notif");
    this.ws.onclose = () => {this.reconnect();};
    this.ws.onerror = () => console.error("error");

    return events.asObservable();
  }

  private reconnect() {
    setInterval(() => {
      this.connect();
    }, 2000);
  }

  public disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
