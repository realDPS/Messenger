import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { LoginResponse } from "./login-response";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, private http: HttpClient) {
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }

  async login(userCredentials: UserCredentials): Promise<void> {
    try {
      const response = await firstValueFrom(
        // Apelle le login du API.
        this.http.post<LoginResponse>(
          `${environment.backendUrl}/auth/login`,
          userCredentials,
          { withCredentials: true }
        )
      );

      // Met à jour le username.
      this.username.next(response.username);

      // Met le username dans localStorage.
      localStorage.setItem(AuthenticationService.KEY, response.username);
    } catch (error) {
    }
  }

  async logout(): Promise<void> {
    if (this.username.value !== null) {
      // Enlève le username dans localStorage.
      localStorage.removeItem(AuthenticationService.KEY);
    }
    this.username.next(null);

    // Navigue vers le Login.
    this.router.navigate(["/login"]);

    try {
      // Apelle le logout du API.
      this.http.post<void>(
        `${environment.backendUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
    }
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
