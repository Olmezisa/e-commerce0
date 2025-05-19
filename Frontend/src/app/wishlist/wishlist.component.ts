import { Component, OnInit } from '@angular/core';
import { Product } from '../products/models/product.model';
import { WishlistService } from '../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  items:Product[]=[];

  constructor(private wishList:WishlistService){}

  ngOnInit(){
    this.wishList.items$.subscribe(list =>
      this.items=list
    );

  }

}
