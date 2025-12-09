import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CreateShopPayload {
  name: string;
  description?: string;
}

export interface Shop {
  id: string;
  name: string | null;
  description?: string | null;
  owner_id: string;
  created_at?: string;
}

export interface ShopStatusResponse {
  hasShop: boolean;
  shop?: Shop | null;
}

@Injectable({ providedIn: 'root' })
export class ShopService {
  private baseUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) {}

  /** Ajouter automatiquement le token */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /** Vérifier si le user a un shop */
  hasShop(): Observable<ShopStatusResponse> {
    return this.http.get<ShopStatusResponse>(`${this.baseUrl}/users/has-shop`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Obtenir les infos du shop */
  getMyShop(): Observable<Shop> {
    return this.http.get<Shop>(`${this.baseUrl}/shop/my-shop`, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Créer un shop pour le user */
  createShop(payload: CreateShopPayload): Observable<Shop> {
    return this.http.post<Shop>(`${this.baseUrl}/shop/create`, payload, {
      headers: this.getAuthHeaders(),
    });
  }
}
