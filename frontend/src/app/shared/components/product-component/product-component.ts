import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
  imports: [
    RouterModule,  
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent {
  @Input() product!: Product;
  isFavorited = false;

  productId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isFavorited = this.product.isFavorite || false;
    this.productId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.productId);
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
