import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Importar todos los servicios
import { PostsService, Post, CreatePostRequest, UpdatePostRequest } from './posts.service';
import { CommentsService, Comments, CreateCommentRequest } from './comments.service';
import { ReactionsService, ReactionStats, UserReaction } from './reactions.service';
import { RepostsService, RepostInfo, RepostStatus } from './reposts.service';

// Interface extendida para el feed que incluye toda la información
export interface FeedPost extends Post {
  // Información adicional del post enriquecida
  reactionStats?: ReactionStats[];
  userReaction?: UserReaction | null;
  repostCount?: number;
  hasUserReposted?: boolean;
  commentsCount?: number;
  recentComments?: Comments[];
  
  // Metadatos adicionales
  viewCount?: number;
  isOwnPost?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocialFeedService {
  
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private reactionsService: ReactionsService,
    private repostsService: RepostsService
  ) {}

  // ==================== MÉTODOS PRINCIPALES DEL FEED ====================

  // Obtener feed completo con toda la información enriquecida
  getEnrichedFeed(): Observable<FeedPost[]> {
    return this.postsService.getFeed().pipe(
      map(posts => {
        return posts.map(post => ({
          ...post,
          commentsCount: 0,
          repostCount: 0,
          hasUserReposted: false,
          reactionStats: []
        } as FeedPost));
      })
    );
  }

  getPostWithFullInfo(postId: number, currentUserId?: number): Observable<FeedPost> {
    const postInfo$ = this.postsService.getPostById(postId);
    const reactionStats$ = this.reactionsService.getReactionStats(postId);
    const repostCount$ = this.repostsService.getRepostCount(postId);
    const repostStatus$ = this.repostsService.getRepostStatus(postId);
    const comments$ = this.commentsService.getCommentsForPost(postId, 0, 3); // Solo los primeros 3 comentarios
    
    const userReaction$ = currentUserId 
      ? this.reactionsService.getUserReactionToPost(postId, currentUserId)
      : new Observable(observer => { observer.next(null); observer.complete(); });

    return forkJoin({
      post: postInfo$,
      reactionStats: reactionStats$,
      repostInfo: repostCount$,
      repostStatus: repostStatus$,
      comments: comments$,
      userReaction: userReaction$
    }).pipe(
      map(result => ({
        ...result.post,
        reactionStats: result.reactionStats,
        userReaction: result.userReaction,
        repostCount: result.repostInfo.count,
        hasUserReposted: result.repostStatus.hasReposted,
        commentsCount: result.comments.length,
        recentComments: result.comments
      } as FeedPost))
    );
  }

  // ==================== ACCIONES DE POST ====================

  // Crear un nuevo post
  createPost(content: string, tags?: string[]): Observable<Post> {
    const postRequest: CreatePostRequest = {
      content,
      tags: tags || []
    };
    return this.postsService.createPost(postRequest);
  }

  // Actualizar un post
  updatePost(postId: number, content: string, tags?: string[]): Observable<Post> {
    const updateRequest: UpdatePostRequest = {
      content,
      tags: tags || []
    };
    return this.postsService.updatePost(postId, updateRequest);
  }

  // Eliminar un post
  deletePost(postId: number): Observable<any> {
    return this.postsService.deletePost(postId);
  }

  // ==================== ACCIONES DE INTERACCIÓN ====================

  // Dar like a un post
  likePost(postId: number): Observable<any> {
    return this.reactionsService.likePost(postId);
  }

  // Repostear un post
  repostPost(postId: number): Observable<RepostInfo> {
    return this.repostsService.toggleRepost(postId);
  }

  // Comentar en un post
  commentOnPost(postId: number, content: string, parentCommentId?: number): Observable<Comments> {
    const commentRequest: CreateCommentRequest = {
      content,
      parentCommentId
    };
    return this.commentsService.createComment(postId, commentRequest);
  }

  // Incrementar contador de vistas
  viewPost(postId: number): Observable<any> {
    return this.postsService.incrementViewCount(postId);
  }

  // ==================== MÉTODOS DE CONSULTA ====================

  // Obtener posts trending
  getTrendingPosts(): Observable<Post[]> {
    return this.postsService.getTrendingPosts();
  }

  // Obtener posts por autor
  getPostsByAuthor(authorId: number, page?: number, size?: number): Observable<Post[]> {
    return this.postsService.getPostsByAuthor(authorId, page, size);
  }

  // Obtener comentarios de un post con paginación
  getPostComments(postId: number, page?: number, size?: number): Observable<Comments[]> {
    return this.commentsService.getCommentsForPost(postId, page, size);
  }

  // Obtener estadísticas de reacciones de un post
  getPostReactionStats(postId: number): Observable<ReactionStats[]> {
    return this.reactionsService.getReactionStats(postId);
  }

  // Obtener reposts de un post
  getPostReposts(postId: number, page?: number, size?: number): Observable<RepostInfo[]> {
    return this.repostsService.getRepostsForPost(postId, page, size);
  }

  // ==================== MÉTODOS DE ESTADO ====================

  // Verificar si el usuario ha dado like a un post
  hasUserLikedPost(postId: number, userId: number): Observable<boolean> {
    return this.reactionsService.getUserReactionToPost(postId, userId).pipe(
      map(reaction => reaction?.reactionType === 'LIKE')
    );
  }

  // Verificar si el usuario ha reposteado un post
  hasUserRepostedPost(postId: number): Observable<boolean> {
    return this.repostsService.hasUserReposted(postId);
  }

  // ==================== MÉTODOS UTILITARIOS ====================

  // Limpiar caché local
  clearCache(): void {
    this.postsService.clearPosts();
  }

  // Obtener posts actuales del caché
  getCurrentCachedPosts(): Post[] {
    return this.postsService.getCurrentPosts();
  }
}