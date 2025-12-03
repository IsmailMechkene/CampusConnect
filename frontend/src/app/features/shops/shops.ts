import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { ShopComponent } from '../../shared/components/shop-component/shop-component';
import { ProductComponent } from '../../shared/components/product-component/product-component';

@Component({
    selector: 'app-shops',
    imports: [
        CommonModule,
        FormsModule,
        Header,
        Footer,
        ProductComponent
    ],
    templateUrl: './shops.html',
    styleUrl: './shops.css',
})
export class Shops {
    priceRange = signal([0, 100]);

    Products = [
        { id: 1, name: 'Stickers', brand: 'StickNation', price: 29.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product1.jpg', isFavorite: false },
        { id: 2, name: 'bracelets', brand: 'bracelet.hand.made', price: 49.99, currency: 'TND', rating: 4.5, imageUrl: '/images/products/product2.png', isFavorite: true },
        { id: 3, name: 'bracelets', brand: 'SilVerr', price: 19.99, currency: 'TND', rating: 3.5, imageUrl: '/images/products/product3.jpg', isFavorite: false },
        { id: 4, name: 'Notebooks', brand: 'El Waraq', price: 99.99, currency: 'TND', rating: 5.0, imageUrl: '/images/products/product4.jpg', isFavorite: true },
    ];

    activeFilters = signal(['colorful', 'BUDGET - ELEGANT', 'In stock']);

    selectedCategories = {
        valentine: false,
        colorful: true,
        superhero: false,
        minecraft: false
    };

    availability = {
        inStock: true,
        comingSoon: false
    };

    updatePriceRange(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.priceRange.set([0, value]);
    }

    updateFilters() {
        const filters = [];

        if (this.selectedCategories.colorful) filters.push('colorful');
        if (this.selectedCategories.valentine) filters.push('valentine');
        if (this.selectedCategories.superhero) filters.push('superhero');
        if (this.selectedCategories.minecraft) filters.push('minecraft');

        filters.push('BUDGET - ELEGANT');

        if (this.availability.inStock) filters.push('In stock');
        if (this.availability.comingSoon) filters.push('Coming soon');

        this.activeFilters.set(filters);
    }

    removeFilter(filter: string) {
        this.activeFilters.update(filters => filters.filter(f => f !== filter));

        // Update checkboxes based on removed filter
        if (filter === 'colorful') this.selectedCategories.colorful = false;
        if (filter === 'valentine') this.selectedCategories.valentine = false;
        if (filter === 'superhero') this.selectedCategories.superhero = false;
        if (filter === 'minecraft') this.selectedCategories.minecraft = false;
        if (filter === 'In stock') this.availability.inStock = false;
        if (filter === 'Coming soon') this.availability.comingSoon = false;
    }

    toggleWishlist(index: number) {
        console.log('Toggled wishlist for product', index);
    }

    buyProduct(product: any) {
        console.log('Buying product:', product);
        alert(`Adding ${product.name} to cart!`);
    }
}
