import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { Home } from '../../shared/components/home/home';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-main-home',
  imports: [
    Header,
    Home,
    Footer
],
  templateUrl: './main-home.html',
  styleUrl: './main-home.css',
})
export class MainHome {

}
