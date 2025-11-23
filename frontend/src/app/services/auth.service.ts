import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginPayload { email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  // If you're not using proxy, set this to 'http://localhost:3000'
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }
}
