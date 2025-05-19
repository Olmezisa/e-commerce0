import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Review } from '../../products/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private url = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.url}/${productId}`);
  }

  postReview(productId: number, review: { rating: number; comment: string }): Observable<void> {
    return this.http.post<void>(this.url, {
      productId,
      rating: review.rating,
      comment: review.comment
    });
  }
}
