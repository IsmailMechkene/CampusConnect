import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { HeroSection } from './components/hero-section/hero-section';
import { FeaturedShops } from './components/featured-shops/featured-shops';
import { TrendingSection } from "./components/trending-section/trending-section";
import { Footer } from '../../shared/components/footer/footer';
import { NewArrivals } from './components/new-arrivals/new-arrivals';

@Component({
    selector: 'app-marketplace',
    imports: [
    Header,
    HeroSection,
    NewArrivals,
    FeaturedShops,
    TrendingSection,
    Footer,
],
    templateUrl: './marketplace.html',
    styleUrl: './marketplace.css',
})
export class Marketplace {

}
