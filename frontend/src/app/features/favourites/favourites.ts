import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FavouriteApiService, ProductDto, StoreDto } from '../../services/favourite-api.service';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Header, Footer],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.css'],
})
export class Favourites {
  private api = inject(FavouriteApiService);

  loading = false;
  error: string | null = null;

  filter: 'all' | 'products' | 'stores' = 'all';

  constructor() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.api.getAllFavourites()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.products = res.products ?? [];
          this.stores = res.stores ?? [];
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load favourites. Try again later.';
        }
      });
  }

  // convenience getters
  get visibleProducts() {
    return this.filter === 'all' || this.filter === 'products' ? this.products : [];
  }

  get visibleStores() {
    return this.filter === 'all' || this.filter === 'stores' ? this.stores : [];
  }

  toggleProduct(product: ProductDto) {
    const old = product.is_favourite;
    product.is_favourite = !old;

    this.api.toggleProductFavourite(product.id, product.is_favourite)
      .pipe(
        catchError((err) => {
          product.is_favourite = old;
          this.error = 'Could not update favourite status. Try again.';
          return of(null);
        })
      )
      .subscribe();
  }

  toggleStore(store: StoreDto) {
    const old = store.is_favourite;
    store.is_favourite = !old;

    this.api.toggleStoreFavourite(store.id, store.is_favourite)
      .pipe(
        catchError((err) => {
          store.is_favourite = old;
          this.error = 'Could not update favourite status. Try again.';
          return of(null);
        })
      )
      .subscribe();
  }

  trackById(_: number, item: ProductDto | StoreDto) {
    return item.id;
  }
}
