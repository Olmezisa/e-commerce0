import { Component, Input } from '@angular/core';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: false,
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() review!: Review;
}
