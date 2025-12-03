import { Component, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';


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

  quantity = signal(1);
  selectedImage = signal('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600');
  selectedColor = signal('#E91E63');
  selectedSize = signal('M');
  activeTab = signal('Description');

  tabs = ['Description', 'Specifications', 'Reviews'];

  product = {
    name: 'Cat Bracelet',
    category: 'Accessories',
    price: 12.99,
    originalPrice: 18.99,
    description: 'Handcrafted beaded bracelet with cute cat charm. Perfect accessory for cat lovers and students who want to add personality to their style.',
    fullDescription: 'This adorable cat bracelet features high-quality beads and a charming cat pendant. Each piece is carefully handcrafted by local campus artisans. The adjustable design ensures a comfortable fit for any wrist size. Made with durable materials that are perfect for everyday wear.',
    reviews: 48,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=600',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'
    ],
    colors: ['#E91E63', '#9C27B0', '#2196F3', '#4CAF50'],
    sizes: ['S', 'M', 'L'],
    specifications: [
      { label: 'Material', value: 'Glass beads, metal charm' },
      { label: 'Length', value: 'Adjustable 6-8 inches' },
      { label: 'Weight', value: '15g' },
      { label: 'Care', value: 'Avoid water exposure' }
    ]
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

  addToCart() {
    console.log('Added to cart:', {
      product: this.product.name,
      quantity: this.quantity(),
      color: this.selectedColor(),
      size: this.selectedSize()
    });
    alert(`${this.quantity()} item(s) added to cart!`);
  }

  buyNow() {
    console.log('Buy now:', {
      product: this.product.name,
      quantity: this.quantity(),
      color: this.selectedColor(),
      size: this.selectedSize()
    });
    alert('Proceeding to checkout...');
  }
}
