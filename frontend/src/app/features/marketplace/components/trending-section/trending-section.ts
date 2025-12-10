import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductComponent } from '../../../../shared/components/product-component/product-component';

@Component({
  selector: 'app-trending-section',
  imports: [
    CommonModule,
    ProductComponent,
  ],
  templateUrl: './trending-section.html',
  styleUrl: './trending-section.css',
})
export class TrendingSection {
  trendingProducts = [
    { id: 1, name: 'Poster', brand: 'StickNation', price: 15, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product14.jpg', isFavorite: false },
    { id: 2, name: 'CatHat', brand: 'CrochetwithSima', price: 20, currency: 'TND', rating: 3.5, imageUrl: '/images/products/product6.jpg', isFavorite: false },
    { id: 3, name: 'Earrings', brand: 'SilVerr', price: 19.99, currency: 'TND', rating: 2.5, imageUrl: '/images/products/product8.jpg', isFavorite: true },
    { id: 4, name: 'StudyBooks', brand: 'El Waraq', price: 99.99, currency: 'TND', rating: 5.0, imageUrl: '/images/products/product10.jpg', isFavorite: true },
    { id: 5, name: 'Sunflower Keychain', brand: 'CrochetwithSima', price: 10, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product7.jpg', isFavorite: false },
    { id: 6, name: 'Car Keychain', brand: 'SheinFinds', price: 24.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product9.jpg', isFavorite: true },
    { id: 7, name: 'ChessPattern', brand: 'Totey', price: 19.99, currency: 'TND', rating: 3.5, imageUrl: '/images/products/product11.jpg', isFavorite: false },
    { id: 8, name: 'Spiderman Shirt', brand: 'PrintX', price: 99.99, currency: 'TND', rating: 5.0, imageUrl: '/images/products/product13.jpg', isFavorite: false } ];
}
