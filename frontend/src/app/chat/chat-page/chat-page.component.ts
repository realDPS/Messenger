import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.component.html",
  styleUrls: ["./chat-page.component.css"],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.authenticationService.getUsername();

  messageForm = this.fb.group({
    msg: "",
  });

  username: string | null = null;
  usernameSubscription: Subscription;
  messagesSubscription: Subscription;

  messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
    // Abonner aux nouveau message.
    this.messagesSubscription = this.messages$.subscribe((newMessages) => {
      this.messages = newMessages;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    // Désabonner de messages.
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */

  onLogout() {
    // Déconnecte.
    this.authenticationService.logout();
    // Redirige vers le login.
    this.router.navigate(["/login"]);
  }
}
