import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ShopService } from '../../../services/shopService.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { ShopDetails } from '../../../shared/models/shop-owner.model';
import { Product, ProductFilters } from '../../../shared/models/product.model';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-inspect-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailModalComponent, Header, Footer],
  templateUrl: './inspect-shop.html',
  styleUrl: './inspect-shop.css',
})
export class InspectShop implements OnInit, OnDestroy {
  
  shopDetails: ShopDetails | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Is current user the shop owner
  isOwner = false;

  // Selected product for detail view
  selectedProduct: Product | null = null;

  // Show add product modal
  showAddProductModal = false;

  // New product data
  // TODO: replace the image URL with a proper default image path
  newProduct: Partial<Product> = {
    name: '',
    price: 0,
    category: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    tags: [],
    stockCount: 0,
    status: 'active'
  };

  // Product filters
  filters: ProductFilters = {
    status: [],
    category: [],
    priceRange: { min: 0, max: 300 },
    availability: [],
    dateAdded: undefined,
    popularity: []
  };

  // Filter UI state
  filterState = {
    productStatus: {
      active: true,
      archived: false,
      outOfStock: false
    },
    category: {
      wool: false,
      clothing: false,
      accessories: true,
      handmade: false
    },
    availability: {
      inStock: true,
      outOfStock: false
    },
    dateAdded: {
      newest: true,
      oldest: false
    },
    popularity: {
      mostFavorited: true,
      bestSelling: false
    }
  };

  /**
   * Subject for component cleanup
   */
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private productService: ProductService,
    private authService: AuthService
  ) { }

  /**
   * Component initialization
   */
  ngOnInit(): void {
    const shopId = this.route.snapshot.paramMap.get('id') || 'shop-1';
    this.loadShopData(shopId);
    this.checkOwnership(shopId);
  }

  /**
   * Component cleanup
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load shop data
   */
  private loadShopData(shopId: string): void {
    // Load shop details
    this.shopService.getShopDetails(shopId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        this.shopDetails = details || null;
      });

    // Load products
    this.productService.getProductsByShopId(shopId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
        this.applyFilters();
      });
  }

  /**
   * Check if current user is the shop owner
   */
  // TODO: uses auth service
  private checkOwnership(shopId: string): void {
    this.isOwner = this.authService.isShopOwner(shopId);
  }

  /**
   * Apply filters to products
   */
  applyFilters(): void {
    // Build filters from UI state
    const filters: ProductFilters = {
      status: [],
      availability: [],
      dateAdded: undefined,
      popularity: []
    };

    // Product status
    if (this.filterState.productStatus.active) filters.status!.push('active');
    if (this.filterState.productStatus.archived) filters.status!.push('archived');
    if (this.filterState.productStatus.outOfStock) filters.status!.push('out-of-stock');

    // Availability
    if (this.filterState.availability.inStock) filters.availability!.push('in-stock');
    if (this.filterState.availability.outOfStock) filters.availability!.push('out-of-stock');

    // Date added
    if (this.filterState.dateAdded.newest) filters.dateAdded = 'newest';
    else if (this.filterState.dateAdded.oldest) filters.dateAdded = 'oldest';

    // Apply filters
    this.productService.filterProducts(this.shopDetails?.id || 'shop-1', filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(filtered => {
        this.filteredProducts = filtered;
      });
  }

  /**
   * Toggle filter checkbox
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Open product detail modal
   */
  openProductDetail(product: Product): void {
    this.selectedProduct = product;
  }

  /**
   * Close product detail modal
   */
  closeProductDetail(): void {
    this.selectedProduct = null;
  }

  /**
   * Save product changes
   */
  saveProduct(product: Product): void {
    this.productService.updateProduct(product.id, product)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeProductDetail();
        this.loadShopData(this.shopDetails?.id || 'shop-1');
      });
  }

  /**
   * Delete product
   */
  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeProductDetail();
        this.loadShopData(this.shopDetails?.id || 'shop-1');
      });
  }

  /**
   * Open add product modal
   */
  // TODO: uses default image URL
  openAddProductModal(): void {
    this.showAddProductModal = true;
    this.newProduct = {
      name: '',
      price: 0,
      category: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      tags: [],
      stockCount: 0,
      status: 'active'
    };
  }

  /**
   * Close add product modal
   */
  closeAddProductModal(): void {
    this.showAddProductModal = false;
  }

  /**
   * Add new product
   */
  addNewProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price) {
      alert('Please fill in all required fields');
      return;
    }

    const product: Product = {
      id: '',
      name: this.newProduct.name,
      price: this.newProduct.price,
      category: this.newProduct.category || 'Accessories',
      description: this.newProduct.description,
      image: this.newProduct.image || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      images: [this.newProduct.image || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop'],
      tags: this.newProduct.tags,
      stockCount: this.newProduct.stockCount,
      status: this.newProduct.status as any,
      shopName: this.shopDetails?.name || '',
      shopId: this.shopDetails?.id || '',
      rating: 0
    };

    this.productService.addProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeAddProductModal();
        this.loadShopData(this.shopDetails?.id || 'shop-1');
      });
  }

  /**
   * Add tag to new product
   */
  addTagToNewProduct(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim();
    if (tag && !this.newProduct.tags?.includes(tag)) {
      this.newProduct.tags = [...(this.newProduct.tags || []), tag];
      tagInput.value = '';
    }
  }

  /**
   * Remove tag from new product
   */
  removeTagFromNewProduct(tag: string): void {
    this.newProduct.tags = this.newProduct.tags?.filter(t => t !== tag);
  }

  /**
   * Get stars array for rating
   */
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}