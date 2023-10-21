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
  private lastMessageId = 0;

  constructor(private http: HttpClient) {}

  postMessage(message: Message): void {
    const currentMessages = this.messages.getValue();
    currentMessages.push(message);
    this.messages.next(currentMessages);

    // Post le message au serveur.
    this.http.post(this.messagesUrl, message,{ withCredentials: true }).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error("Erreur de post", error);
      },
    });
  }

  fetchMessages(): void {
    // Get les messages du serveur.
    let url = this.messagesUrl;

    //Update le url pour recevoir les nouveaux messages
    if(this.lastMessageId!=0){
      url+=`?fromId=${this.lastMessageId}`
    }
    else{
      url+="?fromId=0"
    }

    this.http.get<Message[]>(url,{ withCredentials: true }).subscribe({
      next: (messages) => {
        this.messages.next(messages);
        this.lastMessageId++;
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
