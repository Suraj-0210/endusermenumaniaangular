import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private BASE_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
    if (environment.enableLogging) {
      console.log('DishService initialized with BASE_URL:', this.BASE_URL);
    }
  }

  fetchAllDishes(restaurantId: string | null): Observable<any> {
    const url = `${this.BASE_URL}/api/dish/${restaurantId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-App-Version': environment.version,
    });

    if (environment.enableLogging) {
      console.log('Fetching dishes for restaurant:', restaurantId);
    }

    return this.http.get(url, { headers }).pipe(
      timeout(environment.apiTimeout),
      retry(environment.retryAttempts),
      catchError((error) => {
        if (environment.enableLogging) {
          console.error('Failed to fetch dishes', error);
        }
        return throwError(() => new Error('Failed to fetch dishes.'));
      })
    );
  }
}
