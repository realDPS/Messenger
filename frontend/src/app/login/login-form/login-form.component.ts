import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [
      null,
      [
        Validators.required,
        Validators.min(10),
        Validators.max(110),
        Validators.pattern("^[0-9]*$"),
      ],
    ],
  });
  

  @Output()
  login = new EventEmitter<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onLogin() {
    if (
      this.loginForm.valid &&
      this.loginForm.value.username &&
      this.loginForm.value.password
    ) {
      this.login.emit({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      });
    }
  }
  showNameRequiredError(): boolean {
    return this.showError("username", "required");
  }
  showPasswordRequiredError(): boolean {
    return this.showError("password", "required");
  }


  private showError(field: "username" | "password", error: string): boolean {
    return (
      this.loginForm.controls[field].hasError(error) &&
      (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched)
    );
  }

}
