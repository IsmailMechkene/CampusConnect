import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CreateShop } from './create-shop/create-shop';
import { InspectShop } from './inspect-shop/inspect-shop';

@Component({
  selector: 'app-my-shop',
  imports: [
    Header,
    Footer,
    CreateShop,
    InspectShop
  ],
  templateUrl: './my-shop.html',
  styleUrl: './my-shop.css',
})
export class MyShop {

  hasShop = false; 

  /*
  constructor(private shopService: ShopService) {}
  
  ngOnInit() {
    this.shopService.getMyShop().subscribe(shop => {
      this.hasShop = !!shop; 
    });
  }
  */
}
