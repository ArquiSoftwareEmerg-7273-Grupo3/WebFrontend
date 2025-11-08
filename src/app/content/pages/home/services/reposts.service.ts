import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Interfaces para Reposts
export interface Repost {
  postId: number;
  commentId?: number;
}

export interface CreateRepostRequest {
  postId: number;
  commentId?: number; // Para repostear un comentario específico
}

export interface RepostInfo {
  id: number;
  originalPostId: number;
  userId: number;
  createdAt: string;
  commentId?: number;
}

export interface RepostStatus {
  hasReposted: boolean;
  repostCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RepostsService {
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

  // ==================== REPOSTS ENDPOINTS ====================

  // POST /api/v1/posts/{postId}/reposts - Repost a post
  createRepost(postId: number, commentId?: number): Observable<RepostInfo> {
    const repostRequest: CreateRepostRequest = {
      postId,
      commentId
    };

    return this.http.post<RepostInfo>(`${this.basePath}/api/v1/posts/${postId}/reposts`, repostRequest, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error creating repost for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // POST /api/v1/posts/{postId}/reposts/toggle - Toggle repost (add if not exists, remove if exists)
  toggleRepost(postId: number): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/posts/${postId}/reposts/toggle`, {}, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error toggling repost for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // DELETE /api/v1/posts/{postId}/reposts - Remove repost
  removeRepost(postId: number): Observable<any> {
    return this.http.delete(`${this.basePath}/api/v1/posts/${postId}/reposts`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error removing repost for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId}/reposts - Get reposts for a post
  getRepostsForPost(postId: number, page?: number, size?: number): Observable<RepostInfo[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<RepostInfo[]>(`${this.basePath}/api/v1/posts/${postId}/reposts`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching reposts for post ${postId}:`, error);
        throw error;
      })
    );
  }

  // GET /api/v1/users/{userId}/reposts - Get reposts by user
  getRepostsByUser(userId: number, page?: number, size?: number): Observable<RepostInfo[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<RepostInfo[]>(`${this.basePath}/api/v1/users/${userId}/reposts`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching reposts by user ${userId}:`, error);
        throw error;
      })
    );
  }

  // GET /api/v1/reposts/recent - Get recent reposts
  getRecentReposts(page?: number, size?: number): Observable<RepostInfo[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<RepostInfo[]>(`${this.basePath}/api/v1/reposts/recent`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error('Error fetching recent reposts:', error);
        throw error;
      })
    );
  }

  // GET /api/v1/posts/{postId}/reposts/status - Check if user has reposted a post
  getRepostStatus(postId: number): Observable<RepostStatus> {
    return this.http.get<RepostStatus>(`${this.basePath}/api/v1/posts/${postId}/reposts/status`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error checking repost status for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId}/reposts/count - Get repost count for a post
  getRepostCount(postId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.basePath}/api/v1/posts/${postId}/reposts/count`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error fetching repost count for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // ==================== CONVENIENCE METHODS ====================

  // Repostear un post simple (sin comentario)
  repostPost(postId: number): Observable<RepostInfo> {
    return this.createRepost(postId);
  }

  // Repostear un post con un comentario específico
  repostPostWithComment(postId: number, commentId: number): Observable<RepostInfo> {
    return this.createRepost(postId, commentId);
  }

  // Verificar si el usuario actual ha reposteado un post
  hasUserReposted(postId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getRepostStatus(postId).subscribe({
        next: (status) => {
          observer.next(status.hasReposted);
          observer.complete();
        },
        error: (error) => {
          // En caso de error, asumir que no ha reposteado
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  // Obtener el número total de reposts de un post
  getTotalRepostCount(postId: number): Observable<number> {
    return new Observable(observer => {
      this.getRepostCount(postId).subscribe({
        next: (result) => {
          observer.next(result.count);
          observer.complete();
        },
        error: (error) => {
          observer.next(0);
          observer.complete();
        }
      });
    });
  }
}