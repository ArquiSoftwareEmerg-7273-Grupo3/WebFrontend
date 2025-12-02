import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface SubscriptionStatus {
  userId: number;
  hasActiveSubscription: boolean;
  subscriptionActive: boolean;
  userType: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionStatusService {
  private apiUrl = 'http://localhost:8080/api/v1/subscriptions';
  private subscriptionStatusCache = new BehaviorSubject<Map<number, boolean>>(new Map());

  constructor(private http: HttpClient) {}

  /**
   * Check if a user has an active subscription
   */
  checkSubscriptionStatus(userId: number): Observable<boolean> {
    // Check cache first
    const cached = this.subscriptionStatusCache.value.get(userId);
    if (cached !== undefined) {
      return of(cached);
    }

    return this.http.get<SubscriptionStatus>(`${this.apiUrl}/status/${userId}`).pipe(
      map(response => response.hasActiveSubscription || response.subscriptionActive || false),
      tap(hasSubscription => {
        // Update cache
        const cache = this.subscriptionStatusCache.value;
        cache.set(userId, hasSubscription);
        this.subscriptionStatusCache.next(cache);
      }),
      catchError(error => {
        console.error('Error checking subscription status:', error);
        return of(false);
      })
    );
  }

  /**
   * Get full subscription status details
   */
  getSubscriptionDetails(userId: number): Observable<SubscriptionStatus | null> {
    return this.http.get<SubscriptionStatus>(`${this.apiUrl}/status/${userId}`).pipe(
      catchError(error => {
        console.error('Error getting subscription details:', error);
        return of(null);
      })
    );
  }

  /**
   * Clear cache for a specific user
   */
  clearCache(userId: number): void {
    const cache = this.subscriptionStatusCache.value;
    cache.delete(userId);
    this.subscriptionStatusCache.next(cache);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.subscriptionStatusCache.next(new Map());
  }

  /**
   * Check if current logged-in user has subscription
   */
  checkCurrentUserSubscription(): Observable<boolean> {
    const userDataStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    
    if (!userDataStr) {
      return of(false);
    }

    try {
      const userData = JSON.parse(userDataStr);
      const userId = userData.id;
      
      if (!userId) {
        return of(false);
      }

      return this.checkSubscriptionStatus(userId);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return of(false);
    }
  }
}
