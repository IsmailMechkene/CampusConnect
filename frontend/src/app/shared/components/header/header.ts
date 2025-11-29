import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  lastScrollY = 0;
  hideHeader = false;

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
