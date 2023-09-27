import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor(private routeur: Router) {
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }

  login(userCredentials: UserCredentials) {
    // Prend le username de userCredentials.
    const username = userCredentials.username;
    // Met le username dans localStorage.
    localStorage.setItem(AuthenticationService.KEY, username);
    // Met à jour le username.
    this.username.next(username);
  }

  logout() {
    if (this.username.value !== null)
      localStorage.removeItem(AuthenticationService.KEY);
    this.username.next(null);
    this.routeur.navigate(["/LOGOUT"]);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
