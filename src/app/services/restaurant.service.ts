import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/api/restaurant`;

  constructor(private http: HttpClient) {}

  fetchRestaurantDetails(restaurantId: string, tableNo: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${restaurantId}`, {
      params: { tableNo: tableNo },
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
