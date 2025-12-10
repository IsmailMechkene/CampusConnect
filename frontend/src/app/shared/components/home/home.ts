import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}
