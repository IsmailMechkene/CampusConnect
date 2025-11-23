import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class SignupService {
  // Use proxy (recommended) or full URL:
  private baseUrl = '/api'; // will proxy to http://localhost:3000
  // OR: private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }
}
