import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  onCategorySelected(cat: { id: number; name: string } | null) {
    if (cat?.id) {
      this.router.navigate(['/products'], { queryParams: { category: cat.id } });
    } else {
      this.router.navigate(['/products']);
    }
  }
}
