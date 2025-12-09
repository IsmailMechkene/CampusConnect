import { Component } from '@angular/core';
import { CreateBoutiqueComponent } from './create-boutique-component/create-boutique-component';

@Component({
  selector: 'app-create-shop',
  imports: [
    CreateBoutiqueComponent,
  ],
  templateUrl: './create-shop.html',
  styleUrl: './create-shop.css',
})
export class CreateShop {

}
