import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseURL: string = `${environment.apiUrl}`;
  private eventSource: EventSource | null = null;

  constructor(private zone: NgZone) {
    if (environment.enableLogging) {
      console.log('OrderService initialized with baseURL:', this.baseURL);
      console.log(
        'Real-time updates enabled:',
        environment.features.enableRealTimeUpdates
      );
    }
  }

  getOrdersFromDb(sessionId: string): Observable<any> {
    if (!environment.features.enableRealTimeUpdates) {
      if (environment.enableLogging) {
        console.warn('Real-time updates are disabled in this environment');
      }
      return new Observable<any>((observer) => {
        observer.error(new Error('Real-time updates are disabled'));
      });
    }

    const url = `${this.baseURL}/api/orders/${sessionId}`;
    if (environment.enableLogging) {
      console.log('Establishing SSE connection to:', url);
    }

    return new Observable<any>((observer) => {
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          const parsedData = JSON.parse(event.data);
          if (environment.enableLogging) {
            console.log('Received SSE data:', parsedData);
          }
          observer.next(parsedData);
        });
      };

      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          if (environment.enableLogging) {
            console.error('SSE error:', error);
          }
          this.eventSource?.close();
          observer.error(error);
        });
      };

      return () => {
        this.eventSource?.close();
        this.eventSource = null;
        if (environment.enableLogging) {
          console.log('SSE connection closed');
        }
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
        appVersion: environment.version,
      };

      if (environment.enableLogging) {
        console.log('Sending order to backend:', body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        environment.apiTimeout
      );

      const response = await fetch(`${this.baseURL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Version': environment.version,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to place order.');
      }

      const result = await response.json();
      if (environment.enableLogging) {
        console.log('✅ Order created successfully:', result);
      }
      return result;
    } catch (error) {
      if (environment.enableLogging) {
        console.error('❌ Failed to create order:', error);
      }
      throw error;
    }
  }
}
