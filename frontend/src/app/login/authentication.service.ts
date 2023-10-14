import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { LoginResponse } from "../interfaces/login-response";
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

  async login(userCredentials: UserCredentials) {
    try {
      // Requête HTTP au backend.
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.backendUrl}/auth/login`,
          userCredentials,
          { withCredentials: true }
        )
      );
      // Prend le session ID de la réponse.
      const sessionId = response.sid;
      localStorage.setItem(AuthenticationService.KEY, sessionId);
      // Met à jour le username.
      this.username.next(userCredentials.username);
    } catch (error) {
      // Message d'erreur.
      console.error("Erreur du login", error);
    }
  }

  logout() {
    if (this.username.value !== null) {
      localStorage.removeItem(AuthenticationService.KEY);
    }
    this.username.next(null);
    this.router.navigate(["/login"]);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
