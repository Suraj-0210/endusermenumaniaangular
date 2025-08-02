import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, timeout, retry } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/api/restaurant`;

  constructor(private http: HttpClient) {
    if (environment.enableLogging) {
      console.log('RestaurantService initialized with API URL:', this.apiUrl);
    }
  }

  fetchRestaurantDetails(restaurantId: string, tableNo: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-App-Version': environment.version
    });

    if (environment.enableLogging) {
      console.log('Fetching restaurant details for:', restaurantId, 'Table:', tableNo);
    }

    return this.http.get(`${this.apiUrl}/${restaurantId}`, {
      params: { tableNo: tableNo },
      withCredentials: true,
      headers: headers,
    }).pipe(
      timeout(environment.apiTimeout),
      retry(environment.retryAttempts)
    );
  }
}
