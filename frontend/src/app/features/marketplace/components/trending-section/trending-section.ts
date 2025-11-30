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
    { id: 1, name: 'Stickers', brand: 'StickNation', price: 29.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product1.jpg', isFavorite: false },
    { id: 2, name: 'bracelets', brand: 'bracelet.hand.made', price: 49.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product2.png', isFavorite: true },
    { id: 3, name: 'bracelets', brand: 'SilVerr', price: 19.99, currency: 'TND', rating: 3.5, imageUrl: '/images/products/product3.jpg', isFavorite: false },
    { id: 4, name: 'Notebooks', brand: 'El Waraq', price: 99.99, currency: 'TND', rating: 5.0, imageUrl: '/images/products/product4.jpg', isFavorite: true },
  ];
}
