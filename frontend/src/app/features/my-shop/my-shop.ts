import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CreateShop } from './create-shop/create-shop';
import { InspectShop } from './inspect-shop/inspect-shop';
import { ShopService, ShopStatusResponse} from '../../services/shopService.service';
import { Shop } from '../../shared/models/shop.model';

@Component({
  selector: 'app-my-shop',
  imports: [Header, Footer, CreateShop, InspectShop],
  templateUrl: './my-shop.html',
  styleUrls: ['./my-shop.css'],
})
export class MyShop implements OnInit {
  hasShop = false;
  myShop?: Shop; //'Shop | undefined'

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.shopService.hasShop().subscribe({
      next: (resp: ShopStatusResponse) => {
        this.hasShop = resp.hasShop;
        // Assurez-vous que shop n'est jamais null
        if (resp.shop) {
          this.myShop = resp.shop;
        }
      },
      error: (err) => {
        console.error('Error checking shop status:', err);
        this.hasShop = false;
        this.myShop = undefined;
      },
    });
  }
}
