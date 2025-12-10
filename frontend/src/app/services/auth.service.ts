import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../shared/models/shop-owner.model';

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








    
  // Current user subject
  private currentUserSubject = new BehaviorSubject<User | null>(this.getMockUser());

  // Observable of current user
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if current user is a seller
  isSeller(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'seller';
  }

  // Check if current user owns the shop
  isShopOwner(shopId: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'seller' && user?.shopId === shopId;
  }

  // Toggle between seller and customer role (for demo purposes)
  toggleUserRole(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const newRole = currentUser.role === 'seller' ? 'customer' : 'seller';
      const updatedUser: User = {
        ...currentUser,
        role: newRole
      };
      this.currentUserSubject.next(updatedUser);
      console.log('User role changed to:', newRole);
    }
  }

  // Get mock user for demo
  private getMockUser(): User {
    return {
      id: 'user-1',
      name: 'Racha Ben Ahmed',
      email: 'racha@example.com',
      role: 'seller', // Change to 'customer' to test customer view
      shopId: 'shop-1'
    };
  }

  // Login Aziz
  // login(email: string, password: string): Observable<User> {
  //   // Mock login - in production, this would call API
  //   const user = this.getMockUser();
  //   this.currentUserSubject.next(user);
  //   return new BehaviorSubject<User>(user).asObservable();
  // }

  // // logout Aziz
  // logout(): void {
  //   this.currentUserSubject.next(null);
  // }
}