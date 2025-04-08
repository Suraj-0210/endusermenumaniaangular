import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private BASE_URL = 'https://endusermenumania.onrender.com';

  constructor(private http: HttpClient) {}

  fetchAllDishes(restaurantId: string | null): Observable<any> {
    const url = `${this.BASE_URL}/api/dish/${restaurantId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch restaurant details', error);
        return throwError(
          () => new Error('Failed to fetch restaurant details.')
        );
      })
    );
  }
}
