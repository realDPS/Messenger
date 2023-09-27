import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { ChatPageComponent } from "./chat/chat-page/chat-page.component";

const routes: Routes = [
  { path: "chat", component: ChatPageComponent }, // Route vers le chat.
  { path: "**", component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
