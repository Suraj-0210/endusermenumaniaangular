import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'https://endusermenumania.onrender.com/api/restaurant';

  constructor(private http: HttpClient) {}

  fetchRestaurantDetails(restaurantId: string, tableNo: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${restaurantId}`, {
      params: { tableNo: tableNo },
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
