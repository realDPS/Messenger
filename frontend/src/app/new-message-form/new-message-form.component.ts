import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MessagesService } from "../chat/messages.service";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../login/authentication.service";

@Component({
  selector: "app-new-message-form",
  templateUrl: "./new-message-form.component.html",
  styleUrls: ["./new-message-form.component.css"],
})
export class NewMessageFormComponent {
  username$ = this.authenticationService.getUsername();

  messageForm = this.fb.group({
    msg: "",
  });

  username: string | null = null;
  usernameSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
  }

  onPublishMessage() {
    if (this.username && this.messageForm.valid) {
      this.messagesService.postMessage({
        text: this.messageForm.value.msg as string,
        username: this.username,
        timestamp: Date.now(),
      });
      this.messageForm.reset();
    }
  }
}
