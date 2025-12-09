import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CreateShop } from './create-shop/create-shop';
import { InspectShop } from './inspect-shop/inspect-shop';
import { ShopService, ShopStatusResponse, Shop } from '../../services/shopService.service';

@Component({
  selector: 'app-my-shop',
  imports: [
    Header,
    Footer,
    CreateShop,
    InspectShop
  ],
  templateUrl: './my-shop.html',
  styleUrls: ['./my-shop.css'],
})
export class MyShop implements OnInit {

  hasShop = false;
  myShop?: Shop;

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.shopService.hasShop().subscribe((resp: ShopStatusResponse) => {
      this.hasShop = !!resp.hasShop;
      if (resp.shop) this.myShop = resp.shop;
    });

    this.shopService.getMyShop().subscribe((shop: Shop) => {
      this.hasShop = true;
      this.myShop = shop;
    });
  }
}
