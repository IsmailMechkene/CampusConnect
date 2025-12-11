import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

export interface ProductDto {
  id: string;
  store_id?: string;
  name: string;
  description?: string | null;
  price?: string | number;
  stock?: number;
  image?: string;
  is_favourite?: boolean;
}

const LOCAL_KEY = 'campus_favourites_static_v1';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.css'],
})
export class FavouritesComponent {
  products: ProductDto[] = [];

  constructor() {
    this.load();
  }

  private mock(): ProductDto[] {
    return [
      {
        id: 'p1',
        store_id: 's1',
        name: 'Handmade Bracelet',
        description: 'Delicate bracelet handcrafted by local creators.',
        price: '25.00',
        stock: 12,
        image: '/images/bracelet_coeur1.jpg',
        is_favourite: true
      },
      {
        id: 'p2',
        store_id: 's2',
        name: 'Mauve Bracelet',
        description: 'Soft mauve tones — an elegant gift.',
        price: '30.00',
        stock: 6,
        image: '/images/bracelet_coeur_mauve.jpg',
        is_favourite: true
      },
      {
        id: 'p3',
        store_id: 's3',
        name: 'Spidey Keychain',
        description: 'Cute keychain for Marvel fans.',
        price: '12.00',
        stock: 40,
        image: '/images/spiderman.png',
        is_favourite: true
      }
    ];
  }

  private load() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) {
        this.products = this.mock();
        this.save();
        return;
      }
      this.products = JSON.parse(raw) as ProductDto[];
      this.products = this.products.map(p => ({ ...p, is_favourite: true }));
    } catch (e) {
      console.error('Failed to load favourites, using mock', e);
      this.products = this.mock();
      this.save();
    }
  }

  private save() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(this.products));
    } catch (e) {
      console.error('Failed to save favourites', e);
    }
  }

  remove(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.save();
  }

  clearAll() {
    if (!confirm('Remove all favourites?')) return;
    this.products = [];
    this.save();
  }

  trackById(_: number, item: ProductDto) {
    return item.id;
  }
}
