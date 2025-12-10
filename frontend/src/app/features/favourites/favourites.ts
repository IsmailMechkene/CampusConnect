import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FavouriteApiService, ProductDto, StoreDto } from '../../services/favourite-api.service';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Header, Footer],
  templateUrl: './favourites.html',
  styleUrls: ['./favourites.css'],
})
export class Favourites {

}
