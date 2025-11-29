import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlanRequest {
    reason: string;
    autoRecurringAmount: number;
    backUrl: string;
}

export interface PlanResponse {
    planId: string;
    reason: string;
    autoRecurringAmount: number;
    frequency: string;
    status: string;
    initPoint: string;
    message?: string;
}

export interface SubscriptionRequest {
    preapprovalPlanId: string;
    cardTokenId: string;
    email: string;
    backUrl: string;
}

export interface SubscriptionResponse {
    subscriptionId: string;
    customerId?: string;
    status: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MercadopagoService {
    private apiUrl = 'http://localhost:8085/api/mercadopago/subscriptions';

    constructor(private http: HttpClient) { }

    /**
     * Crear un plan de suscripción mensual de 50 soles
     */
    createPlan(planData: PlanRequest): Observable<PlanResponse> {
        return this.http.post<PlanResponse>(`${this.apiUrl}/plans`, planData);
    }

    /**
     * Obtener información de un plan
     */
    getPlan(planId: string): Observable<PlanResponse> {
        return this.http.get<PlanResponse>(`${this.apiUrl}/plans/${planId}`);
    }

    /**
     * Crear una suscripción asociada a un plan
     */
    createSubscription(subscriptionData: SubscriptionRequest): Observable<SubscriptionResponse> {
        return this.http.post<SubscriptionResponse>(this.apiUrl, subscriptionData);
    }

    /**
     * Obtener información de una suscripción
     */
    getSubscription(subscriptionId: string): Observable<SubscriptionResponse> {
        return this.http.get<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}`);
    }

    /**
     * Cancelar una suscripción
     */
    cancelSubscription(subscriptionId: string): Observable<SubscriptionResponse> {
        return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/cancel`, {});
    }

    /**
     * Pausar una suscripción
     */
    pauseSubscription(subscriptionId: string): Observable<SubscriptionResponse> {
        return this.http.post<SubscriptionResponse>(`${this.apiUrl}/${subscriptionId}/pause`, {});
    }

    /**
     * Crear una preferencia de pago (Checkout Pro - pago único)
     * Mejor para pruebas que suscripciones
     */
    createPreference(preferenceData: any): Observable<any> {
        return this.http.post<any>('http://localhost:8085/api/mercadopago/preferences', preferenceData);
    }
}
