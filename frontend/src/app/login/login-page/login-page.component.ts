import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  error403:boolean= false;
  error40x:boolean=false;

  async onLogin(userCredentials: UserCredentials) {

    try {
      this.error403 = this.error40x = false;
      await this.authenticationService.login(userCredentials); 
      this.router.navigate(["/chat"]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.error403 = true;
      }
      else{
        this.error40x = true;
      }
    }
  }
}
