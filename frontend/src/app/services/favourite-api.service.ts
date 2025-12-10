// src/app/features/favourites/services/favourite-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

export interface StoreDto {
  id: string;
  brandName: string;
  moto?: string | null;
  description?: string | null;
  logo?: string | null;
  banner_image?: string | null;
  keyword?: string;
  is_favourite: boolean;
  // add extras if needed (phoneNumber, brandEmail, etc.)
}

export interface ProductDto {
  id: string;
  store_id: string;
  name: string;
  description?: string | null;
  // Prisma Decimal -> often returned as string from JSON APIs; keep union just in case
  price?: string | number;
  stock?: number;
  is_favourite: boolean;
  // add extras if needed (created_at...)
}

@Injectable({ providedIn: 'root' })
export class FavouriteApiService {
  private base = '/api'; // change as needed

  constructor(private http: HttpClient) {}

  getFavouriteProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.base}/products`, { params: { is_favourite: 'true' } });
  }

  getFavouriteStores(): Observable<StoreDto[]> {
    return this.http.get<StoreDto[]>(`${this.base}/stores`, { params: { is_favourite: 'true' } });
  }

  getAllFavourites() {
    return forkJoin({
      products: this.getFavouriteProducts(),
      stores: this.getFavouriteStores()
    });
  }

  toggleProductFavourite(id: string, newValue: boolean) {
    return this.http.patch<ProductDto>(`${this.base}/products/${id}`, { is_favourite: newValue });
  }

  toggleStoreFavourite(id: string, newValue: boolean) {
    return this.http.patch<StoreDto>(`${this.base}/stores/${id}`, { is_favourite: newValue });
  }
}
