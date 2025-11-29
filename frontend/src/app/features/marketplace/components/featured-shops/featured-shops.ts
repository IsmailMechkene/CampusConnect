import { Component } from '@angular/core';
import { ShopComponent } from "../../../../shared/components/shop-component/shop-component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-featured-shops',
    imports: [
        ShopComponent,
        CommonModule
    ],
    templateUrl: './featured-shops.html',
    styleUrl: './featured-shops.css',
})
export class FeaturedShops {
    colors = [
        '#FADED2',
        '#A1B8E9', 
        '#D4627F', 
        '#D2A899', 
        '#DC97A5', 
        '#EFC9B9' 
    ];

    shops = [
        { name: 'Crafty Creations', background: this.colors[0] },
        { name: 'Urban Styles', background: this.colors[1] },
        { name: 'Vintage Vibes', background: this.colors[2] },
        { name: 'Tech Trends', background: this.colors[3] },
        { name: 'Book Nook', background: this.colors[4] },
        { name: 'Fitness Hub', background: this.colors[5] },
    ];
}
