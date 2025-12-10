import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ShopService } from '../../../services/shopService.service';
import { Shop } from '../../../shared/models/shop.model';
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
  isLoading = false;
  loadError = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Is current user the shop owner
  isOwner = false;

  // Selected product for detail view
  selectedProduct: Product | null = null;

  // Show add product modal
  showAddProductModal = false;

  // Use BACKEND_URL to build absolute image URLs when needed
  private readonly BACKEND_URL = 'http://localhost:3000';

  toImageUrl(p?: string): string {
    return p && p.startsWith('http') ? p : `${this.BACKEND_URL}${p ?? ''}`;
  }

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
    status: 'active',
  };

  // Product filters
  filters: ProductFilters = {
    status: [],
    category: [],
    priceRange: { min: 0, max: 300 },
    availability: [],
    dateAdded: undefined,
    popularity: [],
  };

  // Filter UI state
  filterState = {
    productStatus: {
      active: true,
      archived: false,
      outOfStock: false,
    },
    category: {
      wool: false,
      clothing: false,
      accessories: true,
      handmade: false,
    },
    availability: {
      inStock: true,
      outOfStock: false,
    },
    dateAdded: {
      newest: true,
      oldest: false,
    },
    popularity: {
      mostFavorited: true,
      bestSelling: false,
    },
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
  ) {}

  /**
   * Component initialization
   */
  ngOnInit(): void {
    const shopId = this.route.snapshot.paramMap.get('id') || 'shop-1';
    this.loadShopData(shopId);
    this.checkOwnershop(shopId);
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
    this.isLoading = true;
    this.loadError = false;
    this.shopService
      .getShopByIdHttp(shopId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details: Shop | null) => {
          if (details) {
            this.shopDetails = this.mapShopToShopDetails(details);
            this.loadError = false;
          } else {
            this.shopDetails = null;
            this.loadError = true;
          }
        },
        error: () => {
          this.shopDetails = null;
          this.loadError = true;
        },
        complete: () => {
          this.isLoading = false;
        },
      });

    // Load products
    this.productService
      .getProductsByShopId(shopId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products;
        this.applyFilters();
      });
  }

  /**
   * Map backend Shop model to frontend ShopDetails expected by the template
   */
  private mapShopToShopDetails(shop: Shop): ShopDetails {
    return {
      id: shop.id,
      name: shop.brandName,
      motto: shop.moto || '',
      description: shop.description || '',
      logo: shop.logo || '/images/shop/ShopLogo.png',
      coverImage: shop.banner_image || '/images/shop/ShopCoverImage.png',
      category: shop.keyword || '',
      contactInfo: {
        email: shop.brandEmail || '',
        phone: shop.phoneNumber || '',
        socialMedia: {
          instagram: shop.instagram || undefined,
          facebook: shop.facebook || undefined,
          twitter: undefined,
          tiktok: shop.tiktok || undefined,
        },
      },
      ownerId: shop.owner_id,
      rating: shop.rating ?? 0,
      reviewCount: shop.reviewCount ?? 0,
    } as ShopDetails;
  }

  /**
   * Check if current user is the shop owner
   */
  private checkOwnership(shopId: string): void {
    const currentUser = this.authService.getCurrentUser();
    // if (this.shopDetails && currentUser) {
    //   this.isOwner = this.shopDetails.ownerId === currentUser.id;
    // } else {
    //   this.isOwner = false;
    // }
    this.isOwner = true;
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
      popularity: [],
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
    this.productService
      .filterProducts(this.shopDetails?.id || 'shop-1', filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filtered) => {
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
    this.productService
      .updateProduct(product.id, product)
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
    this.productService
      .deleteProduct(productId)
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
      status: 'active',
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
      image:
        this.newProduct.image ||
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      images: [
        this.newProduct.image ||
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      ],
      tags: this.newProduct.tags,
      stockCount: this.newProduct.stockCount,
      status: this.newProduct.status as any,
      shopName: this.shopDetails?.name || '',
      shopId: this.shopDetails?.id || '',
      rating: 0,
    };

    this.productService
      .addProduct(product)
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
    this.newProduct.tags = this.newProduct.tags?.filter((t) => t !== tag);
  }

  // Variables pour les modals de shop
  showModifyShopModal = false;
  showDeleteShopModal = false;
  isModifying = false;
  isDeleting = false;

  // Copie des détails du shop pour modification
  shopDetailsCopy: ShopDetails | null = null;

  // Pour stocker les fichiers d'image
  selectedLogoFile: File | null = null;
  selectedCoverFile: File | null = null;

  /**
   * Open modify shop modal
   */
  openModifyShopModal(): void {
    if (!this.shopDetails) return;

    // Créer une copie profonde des détails du shop
    this.shopDetailsCopy = {
      ...this.shopDetails,
      contactInfo: {
        ...this.shopDetails.contactInfo,
        socialMedia: { ...this.shopDetails.contactInfo.socialMedia },
      },
    };
    this.showModifyShopModal = true;
  }

  /**
   * Close modify shop modal
   */
  closeModifyShopModal(): void {
    this.showModifyShopModal = false;
    this.shopDetailsCopy = null;
    this.selectedLogoFile = null;
    this.selectedCoverFile = null;
  }

  /**
   * Handle logo file selection
   */
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogoFile = file;
      // Aperçu immédiat
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.shopDetailsCopy) {
          this.shopDetailsCopy.logo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handle cover file selection
   */
  onCoverSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCoverFile = file;
      // Aperçu immédiat
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.shopDetailsCopy) {
          this.shopDetailsCopy.coverImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Modify shop
   */
  modifyShop(): void {
    if (!this.shopDetailsCopy || !this.shopDetails) return;

    this.isModifying = true;

    // Créer FormData
    const formData = new FormData();

    // Ajouter les champs textuels
    formData.append('brandName', this.shopDetailsCopy.name);
    formData.append('moto', this.shopDetailsCopy.motto);
    formData.append('description', this.shopDetailsCopy.description);
    formData.append('keyword', this.shopDetailsCopy.category);
    formData.append('brandEmail', this.shopDetailsCopy.contactInfo.email);
    formData.append('phoneNumber', this.shopDetailsCopy.contactInfo.phone);
    formData.append('instagram', this.shopDetailsCopy.contactInfo.socialMedia.instagram || '');
    formData.append('facebook', this.shopDetailsCopy.contactInfo.socialMedia.facebook || '');
    formData.append('tiktok', this.shopDetailsCopy.contactInfo.socialMedia.tiktok || '');

    // Ajouter les fichiers s'ils sont sélectionnés
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }
    if (this.selectedCoverFile) {
      formData.append('banner_image', this.selectedCoverFile);
    }

    this.shopService
      .updateShop(this.shopDetails.id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Shop updated successfully:', response);
          // Recharger les données du shop
          this.loadShopData(this.shopDetails!.id);
          this.closeModifyShopModal();
          alert('Shop updated successfully!');
        },
        error: (error) => {
          console.error('Error updating shop:', error);
          alert('Failed to update shop. Please try again.');
        },
        complete: () => {
          this.isModifying = false;
        },
      });
  }

  /**
   * Open delete shop modal
   */
  openDeleteShopModal(): void {
    this.showDeleteShopModal = true;
  }

  /**
   * Close delete shop modal
   */
  closeDeleteShopModal(): void {
    this.showDeleteShopModal = false;
  }

  /**
   * Delete shop
   */
  deleteShop(): void {
    if (!this.shopDetails) return;

    this.isDeleting = true;

    this.shopService
      .deleteShop(this.shopDetails.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Shop deleted successfully');
          // Rediriger vers la page d'accueil ou le dashboard
          alert('Shop deleted successfully!');
          // window.location.href = '/'; // Redirection
        },
        error: (error) => {
          console.error('Error deleting shop:', error);
          alert('Failed to delete shop. Please try again.');
        },
        complete: () => {
          this.isDeleting = false;
          this.closeDeleteShopModal();
        },
      });
  }
}
