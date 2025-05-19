import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  standalone: false,
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent {
  slides = [
    {
      title: 'Exclusive Sale',
      subtitle: 'Save Big',
      discount: 'Up to 20% Off',
      image: 'assets/hero1.jpg'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Trend Fashion',
      discount: 'Check out now',
      image: 'assets/hero2.jpg'
    }
  ];
}
