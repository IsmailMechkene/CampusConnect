import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartSummary } from '../shared/models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private readonly SHIPPING_COST = 10.00;

  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());

  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  public cartItemCount$: Observable<number> = this.cartItems$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  constructor() {
    // Subscribe to cart changes to save to storage
    this.cartItems$.subscribe(items => {
      this.saveCartToStorage(items);
    });
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: CartItem): void {
    const currentItems = this.getCartItems();
    const existingItemIndex = currentItems.findIndex(i => i.productId === item.productId);

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      // New item, add to cart
      currentItems.push(item);
    }

    // Create a new array to trigger observable updates
    this.cartItemsSubject.next([...currentItems]);
  }

  updateQuantity(cartItemId: string, quantity: number): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(i => i.id === cartItemId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        this.removeItem(cartItemId);
      } else {
        currentItems[itemIndex].quantity = quantity;
        this.cartItemsSubject.next([...currentItems]);
      }
    }
  }

  increaseQuantity(cartItemId: string): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(i => i.id === cartItemId);

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity += 1;
      this.cartItemsSubject.next([...currentItems]);
    }
  }

  decreaseQuantity(cartItemId: string): void {
    const currentItems = this.getCartItems();
    const itemIndex = currentItems.findIndex(i => i.id === cartItemId);

    if (itemIndex > -1) {
      if (currentItems[itemIndex].quantity > 1) {
        currentItems[itemIndex].quantity -= 1;
        this.cartItemsSubject.next([...currentItems]);
      } else {
        // Remove item if quantity becomes 0
        this.removeItem(cartItemId);
      }
    }
  }

  removeItem(cartItemId: string): void {
    const currentItems = this.getCartItems();
    const updatedItems = currentItems.filter(i => i.id !== cartItemId);
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getCartSummary(): Observable<CartSummary> {
    return this.cartItems$.pipe(
      map(items => {
        const itemCount = items.reduce((count, item) => count + item.quantity, 0);
        const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const shipping = items.length > 0 ? this.SHIPPING_COST : 0;
        const total = subtotal + shipping;

        return {
          itemCount,
          subtotal,
          shipping,
          total
        };
      })
    );
  }

  getItemSubtotal(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const cartData = localStorage.getItem('campus_cart');
      return cartData ? JSON.parse(cartData) : this.getMockCartItems();
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return this.getMockCartItems();
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('campus_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private getMockCartItems(): CartItem[] {
    return [
      {
        id: 'cart-1',
        productId: '2',
        name: 'Golden bracelet',
        description: 'Bracelet shop',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
        unitPrice: 12.00,
        quantity: 2,
        shopName: 'Bracelet shop'
      },
      {
        id: 'cart-2',
        productId: '1',
        name: 'Makeup',
        description: 'Bracelet shop',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        unitPrice: 25.00,
        quantity: 1,
        shopName: 'Beauty shop'
      },
      {
        id: 'cart-3',
        productId: '4',
        name: 'Earbugs',
        description: 'Bracelet shop',
        image: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop',
        unitPrice: 40.00,
        quantity: 2,
        shopName: 'Electronics shop'
      }
    ];
  }
}