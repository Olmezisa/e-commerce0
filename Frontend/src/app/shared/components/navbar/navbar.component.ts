import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isClickedNavbar = false;
  categories: Category[] = [];

  constructor(
    private el: ElementRef,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('❌ Kategoriler alınamadı:', err)
    });
  }

  isClicked() {
    this.isClickedNavbar = !this.isClickedNavbar;
  }

  onCategory(cat: Category) {
    this.router.navigate(['/products'], { queryParams: { category: cat.id } });
    this.isClickedNavbar = false;
  }

  @HostListener('document:click', ['$event.target'])
  handleOutsideClick(target: HTMLElement) {
    if (this.isClickedNavbar && !this.el.nativeElement.contains(target)) {
      this.isClickedNavbar = false;
    }
  }
}
