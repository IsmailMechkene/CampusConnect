import { Component, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CartItem } from '../../shared/models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-preview',
  imports: [
    Header,
    Footer,
  ],
  templateUrl: './product-preview.html',
  styleUrl: './product-preview.css',
})
export class ProductPreview {

  constructor(private cartService: CartService, private router: Router) { }

  quantity = signal(1);
  selectedImage = signal('/images/bracelet-shop/red.png');
  selectedColor = signal('#E91E63');
  selectedSize = signal('M');
  activeTab = signal('Description');

  tabs = ['Description', 'Specifications', 'Reviews'];

  product = {
    id: 20,
    name: 'Bracelets',
    category: 'Accessories',
    price: 29.99,
    originalPrice: 18.99,
    description: 'Handcrafted with care, this bracelet blends simplicity and elegance in every detail. Designed to elevate any outfit, it’s the perfect everyday accessory for a soft, refined touch.',
    fullDescription: 'Handcrafted with care, this bracelet blends simplicity and elegance in every detail. Each bead is thoughtfully selected to create a balanced, refined design that feels both modern and timeless. Lightweight and comfortable, it pairs effortlessly with any style — from casual outfits to dressed-up looks. Whether worn alone or stacked with your favorite pieces, it adds a soft, graceful touch that enhances your everyday aesthetic.',
    reviews: 48,
    stock: 15,
    images: [
      '/images/bracelet-shop/blue.png',
      '/images/bracelet-shop/green.png',
      '/images/bracelet-shop/purple.png',
      '/images/bracelet-shop/red.png'
    ],
    colors: ['#E91E63', '#9C27B0', '#2196F3', '#4CAF50'],
    sizes: ['S', 'M', 'L'],
    specifications: [
      { label: 'Material', value: 'High-quality beads and stainless steel accents' },
      { label: 'Fit', value: 'Adjustable for most wrist sizes' },
      { label: 'Weight', value: 'Lightweight and comfortable for daily wear' },
      { label: 'Care', value: 'Keep away from water and perfumes to maintain shine' }
    ],

    shopName: 'StickNation'
  };

  increaseQuantity() {
    if (this.quantity() < this.product.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  calculateDiscount(): number {
    return Math.round(((this.product.originalPrice! - this.product.price) / this.product.originalPrice!) * 100);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();

    // Create cart item from product
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${this.product.id}`,
      productId: this.product.id.toString(), // TODO: aggree on productId type with backend
      name: this.product.name,
      description: this.product.category,
      image: this.product.images[0],
      unitPrice: this.product.price,
      quantity: this.quantity(),
      shopName: this.product.shopName
    };

    // Add to cart
    this.cartService.addToCart(cartItem);

    // Show success message
    alert(`${this.product.name} added to cart!`);
  }

  buyNow() {
    // Create cart item from product
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${this.product.id}`,
      productId: this.product.id.toString(), // TODO: aggree on productId type with backend
      name: this.product.name,
      description: this.product.category,
      image: this.product.images[0],
      unitPrice: this.product.price,
      quantity: this.quantity(),
      shopName: this.product.shopName
    };

    // Add to cart
    this.cartService.addToCart(cartItem);

    // Show success message
    this.router.navigate(['/checkout']);
    alert('Proceeding to checkout...');
  }
}
