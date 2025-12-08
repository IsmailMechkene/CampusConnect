import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api';
  private storageKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem(this.storageKey, res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    return !!t;
  }
}
