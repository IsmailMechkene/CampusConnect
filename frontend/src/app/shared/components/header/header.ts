import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  lastScrollY = 0;
  hideHeader = false;

  cartItemCount = 0;


  // Subject for component cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }


  // Component initialization
  ngOnInit(): void {
    // Subscribe to cart item count
    this.cartService.cartItemCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartItemCount = count;
      });
  }

  // Component cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToCart(): void {
    this.router.navigate(['/checkout']);
  }

  navigateToMyShop(): void {
    this.router.navigate(['/my-shop']);
  }


  navigateToFavorites(): void {
    this.router.navigate(['/favourites']);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > this.lastScrollY && currentScroll > 200) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }

    this.lastScrollY = currentScroll;
  }
}
