import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user/user';
import {Portfolio} from '../interfaces/portfolio/portfolio';
import {Offer} from '../interfaces/offer/offer';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private base = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/users/${id}`);
  }

  createUser(d: User): Observable<User> {
    return this.http.post<User>(`${this.base}/users`, d);
  }

  updateUser(id: number, d: User): Observable<User> {
    return this.http.put<User>(`${this.base}/users/${id}`, d);
  }
  editingUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.base}/users/${userId}`, user);
  }
  // Método para eliminar usuario
  deleteUser(id: string): Observable<void> {
    const url = `${this.base}/users/${encodeURIComponent(id)}`;
    return this.http.delete<void>(url);
  }
  suspendUser(userId: string): Observable<any> {
    return this.http.post(`${this.base}/users/${userId}/suspend`, {});
  }
  reactivateUser(userId: string): Observable<any> {
    return this.http.post(`${this.base}/users/${userId}/reactivate`, {});
  }
  changeUserRole(userId: string, role: User['role']): Observable<any> {
    return this.http.put(`${this.base}/users/${userId}/role`, { role });
  }
  // Asegurar que la variante updateUserRole use la misma ruta correcta
  updateUserRole(userId: string | number, role: string): Observable<any> {
    return this.http.put(`${this.base}/users/${userId}/role`, { role });
  }
  // Roles (getRolUsers parece innecesario, revisa su uso)
  getRolUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}`);
  }

  // Reports
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.base}/reports`);
  }
  getReport(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.base}/reports/${id}`);
  }
  resolveReport(id: string, action: 'delete' | 'dismiss' | 'flag' | 'removeUser'): Observable<any> {
    return this.http.post(`${this.base}/reports/${id}/resolve`, { action });
  }


  // Portfolio
  getPortfolio(id: string): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.base}/portfolios/${id}`);
  }
  getPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.base}/portfolios`);
  }
  flagPortfolio(id: string): Observable<any> {
    return this.http.post(`${this.base}/portfolios/${id}/flag`, {});
  }
  removePortfolio(id: string): Observable<any> {
    return this.http.delete(`${this.base}/portfolios/${id}`);
  }

  // Offers
  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.base}/offers`);
  }

  removeOffer(id: string): Observable<any> {
    return this.http.delete(`${this.base}/offers/${id}`);
  }
  markOfferFlagged(id: string): Observable<any> {
    return this.http.post(`${this.base}/offers/${id}/flag`, {});
  }


}
