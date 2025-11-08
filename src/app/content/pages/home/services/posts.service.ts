import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Importar las interfaces del componente
export interface Post {
  id: number;
  content: string;
  tags: string[];
}

export interface Comments {
  id: number;
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface Reactions {
  postId: number;
  reactionType: string;
}

export interface Repost {
  postId: number;
  commentId?: number;
}

// DTOs para las peticiones
export interface CreatePostRequest {
  content: string;
  tags?: string[];
}

export interface UpdatePostRequest {
  content: string;
  tags?: string[];
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface CreateReactionRequest {
  reactionType: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private basePath: string = `${environment.baseUrlAuth}`;
  
  // BehaviorSubjects para mantener el estado
  private postsSubject = new BehaviorSubject<Post[]>([]);
  public posts$ = this.postsSubject.asObservable();

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

  // ==================== POSTS ENDPOINTS ====================

  // GET /api/v1/posts - Get posts with filtering and pagination
  getPosts(page?: number, size?: number, tags?: string[], authorId?: number): Observable<Post[]> {
    let params = new HttpParams();
    
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());
    if (tags && tags.length > 0) params = params.set('tags', tags.join(','));
    if (authorId) params = params.set('authorId', authorId.toString());

    return this.http.get<Post[]>(`${this.basePath}/api/v1/posts`, { 
      ...this.getHttpOptions(), 
      params 
    }).pipe(
      map(posts => {
        this.postsSubject.next(posts);
        return posts;
      }),
      catchError(error => {
        console.error('Error fetching posts:', error);
        throw error;
      })
    );
  }

  // GET /api/v1/posts/feed - Get personalized feed for user
  getFeed(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.basePath}/api/v1/posts/feed`, this.getHttpOptions())
      .pipe(
        map(posts => {
          this.postsSubject.next(posts);
          return posts;
        }),
        catchError(error => {
          console.error('Error fetching feed:', error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/trending - Get trending posts
  getTrendingPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.basePath}/api/v1/posts/trending`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error('Error fetching trending posts:', error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/{postId} - Get post by ID
  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.basePath}/api/v1/posts/${postId}`, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error fetching post ${postId}:`, error);
          throw error;
        })
      );
  }

  // GET /api/v1/posts/author/{authorId} - Get posts by author
  getPostsByAuthor(authorId: number, page?: number, size?: number): Observable<Post[]> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Post[]>(`${this.basePath}/api/v1/posts/author/${authorId}`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(error => {
        console.error(`Error fetching posts by author ${authorId}:`, error);
        throw error;
      })
    );
  }

  // POST /api/v1/posts - Create a new post
  createPost(postRequest: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.basePath}/api/v1/posts`, postRequest, this.getHttpOptions())
      .pipe(
        map(newPost => {
          // Actualizar la lista local con verificación de seguridad
          const currentPosts = this.postsSubject.value;
          const postsArray = Array.isArray(currentPosts) ? currentPosts : [];
          this.postsSubject.next([newPost, ...postsArray]);
          return newPost;
        }),
        catchError(error => {
          console.error('Error creating post:', error);
          throw error;
        })
      );
  }

  // PUT /api/v1/posts/{postId} - Update a post
  updatePost(postId: number, postRequest: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.basePath}/api/v1/posts/${postId}`, postRequest, this.getHttpOptions())
      .pipe(
        map(updatedPost => {
          // Actualizar en la lista local
          const currentPosts = this.postsSubject.value;
          const updatedPosts = currentPosts.map(post => 
            post.id === postId ? updatedPost : post
          );
          this.postsSubject.next(updatedPosts);
          return updatedPost;
        }),
        catchError(error => {
          console.error(`Error updating post ${postId}:`, error);
          throw error;
        })
      );
  }

  // DELETE /api/v1/posts/{postId} - Delete a post
  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.basePath}/api/v1/posts/${postId}`, this.getHttpOptions())
      .pipe(
        map(response => {
          // Remover de la lista local
          const currentPosts = this.postsSubject.value;
          const filteredPosts = currentPosts.filter(post => post.id !== postId);
          this.postsSubject.next(filteredPosts);
          return response;
        }),
        catchError(error => {
          console.error(`Error deleting post ${postId}:`, error);
          throw error;
        })
      );
  }

  // POST /api/v1/posts/{postId}/view - Increment post view count
  incrementViewCount(postId: number): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/posts/${postId}/view`, {}, this.getHttpOptions())
      .pipe(
        catchError(error => {
          console.error(`Error incrementing view count for post ${postId}:`, error);
          throw error;
        })
      );
  }

  // ==================== HELPER METHODS ====================

  // Obtener posts actuales del estado local
  getCurrentPosts(): Post[] {
    return this.postsSubject.value;
  }

  // Limpiar el estado local
  clearPosts(): void {
    this.postsSubject.next([]);
  }

  // Actualizar un post específico en el estado local
  updateLocalPost(updatedPost: Post): void {
    const currentPosts = this.postsSubject.value;
    const updatedPosts = currentPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    this.postsSubject.next(updatedPosts);
  }
}