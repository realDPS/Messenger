import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";
import { Router } from '@angular/router';


@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLogin(UserCredentials: UserCredentials) {

    console.log("Données du Login:", UserCredentials);
    this.router.navigate(['/chat']);
  }
}
