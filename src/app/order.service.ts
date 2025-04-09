import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseURL: string = 'https://endusermenumania.onrender.com';
  private eventSource: EventSource | null = null;

  constructor(private zone: NgZone) {}

  getOrdersFromDb(sessionId: string): Observable<any> {
    const url = `${this.baseURL}/api/orders/${sessionId}`;
    return new Observable<any>((observer) => {
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          const parsedData = JSON.parse(event.data);
          observer.next(parsedData);
        });
      };

      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.error('SSE error:', error);
          this.eventSource?.close();
          observer.error(error);
        });
      };

      return () => {
        this.eventSource?.close();
        this.eventSource = null;
      };
    });
  }

  closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('EventSource connection closed.');
    }
  }

  // ✅ Send Order to Backend
  async sendOrderToBackend(
    confirmedOrders: any[],
    restaurantId: string,
    tableNo: string,
    sessionId: string,
    paymentId: string,
    message: string
  ): Promise<any> {
    try {
      const body = {
        dishes: confirmedOrders,
        restaurantId,
        tableNo,
        sessionId,
        paymentId,
        status: 'Completed',
        message,
      };

      const response = await fetch(`${this.baseURL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to place order.');
      }

      const result = await response.json();
      console.log('✅ Order created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to create order:', error);
      throw error;
    }
  }
}
