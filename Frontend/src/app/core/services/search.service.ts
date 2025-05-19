import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Suggestion {
  id: number;
  type: 'product' | 'seller';
  title: string;
  subtitle?: string; // örn. seller için mağaza etiketi
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  getSuggestions(query: string): Observable<Suggestion[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Suggestion[]>(`${this.baseUrl}/suggestions`, { params });
  }
}
