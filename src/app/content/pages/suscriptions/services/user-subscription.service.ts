import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ActivateSubscriptionRequest {
    userId: string;
    userEmail: string;
    userType: 'ILUSTRADOR' | 'ESCRITOR';
    mercadoPagoSubscriptionId: string;
    mercadoPagoPlanId: string;
}

export interface SubscriptionCheckResponse {
    userId: string;
    hasActiveSubscription: boolean;
    subscription: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserSubscriptionService {
    private apiUrl = 'http://localhost:8085/api/user-subscriptions';

    constructor(private http: HttpClient) { }

    /**
     * Activar suscripción para un usuario
     */
    activateSubscription(request: ActivateSubscriptionRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/activate`, request);
    }

    /**
     * Verificar si un usuario tiene suscripción activa
     */
    checkSubscription(userId: string): Observable<SubscriptionCheckResponse> {
        return this.http.get<SubscriptionCheckResponse>(`${this.apiUrl}/check/${userId}`);
    }

    /**
     * Obtener detalles de la suscripción
     */
    getSubscriptionDetails(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/details/${userId}`);
    }

    /**
     * Cancelar suscripción
     */
    cancelSubscription(userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/cancel/${userId}`, {});
    }
}
