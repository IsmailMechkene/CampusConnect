// C'est la version originale de Nadia

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';

// export interface ShopStatusResponse {
//   hasShop: boolean;
//   shop?: {
//     id: string;
//     name: string;
//   };
// }

// export interface CreateShopPayload {
//   name: string;
//   description?: string;
// }

// export interface Shop {
//   id: string;
//   name: string;
//   description?: string;
//   owner_id: string;
// }

// @Injectable({ providedIn: 'root' })
// export class ShopService {
//   private baseUrl = 'http://localhost:4200/api';

//   constructor(private http: HttpClient) {}

//   /** Ajouter automatiquement le token */
//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('auth_token') || '';
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     });
//   }

//   /** Vérifier si le user a un shop */
//   hasShop(): Observable<ShopStatusResponse> {
//     return this.http.get<ShopStatusResponse>(`${this.baseUrl}/users/has-shop`, {
//       headers: this.getAuthHeaders(),
//     });
//   }

//   /** Obtenir les infos du shop */
//   getMyShop(): Observable<Shop> {
//     return this.http.get<Shop>(`${this.baseUrl}/shop/my-shop`, {
//       headers: this.getAuthHeaders(),
//     });
//   }

//   /** Créer un shop pour le user */
//   createShop(payload: CreateShopPayload): Observable<Shop> {
//     return this.http.post<Shop>(`${this.baseUrl}/shop/create`, payload, {
//       headers: this.getAuthHeaders(),
//     });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Ajoutées
import { of } from 'rxjs';
import { Shop } from '../shared/models/shop.model';
import { ShopDetails } from '../shared/models/shop-owner.model';

export interface ShopStatusResponse {
  hasShop: boolean;
  shop?: {
    id: string;
    name: string;
  };
}

export interface CreateShopPayload {
  name: string;
  description?: string;
}

// Le modèle Shop alternatif se trouve ici: '../shared/models/shop.model'

// export interface Shop {
//   id: string;
//   name: string;
//   description?: string;
//   owner_id: string;
// }

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


  // Mock data naheha ki dakhel backend 
  /**
   * Mock data for featured shops
   */
  private mockShops: Shop[] = [
    {
      id: 'shop-1',
      name: 'Spark Agency',
      category: 'Accessories',
      description: 'Nulla sagittis ex sed tellus porttitor, vel dignissim magna euismod. Maecenas sit amet malesuada lorem, ac ornare erat.',
      logo: 'assets/shop-logo.png',
      rating: 4.5,
      reviewCount: 38,
      tags: ['Watches', 'Fit', 'School', 'New'],
      backgroundColor: '#f8e4e4'
    },
    // Add other shops
  ];

  /**
   * Mock detailed shop data
   */
  private mockShopDetails: ShopDetails[] = [
    {
      id: 'shop-1',
      name: 'Spark Agency',
      motto: 'Handmade bracelets for every taste',
      description: 'Spark agency specializes in homemade bracelets suitable for every taste. A broad selection of different bracelets designs',
      logo: '/images/shop/ShopLogo.png',
      coverImage: '/images/shop/ShopCoverImage.png',
      category: 'Accessories',
      contactInfo: {
        email: 'email@gmail.com',
        phone: '+216 12345678',
        socialMedia: {
          instagram: 'spark_agency',
          facebook: 'sparkagency',
          twitter: 'spark_agency',
          tiktok: 'sparkagency'
        }
      },
      ownerId: 'user-1',
      rating: 4.9,
      reviewCount: 156
    }
  ];

  // Get all featured shops
  getFeaturedShops(): Observable<Shop[]> {
    return of(this.mockShops);
  }

  // Get shop by ID
  getShopById(id: string): Observable<Shop | undefined> {
    return of(this.mockShops.find(shop => shop.id === id));
  }

  // Get detailed shop information
  getShopDetails(id: string): Observable<ShopDetails | undefined> {
    return of(this.mockShopDetails.find(shop => shop.id === id));
  }

  // Update shop details
  updateShopDetails(id: string, updates: Partial<ShopDetails>): Observable<ShopDetails | null> {
    const shopIndex = this.mockShopDetails.findIndex(s => s.id === id);
    if (shopIndex > -1) {
      this.mockShopDetails[shopIndex] = {
        ...this.mockShopDetails[shopIndex],
        ...updates
      };
      return of(this.mockShopDetails[shopIndex]);
    }
    return of(null);
  }
}



// C'est la version originale de Aziz


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { of } from 'rxjs';
// import { Shop } from '../shared/models/shop.model';
// import { ShopDetails } from '../shared/models/shop-owner.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ShopService {
  
//   /**
//    * Mock data for featured shops
//    */
//   private mockShops: Shop[] = [
//     {
//       id: 'shop-1',
//       name: 'Spark Agency',
//       category: 'Accessories',
//       description: 'Nulla sagittis ex sed tellus porttitor, vel dignissim magna euismod. Maecenas sit amet malesuada lorem, ac ornare erat.',
//       logo: 'assets/shop-logo.png',
//       rating: 4.5,
//       reviewCount: 38,
//       tags: ['Watches', 'Fit', 'School', 'New'],
//       backgroundColor: '#f8e4e4'
//     },
//     // Add other shops
//   ];

//   /**
//    * Mock detailed shop data
//    */
//   private mockShopDetails: ShopDetails[] = [
//     {
//       id: 'shop-1',
//       name: 'Spark Agency',
//       motto: 'Handmade bracelets for every taste',
//       description: 'Spark agency specializes in homemade bracelets suitable for every taste. A broad selection of different bracelets designs',
//       logo: '/images/shop/ShopLogo.png',
//       coverImage: '/images/shop/ShopCoverImage.png',
//       category: 'Accessories',
//       contactInfo: {
//         email: 'email@gmail.com',
//         phone: '+216 12345678',
//         socialMedia: {
//           instagram: 'spark_agency',
//           facebook: 'sparkagency',
//           twitter: 'spark_agency',
//           tiktok: 'sparkagency'
//         }
//       },
//       ownerId: 'user-1',
//       rating: 4.9,
//       reviewCount: 156
//     }
//   ];

//   constructor() { }

//   /**
//    * Get all featured shops
//    */
//   getFeaturedShops(): Observable<Shop[]> {
//     return of(this.mockShops);
//   }

//   /**
//    * Get shop by ID
//    */
//   getShopById(id: string): Observable<Shop | undefined> {
//     return of(this.mockShops.find(shop => shop.id === id));
//   }

//   /**
//    * Get detailed shop information
//    */
//   getShopDetails(id: string): Observable<ShopDetails | undefined> {
//     return of(this.mockShopDetails.find(shop => shop.id === id));
//   }

//   /**
//    * Update shop details
//    */
//   updateShopDetails(id: string, updates: Partial<ShopDetails>): Observable<ShopDetails | null> {
//     const shopIndex = this.mockShopDetails.findIndex(s => s.id === id);
//     if (shopIndex > -1) {
//       this.mockShopDetails[shopIndex] = {
//         ...this.mockShopDetails[shopIndex],
//         ...updates
//       };
//       return of(this.mockShopDetails[shopIndex]);
//     }
//     return of(null);
//   }
// }