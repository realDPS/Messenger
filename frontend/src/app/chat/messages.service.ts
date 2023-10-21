import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "./message.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);
  private messagesUrl = `${environment.backendUrl}/messages`;

  constructor(private http: HttpClient) {}

  postMessage(message: Message): void {
    const currentMessages = this.messages.getValue();
    currentMessages.push(message);
    this.messages.next(currentMessages);

    // Post le message au serveur.
    this.http.post(this.messagesUrl, message, {withCredentials:true}).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error("Erreur de post", error);
      },
    });
  }

  fetchMessages(): void {
    // Get les messages du serveur.
    this.http.get<Message[]>(this.messagesUrl, {withCredentials:true}).subscribe({
      next: (messages) => {
        this.messages.next(messages);
      },
      error: (error) => {
        console.error("Error de get", error);
      },
    });
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }
}
