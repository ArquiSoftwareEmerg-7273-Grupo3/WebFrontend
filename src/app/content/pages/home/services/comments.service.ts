import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Interfaces para Comments
export interface Comments {
  id: number;
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface CommentReply extends Comments {
  replies?: CommentReply[];
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
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

  // ==================== COMMENTS ENDPOINTS ====================

  // GET /api/v1/posts/{postId}/comments - Get comments for a post
  getCommentsForPost(postId: number, page?: number, size?: number): Observable<Comments[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Comments[]>(`${this.basePath}/api/v1/posts/${postId}/comments`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching comments for post ${postId}:`, error);
        throw error;
      })
    );
  }

  // POST /api/v1/posts/{postId}/comments - Create a comment on a post
  createComment(postId: number, commentRequest: CreateCommentRequest): Observable<Comments> {
    return this.http.post<Comments>(`${this.basePath}/api/v1/posts/${postId}/comments`, commentRequest, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error creating comment on post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/users/{userId}/comments - Get comments by user
  getCommentsByUser(userId: number, page?: number, size?: number): Observable<Comments[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Comments[]>(`${this.basePath}/api/v1/users/${userId}/comments`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching comments by user ${userId}:`, error);
        throw error;
      })
    );
  }

  // GET /api/v1/comments/{commentId} - Get comment by ID
  getCommentById(commentId: number): Observable<Comments> {
    return this.http.get<Comments>(`${this.basePath}/api/v1/comments/${commentId}`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error fetching comment ${commentId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/comments/{commentId}/replies - Get replies for a comment
  getCommentReplies(commentId: number, page?: number, size?: number): Observable<CommentReply[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<CommentReply[]>(`${this.basePath}/api/v1/comments/${commentId}/replies`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching replies for comment ${commentId}:`, error);
        throw error;
      })
    );
  }

  // DELETE /api/v1/comments/{commentId} - Delete a comment
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.basePath}/api/v1/comments/${commentId}`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error deleting comment ${commentId}:`, error);
          throw error;
        })
      );
  }

  // ==================== HELPER METHODS ====================

  // Crear una respuesta a un comentario (usando parentCommentId)
  createReply(postId: number, parentCommentId: number, content: string): Observable<Comments> {
    const replyRequest: CreateCommentRequest = {
      content,
      parentCommentId
    };

    return this.createComment(postId, replyRequest);
  }
}