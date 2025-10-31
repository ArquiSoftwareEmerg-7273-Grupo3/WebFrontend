import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserInfoResponse } from '../../login/model/user-info.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath: string = `${environment.baseUrlAuth}`;
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {}

  // Obtener información del usuario actual
  getCurrentUser(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.basePath}/users/me`, this.httpOptions);
  }

  // Obtener usuario por ID
  getUserById(userId: number): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.basePath}/users/${userId}`, this.httpOptions);
  }

  // Actualizar información del usuario
  updateUser(userId: number, userInfo: Partial<UserInfoResponse>): Observable<UserInfoResponse> {
    return this.http.put<UserInfoResponse>(`${this.basePath}/users/${userId}`, userInfo, this.httpOptions);
  }

  // Obtener usuarios por rol
  getUsersByRole(role: string): Observable<UserInfoResponse[]> {
    return this.http.get<UserInfoResponse[]>(`${this.basePath}/users/by-role/${role}`, this.httpOptions);
  }
}