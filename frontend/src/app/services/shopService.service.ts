import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shop {
  id: string;
  brandName: string;
  moto?: string | null;
  description?: string | null;
  keyword: string | null;
  brandEmail?: string | null;
  phoneNumber?: string | null;
  tag1?: string | null;
  tag2?: string | null;
  tag3?: string | null;
  tag4?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  x?: string | null;
  tiktok?: string | null;
  logo?: string | null;
  banner_image?: string | null;
  owner_id: string;
  created_at?: string;
}

export interface ShopStatusResponse {
  hasShop: boolean;
  shop?: Shop; // 'Shop | undefined'
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

  /** Créer un shop avec fichiers */
  createShopWithFiles(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/shop/create`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  /** Mettre à jour un shop */
  updateShop(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/shop/update/${id}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
