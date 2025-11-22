import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { Home } from '../../shared/components/home/home';

@Component({
  selector: 'app-main-home',
  imports: [
    Header,
    Home,
  ],
  templateUrl: './main-home.html',
  styleUrl: './main-home.css',
})
export class MainHome {

}
