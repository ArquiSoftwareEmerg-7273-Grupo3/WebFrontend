import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface UserProfile {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  foto?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private basePath = environment.baseUrlAuth;
  
  // Cache para evitar múltiples requests del mismo usuario
  private usersCache = new Map<number, UserProfile>();

  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // GET /api/v1/users/{userId} - Get user profile by ID
  getUserById(userId: number): Observable<UserProfile> {
    // Verificar cache primero
    if (this.usersCache.has(userId)) {
      return of(this.usersCache.get(userId)!);
    }

    return this.http.get<UserProfile>(`${this.basePath}/api/v1/users/${userId}`, this.getHttpOptions())
      .pipe(
        map(user => {
          // Guardar en cache
          this.usersCache.set(userId, user);
          return user;
        }),
        catchError(error => {
          console.error(`Error fetching user ${userId}:`, error);
          // Devolver un usuario por defecto en caso de error
          const defaultUser: UserProfile = {
            id: userId,
            nombres: 'Usuario',
            apellidos: userId.toString(),
            email: '',
            foto: 'assets/images/default-avatar.png'
          };
          this.usersCache.set(userId, defaultUser);
          return of(defaultUser);
        })
      );
  }

  // Método para obtener múltiples usuarios de una vez
  getUsersByIds(userIds: number[]): Observable<UserProfile[]> {
    const uniqueIds = [...new Set(userIds)];
    const requests = uniqueIds.map(id => this.getUserById(id));
    
    // Usar forkJoin sería mejor, pero para simplicidad usaremos este approach
    return new Observable(observer => {
      const users: UserProfile[] = [];
      let completed = 0;
      
      requests.forEach((request, index) => {
        request.subscribe({
          next: (user) => {
            users[index] = user;
            completed++;
            if (completed === requests.length) {
              observer.next(users);
              observer.complete();
            }
          },
          error: (error) => {
            console.error('Error loading user:', error);
            completed++;
            if (completed === requests.length) {
              observer.next(users);
              observer.complete();
            }
          }
        });
      });
    });
  }

  // Limpiar cache si es necesario
  clearCache(): void {
    this.usersCache.clear();
  }
}