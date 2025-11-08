import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Interfaces para Reactions
export interface Reactions {
  postId: number;
  reactionType: string;
}

export interface CreateReactionRequest {
  reactionType: string;
}

export interface ReactionStats {
  reactionType: string;
  count: number;
}

export interface UserReaction {
  userId: number;
  postId: number;
  reactionType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private basePath: string = `${environment.baseUrlAuth}`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      })
    };
  }

  // ==================== REACTIONS ENDPOINTS ====================

  // POST /api/v1/posts/{postId}/reactions - Add or update reaction to a post
  addOrUpdateReaction(postId: number, reactionRequest: CreateReactionRequest): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/posts/${postId}/reactions`, reactionRequest, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error adding/updating reaction to post ${postId}:`, error);
          throw error;
        })
      );
  }

  // POST /api/v1/posts/{postId}/reactions/toggle/{reactionType} - Toggle reaction (add if not exists, remove if same type, change if different)
  toggleReaction(postId: number, reactionType: string): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/posts/${postId}/reactions/toggle/${reactionType}`, {}, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error toggling reaction ${reactionType} on post ${postId}:`, error);
          throw error;
        })
      );
  }

  // DELETE /api/v1/posts/{postId}/reactions - Remove reaction from a post
  removeReaction(postId: number): Observable<any> {
    return this.http.delete(`${this.basePath}/api/v1/posts/${postId}/reactions`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error removing reaction from post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId}/reactions/users/{userId} - Get user's reaction to a post
  getUserReactionToPost(postId: number, userId: number): Observable<UserReaction | null> {
    return this.http.get<UserReaction>(`${this.basePath}/api/v1/posts/${postId}/reactions/users/${userId}`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          // Si no hay reacción, probablemente retorne 404
          if (error.status === 404) {
            return of(null);
          }
          console.error(`Error fetching user ${userId} reaction to post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId}/reactions/types - Get all available reaction types
  getAvailableReactionTypes(postId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.basePath}/api/v1/posts/${postId}/reactions/types`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error fetching reaction types for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId}/reactions/stats - Get reaction statistics for a post
  getReactionStats(postId: number): Observable<ReactionStats[]> {
    return this.http.get<ReactionStats[]>(`${this.basePath}/api/v1/posts/${postId}/reactions/stats`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error fetching reaction stats for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // ==================== CONVENIENCE METHODS ====================

  // Métodos de conveniencia para reacciones comunes
  likePost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'LIKE');
  }

  dislikePost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'DISLIKE');
  }

  lovePost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'LOVE');
  }

  laughPost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'LAUGH');
  }

  angryPost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'ANGRY');
  }

  sadPost(postId: number): Observable<any> {
    return this.toggleReaction(postId, 'SAD');
  }

  // Obtener el total de reacciones de un post
  getTotalReactionsCount(postId: number): Observable<number> {
    return new Observable(observer => {
      this.getReactionStats(postId).subscribe({
        next: (stats) => {
          const total = stats.reduce((sum, stat) => sum + stat.count, 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}