import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { CategoryQuickLinksComponent } from './components/category-quick-links/category-quick-links.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsModule } from '../products/products.module';
import { CategoryComponent } from './components/category/category.component';



@NgModule({
  declarations: [
    HomeComponent,
    BestSellersComponent,
    CategoryQuickLinksComponent,
    HeroCarouselComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ProductsModule,

  ],

})
export class HomeModule { }
