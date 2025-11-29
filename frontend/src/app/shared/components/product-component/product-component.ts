import { Component, Input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  currency: string;
  rating: number;
  imageUrl: string;
  isFavorite?: boolean;
}
@Component({
  selector: 'app-product-component',
  imports: [],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent {
  @Input() product!: Product;
  isFavorited = false;

  ngOnInit() {
    this.isFavorited = this.product.isFavorite || false;
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    // Emit event or call service to update favorite status
    console.log('Favorite toggled:', this.isFavorited);
  }

  onSeeProduct() {
    // Navigate to product details or emit event
    console.log('See product clicked:', this.product.id);
  }
}
