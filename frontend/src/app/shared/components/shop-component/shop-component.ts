import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
    selector: 'app-shop-component',
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './shop-component.html',
    styleUrl: './shop-component.css',
})
export class ShopComponent {

    @Input() background!: string;
    @Input() shop: any;



    category: string = 'Accessories';
    brandName: string = 'Brand Name';
    description: string = '"Handcrafted bracelets made with care, combining unique designs and quality materials to bring personality and style to every outfit."';
    tags: string[] = ['Handmade', 'Gift', 'Elegant', 'Wool'];
    rating: number = 5;
    isFavorite: boolean = false;


    shopId: string = '';

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.shopId = this.route.snapshot.paramMap.get('id')!;
        console.log(this.shopId);
    }
    toggleFavorite(): void {
        this.isFavorite = !this.isFavorite;
    }

    onExploreShop(): void {
        console.log('Explore shop clicked');
        // Add your navigation logic here
    }
}
