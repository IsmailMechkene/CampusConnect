// src/app/core/models/product.model.ts

/**
 * Interface representing a Product in the marketplace
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  images?: string[]; // Additional images for detail view
  shopName: string;
  shopId: string;
  description?: string;
  tags?: string[];
  stockCount?: number;
  isNew?: boolean;
  isTrending?: boolean;
  status?: 'active' | 'archived' | 'out-of-stock';
}

/**
 * Interface for product filters
 */
export interface ProductFilters {
  status?: ('active' | 'archived' | 'out-of-stock')[];
  category?: string[];
  priceRange?: { min: number; max: number };
  availability?: ('in-stock' | 'out-of-stock')[];
  dateAdded?: 'newest' | 'oldest';
  popularity?: ('most-favorited' | 'best-selling')[];
}