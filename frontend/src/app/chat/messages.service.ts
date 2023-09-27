import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "./message.model";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor() {}

  postMessage(message: Message): void {
    // Prend la valeur du message.
    const currentMessages = this.messages.getValue();
    // Ajoute le nouveau message au tableau.
    console.log(this.messages.getValue());
    currentMessages.push(message);
    // Émet le message et met à jour le message courant.
    this.messages.next(currentMessages);
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }
}
