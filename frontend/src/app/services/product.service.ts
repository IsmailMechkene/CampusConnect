// src/app/core/services/product.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductFilters } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private productsSubject = new BehaviorSubject<Product[]>(this.getAllMockProducts());

  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor() { }

  getAllProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductsByShopId(shopId: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.shopId === shopId))
    );
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isTrending))
    );
  }

  getNewProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isNew))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  addProduct(product: Product): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const newProduct = {
      ...product,
      id: `product-${Date.now()}`,
      rating: 0,
      status: 'active' as const
    };
    this.productsSubject.next([...currentProducts, newProduct]);
    return of(newProduct);
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product | null> {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === id);
    
    if (index > -1) {
      const updatedProduct = { ...currentProducts[index], ...updates };
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
      return of(updatedProduct);
    }
    
    return of(null);
  }

  deleteProduct(id: string): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    this.productsSubject.next(filteredProducts);
    return of(true);
  }

  filterProducts(shopId: string, filters: ProductFilters): Observable<Product[]> {
    return this.getProductsByShopId(shopId).pipe(
      map(products => {
        let filtered = [...products];

        // Filter by status
        if (filters.status && filters.status.length > 0) {
          filtered = filtered.filter(p => filters.status!.includes(p.status || 'active'));
        }

        // Filter by category
        if (filters.category && filters.category.length > 0) {
          filtered = filtered.filter(p => filters.category!.includes(p.category));
        }

        // Filter by price range
        if (filters.priceRange) {
          filtered = filtered.filter(p => 
            p.price >= filters.priceRange!.min && 
            p.price <= filters.priceRange!.max
          );
        }

        // Filter by availability
        if (filters.availability && filters.availability.length > 0) {
          filtered = filtered.filter(p => {
            const isInStock = (p.stockCount || 0) > 0;
            if (filters.availability!.includes('in-stock') && isInStock) return true;
            if (filters.availability!.includes('out-of-stock') && !isInStock) return true;
            return false;
          });
        }

        // Sort by date added
        if (filters.dateAdded === 'newest') {
          filtered.sort((a, b) => b.id.localeCompare(a.id));
        } else if (filters.dateAdded === 'oldest') {
          filtered.sort((a, b) => a.id.localeCompare(b.id));
        }

        return filtered;
      })
    );
  }

  private getAllMockProducts(): Product[] {
    return [
      // Shop 1 products (Spark Agency)
      {
        id: 'prod-1',
        name: 'Spiderman bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop'
        ],
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Spark agency specializes in homemade bracelets suitable for every taste. A broad selection of different bracelets designs',
        tags: ['Handmade', 'Jewelry', 'Accessories', 'Custom'],
        stockCount: 15,
        status: 'active',
        isTrending: true
      },
      {
        id: 'prod-2',
        name: 'Valentine bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=800&h=800&fit=crop'
        ],
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Beautiful handmade Valentine bracelet perfect for gifts. Made with love and attention to detail.',
        tags: ['Valentine', 'Gift', 'Handmade', 'Love'],
        stockCount: 8,
        status: 'active',
        isTrending: true
      },
      {
        id: 'prod-3',
        name: 'Cat bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop'
        ],
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Cute cat-themed bracelet for cat lovers. Handcrafted with premium materials.',
        tags: ['Cat', 'Cute', 'Animals', 'Handmade'],
        stockCount: 12,
        status: 'active',
        isTrending: true
      },
      {
        id: 'prod-4',
        name: 'Rainbow bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Colorful rainbow bracelet that brings joy and positivity.',
        tags: ['Rainbow', 'Colorful', 'Pride', 'Happy'],
        stockCount: 5,
        status: 'active'
      },
      {
        id: 'prod-5',
        name: 'Ocean bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop',
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Ocean-inspired bracelet with beautiful blue tones.',
        tags: ['Ocean', 'Blue', 'Nature', 'Beach'],
        stockCount: 0,
        status: 'out-of-stock'
      },
      {
        id: 'prod-6',
        name: 'Sunset bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Warm sunset colors captured in a beautiful bracelet.',
        tags: ['Sunset', 'Warm', 'Orange', 'Nature'],
        stockCount: 20,
        status: 'archived'
      },
      {
        id: 'prod-7',
        name: 'Star bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Celestial star-themed bracelet for dreamers.',
        tags: ['Stars', 'Night', 'Celestial', 'Dream'],
        stockCount: 18,
        status: 'active'
      },
      {
        id: 'prod-8',
        name: 'Flower bracelet',
        category: 'Accessories',
        price: 12.00,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop',
        shopName: 'Spark Agency',
        shopId: 'shop-1',
        description: 'Delicate flower design perfect for spring and summer.',
        tags: ['Flowers', 'Spring', 'Nature', 'Feminine'],
        stockCount: 10,
        status: 'active',
        isNew: true
      },
      // Other shops' products (for marketplace)
      {
        id: 'prod-9',
        name: 'Vintage Watch',
        category: 'Watches',
        price: 45.00,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        shopName: 'Time Shop',
        shopId: 'shop-2',
        description: 'Classic vintage watch with leather strap.',
        tags: ['Vintage', 'Watch', 'Classic'],
        stockCount: 3,
        status: 'active',
        isTrending: true
      },
      {
        id: 'prod-10',
        name: 'Modern Sneakers',
        category: 'Footwear',
        price: 67.00,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        shopName: 'Shoe Store',
        shopId: 'shop-3',
        description: 'Comfortable modern sneakers for everyday wear.',
        tags: ['Shoes', 'Sneakers', 'Casual'],
        stockCount: 25,
        status: 'active',
        isNew: true
      }
    ];
  }
}