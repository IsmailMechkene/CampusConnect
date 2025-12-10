import { Component } from '@angular/core';
import { ProductComponent } from '../../../../shared/components/product-component/product-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule, ProductComponent],
  templateUrl: './new-arrivals.html',
  styleUrl: './new-arrivals.css',
})
export class NewArrivals {
  newarrivals = [
    { id: 1, name: 'Stickers', brand: 'StickNation', price: 29.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/sticker.png', isFavorite: false },
    { id: 2, name: 'bracelets', brand: 'bracelet.hand.made', price: 49.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product2.png', isFavorite: true },
    { id: 3, name: 'Ring', brand: 'SilVerr', price: 29.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/ring.jpg', isFavorite: false },
    { id: 4, name: 'Notebooks', brand: 'El Waraq', price: 99.99, currency: 'TND', rating: 5.0, imageUrl: '/images/products/notebook.jpg', isFavorite: true },
  ];

}
