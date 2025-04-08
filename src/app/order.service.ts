import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseURL: string = 'https://endusermenumania.onrender.com';

  constructor(private zone: NgZone) {}

  getOrdersFromDb(sessionId: string): Observable<any> {
    const url = `${this.baseURL}/api/orders/${sessionId}`;
    return new Observable<any>((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        this.zone.run(() => {
          const parsedData = JSON.parse(event.data);
          observer.next(parsedData);
        });
      };

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.error('SSE error:', error);
          eventSource.close();
          observer.error(error);
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
