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
    { id: 1, name: 'Product A', brand: 'Brand A', price: 29.99, currency: 'USD', rating: 4.5, imageUrl: 'url_to_image_A', isFavorite: false },
    { id: 2, name: 'Product B', brand: 'Brand B', price: 49.99, currency: 'USD', rating: 4.0, imageUrl: 'url_to_image_B', isFavorite: true },
    { id: 3, name: 'Product C', brand: 'Brand C', price: 19.99, currency: 'USD', rating: 3.5, imageUrl: 'url_to_image_C' },
    { id: 4, name: 'Product D', brand: 'Brand D', price: 99.99, currency: 'USD', rating: 5.0, imageUrl: 'url_to_image_D', isFavorite: true },
  ];
}
