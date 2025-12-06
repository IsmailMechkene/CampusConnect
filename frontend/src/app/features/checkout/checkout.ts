import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CartItem, CartSummary } from '../../shared/models/cart-item.model';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit, OnDestroy {
  
  cartItems: CartItem[] = [];

  cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    shipping: 0,
    total: 0
  };

  //Subject for component cleanup

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  //Component initialization
  ngOnInit(): void {
    // Subscribe to cart items
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
      });

    // Subscribe to cart summary
    this.cartService.getCartSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.cartSummary = summary;
      });
  }

  // Component cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getItemSubtotal(item: CartItem): number {
    return this.cartService.getItemSubtotal(item);
  }

  increaseQuantity(cartItemId: string): void {
    this.cartService.increaseQuantity(cartItemId);
  }

  decreaseQuantity(cartItemId: string): void {
    this.cartService.decreaseQuantity(cartItemId);
  }

  removeItem(cartItemId: string): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeItem(cartItemId);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire shopping cart?')) {
      this.cartService.clearCart();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/marketplace']);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // TODO : navigate to payment/shipping page
    console.log('Proceeding to checkout with items:', this.cartItems);
    console.log('Total amount:', this.cartSummary.total);
    
    alert(`Checkout successful! Total: ${this.cartSummary.total.toFixed(2)} DT`);
    
    // Clear cart after successful checkout
    this.cartService.clearCart();
    
    // Navigate back to marketplace
    this.router.navigate(['/marketplace']);
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}