import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:4200/api';
  private storageKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient, private router: Router) {}

  // Inscription
  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signup`, payload).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  // Connexion
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.storageKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // Optionnel : vérifier l'expiration du token
    return !!token;
  }

  // Pour rafraîchir les données utilisateur
  refreshUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/users/me`);
  }
}
