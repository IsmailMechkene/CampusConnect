import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { HeroSection } from './components/hero-section/hero-section';
import { BenefitsSection } from './components/benefits-section/benefits-section';
import { FeaturedShops } from './components/featured-shops/featured-shops';
import { TrendingSection } from "./components/trending-section/trending-section";

@Component({
    selector: 'app-marketplace',
    imports: [
    Header,
    HeroSection,
    BenefitsSection,
    FeaturedShops,
    TrendingSection
],
    templateUrl: './marketplace.html',
    styleUrl: './marketplace.css',
})
export class Marketplace {

}
