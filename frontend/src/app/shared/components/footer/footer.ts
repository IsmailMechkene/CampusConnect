import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    NgFor
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  links = [
    { label: 'Home', url: '/home' },
    { label: 'Marketplace', url: '/marketplace' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' }
  ];

  socials = [
    { label: 'Facebook', url: '#' },
    { label: 'Instagram', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'Twitter', url: '#' }
  ];

  legal = [
    { label: 'Terms of service', url: '#' },
    { label: 'Privacy policy', url: '#' },
    { label: 'Cookie policy', url: '#' }
  ];
}
