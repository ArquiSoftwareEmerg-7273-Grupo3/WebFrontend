import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MiniTutorialService} from '../mini-tutorial/mini-tutorial/services/mini-tutorial.service';
import {Subscription} from 'rxjs';
import { AuthenticationService } from '../login/services/authentication.service';
import { UserInfoResponse } from '../login/model/user-info.response';
import { SocialFeedService, FeedPost } from './services/social-feed.service';
import { Post as ApiPost } from './services/posts.service';
import { Comments } from './services/comments.service';
import { UsersService, UserProfile } from './services/users.service';
import { WebSocketService } from '../../../public/services/websocket.service';
import { DisplayPost, DisplayComment, ApiPostResponse, PostsResponse, User, Event } 
  from '../../../public/services/interface-feed';
// Interface para la respuesta de la API que incluye paginación

// MediaViewerOptions removido - funcionalidad de imágenes temporalmente deshabilitada

@Component({
  selector: 'app-social-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  posts: DisplayPost[] = [];
  newPostContent: string = '';
  commentTexts: { [key: number]: string } = {};
  userPhoto: string = 'assets/images/default-avatar.png';
  userName: string = 'Usuario Actual';
  
  // Variables para el estado de carga
  isLoadingPosts = false;
  
  // Información del usuario actual
  currentUser: UserInfoResponse | null = null;

  // Variables para WebSocket
  wsConnected = false;
  private hasAttemptedLoad = false;

  // Variables para el modal
  selectedPost: DisplayPost | null = null;

  suggestedUsers: User[] = [
    {
      id: 1,
      name: 'María López',
      photo: 'assets/images/users/maria.jpg',
      role: 'Ilustradora'
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      photo: 'assets/images/users/carlos.jpg',
      role: 'Escritor'
    }
  ];

  events: Event[] = [
    {
      id: 1,
      title: 'Feria del Libro',
      description: 'Exposición de ilustraciones y libros',
      date: new Date('2025-10-24')
    },
    {
      id: 2,
      title: 'Taller de Ilustración',
      description: 'Aprende técnicas digitales',
      date: new Date('2025-10-28')
    }
  ];

  constructor(
    private miniTutorialService: MiniTutorialService,
    private authService: AuthenticationService,
    private socialFeedService: SocialFeedService,
    private usersService: UsersService,
    private wsService: WebSocketService
  ) {
    // Los datos ahora se cargarán desde el servicio
    this.posts = [];
  }

  ngOnInit(): void {
    this.loadUserInfo();
    
    this.loadFeed();

    this.setupWebSocket();

  }

  private loadFeed(): void {
    this.isLoadingPosts = true;
    
    if (!this.currentUser) {
      console.log('Esperando información del usuario...');
      setTimeout(() => this.loadFeed(), 500);
      return;
    }
    
    const feedSub = this.socialFeedService['postsService'].getPosts(0, 10).subscribe({
      next: (response: any) => {
        
        let posts: any[];
        if (response && response.content && Array.isArray(response.content)) {
          posts = response.content;
        } else if (Array.isArray(response)) {
          posts = response;
        } else {
          console.error('Formato de respuesta inesperado:', response);
          posts = [];
        }
        
        const basicPosts: DisplayPost[] = posts.map(post => {
          const now = new Date();
          return {
            id: post.id,
            authorId: post.author_id || post.authorId || 0,
            content: post.content,
            tags: post.tags || [],
            createdAt: post.created_at || post.createdAt || now.toISOString(),
            updatedAt: post.updated_at || post.updatedAt || now.toISOString(),
            active: post.active !== undefined ? post.active : true,
            reactionsCount: post.reactions_count || post.reactionsCount || 0,
            commentsCount: post.comments_count || post.commentsCount || 0,
            repostsCount: post.reposts_count || post.repostsCount || 0,
            viewsCount: post.views_count || post.viewsCount || 0,
            hasMedia: post.has_media || post.hasMedia || false,
            engagementRate: post.engagement_rate || post.engagementRate || 0,
            
            authorName: 'Cargando...',
            authorPhoto: 'assets/images/default-avatar.png',
            images: [],
            likes: post.reactions_count || post.reactionsCount || 0,
            isLiked: false,
            comments: [],
            rating: post.engagement_rate || post.engagementRate || 0,
            showComments: false,
            createdAtDate: new Date(post.created_at || post.createdAt || now),
            visibility: 'public'
          } as DisplayPost;
        });

        this.posts = basicPosts;
        this.isLoadingPosts = false;

        this.loadAuthorsInfo(basicPosts);
        
        // Cargar comentarios existentes para cada post
        this.loadCommentsForPosts(basicPosts);
      },
      error: (error) => {
        this.isLoadingPosts = false;
        this.posts = [];
      }
    });
    
    this.subs.add(feedSub);
  }

  private loadUserInfo(): void {
    const userInfoSub = this.authService.userInformation.subscribe(userInfo => {
      if (userInfo) {
        this.currentUser = userInfo;
        this.userName = `${userInfo.nombres} ${userInfo.apellidos}`;
        this.userPhoto = userInfo.foto || 'assets/images/default-avatar.png';
        
      }
    });
    this.subs.add(userInfoSub);

    // Si no hay información del usuario, intentar cargarla
    if (!this.currentUser) {
      this.authService.loadUserInformation().catch(error => {
      });
    }
  }

  private loadAuthorsInfo(posts: DisplayPost[]): void {
    const authorIds = [...new Set(posts.map(post => post.authorId).filter(id => id && id > 0))];
    
    if (authorIds.length === 0) return;


    authorIds.forEach(authorId => {
      const authorSub = this.usersService.getUserById(authorId).subscribe({
        next: (authorProfile: UserProfile) => {
          
          this.posts = this.posts.map(post => {
            if (post.authorId === authorId) {
              return {
                ...post,
                authorName: `${authorProfile.nombres} ${authorProfile.apellidos}`,
                authorPhoto: authorProfile.foto || 'assets/images/default-avatar.png'
              };
            }
            return post;
          });
        },
        error: (error) => {
          console.error(`Error al cargar información del autor ${authorId}:`, error);
          
          this.posts = this.posts.map(post => {
            if (post.authorId === authorId) {
              return {
                ...post,
                authorName: `Usuario ${authorId}`,
                authorPhoto: 'assets/images/default-avatar.png'
              };
            }
            return post;
          });
        }
      });
      
      this.subs.add(authorSub);
    });
  }

  /**
   * Cargar comentarios existentes para cada post
   */
  private loadCommentsForPosts(posts: DisplayPost[]): void {
    posts.forEach(post => {
      if (post.commentsCount > 0) {
        const commentsSub = this.socialFeedService['commentsService'].getCommentsForPost(post.id).subscribe({
          next: (response: any) => {
            
            // Extraer el array de comentarios (puede venir en response.content o directamente)
            let comments: any[];
            if (response && response.content && Array.isArray(response.content)) {
              comments = response.content;
            } else if (Array.isArray(response)) {
              comments = response;
            } else {
              console.warn('Formato de comentarios inesperado:', response);
              comments = [];
            }
            
            // Convertir a DisplayComment
            const displayComments: DisplayComment[] = comments.map(comment => {
              const now = new Date();
              return {
                id: comment.id,
                userId: comment.userId || comment.author_id || comment.authorId || 0, 
                userName: 'Cargando...',
                userPhoto: 'assets/images/default-avatar.png',
                content: comment.content,
                createdAt: new Date(comment.createdAt || comment.created_at || now),
                isReply: comment.isReply || false,
                likes: 0
              } as DisplayComment;
            });
            

            // Actualizar el post con sus comentarios
            const postIndex = this.posts.findIndex(p => p.id === post.id);
            if (postIndex !== -1) {
              this.posts[postIndex].comments = displayComments;
              
              // Cargar info de autores de comentarios
              if (displayComments.length > 0) {
                this.loadCommentsAuthorsInfo(postIndex, displayComments);
              }
            }
          },
          error: (error) => {
            console.error(`Error al cargar comentarios del post ${post.id}:`, error);
          }
        });
        
        this.subs.add(commentsSub);
      }
    });
  }

  /**
   * Cargar información de los autores de los comentarios
   */
  private loadCommentsAuthorsInfo(postIndex: number, comments: DisplayComment[]): void {
    const userIds = [...new Set(comments.map(c => c.userId).filter(id => id && id > 0))];
    
    console.log('👥 Cargando autores de comentarios. UserIds:', userIds);

    userIds.forEach(userId => {
      console.log('🔍 Buscando usuario con ID:', userId);
      
      const userSub = this.usersService.getUserById(userId).subscribe({
        next: (userProfile: UserProfile) => {
          console.log('✅ Usuario obtenido:', userProfile);
          
          if (this.posts[postIndex]?.comments) {
            this.posts[postIndex].comments = this.posts[postIndex].comments!.map(comment => {
              if (comment.userId === userId) {
                console.log(`🔄 Actualizando comentario ${comment.id} con usuario:`, userProfile.nombres);
                return {
                  ...comment,
                  userName: `${userProfile.nombres} ${userProfile.apellidos}`,
                  userPhoto: userProfile.foto || 'assets/images/default-avatar.png'
                };
              }
              return comment;
            });
            
            // Forzar detección de cambios
            this.posts = [...this.posts];
            console.log('✨ Posts actualizados. Comentarios del post:', this.posts[postIndex].comments);
          }
        },
        error: (error) => {
          console.error(`❌ Error al cargar información del autor ${userId}:`, error);
        }
      });

      this.subs.add(userSub);
    });
  }

  createPost(): void {
    if (!this.newPostContent.trim()) return;

    const createSub = this.socialFeedService.createPost(this.newPostContent.trim()).subscribe({
      next: (newPost) => {
     
        this.newPostContent = '';
      },
      error: (error) => {
        console.error('Error al crear post:', error);
      }
    });
    
    this.subs.add(createSub);
  }

  likePost(post: DisplayPost): void {
    const likeSub = this.socialFeedService.likePost(post.id).subscribe({
      next: () => {
        if (post.isLiked) {
          post.likes = (post.likes || 1) - 1;
        } else {
          post.likes = (post.likes || 0) + 1;
        }
        post.isLiked = !post.isLiked;
      },
      error: (error) => {
      }
    });
    
    this.subs.add(likeSub);
  }


  sharePost(post: DisplayPost): void {
    const shareSub = this.socialFeedService.repostPost(post.id).subscribe({
      next: () => {
        console.log('Post compartido exitosamente:', post.id);
      },
      error: (error) => {
        console.error('Error al compartir post:', error);
      }
    });
    
    this.subs.add(shareSub);
  }

  followUser(userId: number) {
    console.log('Siguiendo usuario:', userId);
  }

  openPostDetail(post: DisplayPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
    
    this.socialFeedService.viewPost(post.id).subscribe({
      next: () => console.log('Vista registrada para post:', post.id),
      error: (error) => console.error('Error al registrar vista:', error)
    });
  }

  closePostDetail(event?: MouseEvent): void {
    // Si hay evento y es el fondo del modal, cerrar
    if (event && event.target !== event.currentTarget) {
      return;
    }
    // Cerrar modal
    this.selectedPost = null;
    document.body.style.overflow = '';
  }


  showPostOptions(event: MouseEvent, post: DisplayPost): void {
    event.stopPropagation();
  }

  showLikes(post: DisplayPost): void {
    console.log('Mostrando likes del post:', post.id);
  }

  focusComment(post: DisplayPost): void {
    const commentInput = document.querySelector(`#comment-input-${post.id}`) as HTMLInputElement;
    if (commentInput) {
      commentInput.focus();
    }
  }

  submitComment(post: DisplayPost): void {
    const commentContent = this.commentTexts[post.id];
    if (!commentContent?.trim()) return;

    const commentSub = this.socialFeedService.commentOnPost(post.id, commentContent.trim()).subscribe({
      next: (newComment) => {
       
        this.commentTexts[post.id] = '';
      },
      error: (error) => {
        console.error('Error al crear comentario:', error);
      }
    });
    
    this.subs.add(commentSub);
  }

  // Obtener información del rol del usuario
  getUserRole(): string {
    if (!this.currentUser) return 'Usuario';
    
    if (this.currentUser.ilustrador) {
      return 'Ilustrador';
    } else if (this.currentUser.escritor) {
      return 'Escritor';
    }
    
    return this.currentUser.roleName || 'Usuario';
  }

  // Obtener nombre completo del usuario
  getFullUserName(): string {
    if (!this.currentUser) return this.userName;
    
    return `${this.currentUser.nombres} ${this.currentUser.apellidos}`;
  }

  // Obtener descripción del usuario
  getUserDescription(): string {
    return this.currentUser?.descripcion || 'Sin descripción';
  }

  // Método para refrescar el feed
  refreshFeed(): void {
    this.loadFeed();
  }

  // Método para obtener posts trending
  loadTrendingPosts(): void {
    const trendingSub = this.socialFeedService.getTrendingPosts().subscribe({
      next: (trendingPosts) => {
        console.log('Posts trending cargados:', trendingPosts);
        // Aquí podrías mostrar los trending posts en una sección especial
      },
      error: (error) => {
        console.error('Error al cargar posts trending:', error);
      }
    });
    
    this.subs.add(trendingSub);
  }

  /**
   * ============================================
   * WEBSOCKET - MÉTODOS PARA TIEMPO REAL
   * ============================================
   */

  /**
   * Configurar WebSocket y suscribirse a eventos en tiempo real
   */
  private setupWebSocket(): void {
    
    // Esperar a que el usuario esté cargado antes de conectar
    const userSub = this.authService.userInformation.subscribe(userInfo => {
      if (userInfo && !this.wsService.isConnected()) {
        this.wsService.connect(userInfo.id);
      }
    });
    this.subs.add(userSub);

    // Monitorear estado de conexión
    const connectedSub = this.wsService.isConnected$.subscribe(connected => {
      this.wsConnected = connected;
    });
    this.subs.add(connectedSub);

    const newPostsSub = this.wsService.newPosts.subscribe(newPost => {
      this.handleNewPostReceived(newPost);
    });
    this.subs.add(newPostsSub);

    const newCommentsSub = this.wsService.newComments.subscribe(({ postId, comment }) => {
      this.handleNewCommentReceived(postId, comment);
    });
    this.subs.add(newCommentsSub);

    const likesSub = this.wsService.postLikes.subscribe(({ postId, likesCount, userId }) => {
      this.handleLikeUpdated(postId, likesCount, userId);
    });
    this.subs.add(likesSub);

    const deletedSub = this.wsService.postDeleted.subscribe(postId => {
      this.handlePostDeleted(postId);
    });
    this.subs.add(deletedSub);

    const updatedSub = this.wsService.postUpdated.subscribe(updatedPost => {
      this.handlePostUpdated(updatedPost);
    });
    this.subs.add(updatedSub);
  }

  /**
   * Manejar nuevo post recibido por WebSocket
   */
  private handleNewPostReceived(newPost: any): void {
    
    // Verificar si el post ya existe (evitar duplicados)
    if (this.posts.some(p => p.id === newPost.id)) {
      return;
    }

    // Convertir a DisplayPost con todos los campos garantizados
    const now = new Date();
    const authorId = newPost.author_id || newPost.authorId || 0;
    
    // Si es el post del usuario actual, usar su información
    const isOwnPost = authorId === this.currentUser?.id;
    
    const displayPost: DisplayPost = {
      // Campos base de ApiPostResponse
      id: newPost.id || 0,
      authorId: authorId,
      content: newPost.content || '',
      tags: Array.isArray(newPost.tags) ? newPost.tags : [],
      createdAt: newPost.created_at || newPost.createdAt || now.toISOString(),
      updatedAt: newPost.updated_at || newPost.updatedAt || now.toISOString(),
      active: true,
      reactionsCount: newPost.reactions_count || newPost.reactionsCount || 0,
      commentsCount: newPost.comments_count || newPost.commentsCount || 0,
      repostsCount: newPost.reposts_count || newPost.repostsCount || 0,
      viewsCount: newPost.views_count || newPost.viewsCount || 0,
      hasMedia: newPost.has_media || newPost.hasMedia || false,
      engagementRate: newPost.engagement_rate || newPost.engagementRate || 0,
      
      // Campos adicionales para el template - usar info del usuario actual si es su post
      authorName: isOwnPost ? this.userName : 'Cargando...',
      authorPhoto: isOwnPost ? this.userPhoto : 'assets/images/default-avatar.png',
      images: Array.isArray(newPost.images) ? newPost.images : [],
      likes: newPost.reactions_count || newPost.reactionsCount || 0,
      isLiked: false,
      comments: Array.isArray(newPost.comments) ? newPost.comments : [],
      rating: newPost.engagement_rate || newPost.engagementRate || 0,
      showComments: false,
      createdAtDate: new Date(newPost.created_at || newPost.createdAt || now),
      visibility: 'public'
    };

    // Agregar al inicio del feed sin mutar directamente
    this.posts = [displayPost, ...this.posts];
    
    // Si no es del usuario actual, cargar info del autor
    if (!isOwnPost && authorId > 0) {
      this.loadAuthorsInfo([displayPost]);
    }
    
    // Mostrar notificación visual
    this.showNotification('Nuevo post disponible');
  }

  /**
   * Manejar nuevo comentario recibido por WebSocket
   */
  private handleNewCommentReceived(postId: number, comment: any): void {
    
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      console.warn('Post no encontrado para el comentario');
      return;
    }

    const now = new Date();
    const displayComment: DisplayComment = {
      id: comment.id,
      userId: comment.userId || comment.authorId || 0,
      content: comment.content,
      createdAt: new Date(comment.created_at || comment.createdAt || now),
      isReply: false,
    };

    // Inicializar array de comentarios si no existe
    if (!this.posts[postIndex].comments) {
      this.posts[postIndex].comments = [];
    }
    
    // Evitar duplicados
    if (!this.posts[postIndex].comments!.some(c => c.id === displayComment.id)) {
      this.posts[postIndex].comments!.push(displayComment);
      this.posts[postIndex].commentsCount++;
      
      // Forzar detección de cambios
      this.posts = [...this.posts];
      console.log('Comentario agregado. Total comentarios:', this.posts[postIndex].comments!.length);
      
      // Cargar info del autor del comentario si es necesario
      if (displayComment.userId > 0) {
        this.loadCommentAuthorInfo(postIndex, displayComment.userId);
      }
    }
  }

  /**
   * Manejar actualización de likes por WebSocket
   */
  private handleLikeUpdated(postId: number, likesCount: number, userId: number): void {
    console.log('Procesando actualización de like. Post ID:', postId, 'Likes:', likesCount);
    
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      console.warn('⚠️ Post no encontrado para actualizar likes');
      return;
    }

    // Actualizar contador de likes
    this.posts[postIndex].likes = likesCount;
    this.posts[postIndex].reactionsCount = likesCount;
    
    // Si el like es del usuario actual, actualizar el estado
    if (userId === this.currentUser?.id) {
      this.posts[postIndex].isLiked = !this.posts[postIndex].isLiked;
    }
    
    // Forzar detección de cambios
    this.posts = [...this.posts];
    console.log(' Likes actualizados:', likesCount);
  }

  /**
   * Manejar post eliminado por WebSocket
   */
  private handlePostDeleted(postId: number): void {
    console.log('🗑️ Procesando eliminación de post. Post ID:', postId);
    
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== postId);
    
    if (this.posts.length < initialLength) {
      console.log('Post eliminado del feed');
    }
  }

  /**
   * Manejar post actualizado por WebSocket
   */
  private handlePostUpdated(updatedPost: any): void {
    console.log('Procesando actualización de post:', updatedPost);
    
    const postIndex = this.posts.findIndex(p => p.id === updatedPost.id);
    if (postIndex === -1) {
      console.warn(' Post no encontrado para actualizar');
      return;
    }

    // Actualizar contenido manteniendo otros datos
    this.posts[postIndex] = {
      ...this.posts[postIndex],
      content: updatedPost.content,
      updatedAt: updatedPost.updated_at || updatedPost.updatedAt || new Date().toISOString(),
      tags: updatedPost.tags || this.posts[postIndex].tags
    };
    
    // Forzar detección de cambios
    this.posts = [...this.posts];
    console.log(' Post actualizado');
  }

  /**
   * Cargar información del autor de un comentario
   */
  private loadCommentAuthorInfo(postIndex: number, authorId: number): void {
    const authorSub = this.usersService.getUserById(authorId).subscribe({
      next: (authorProfile) => {
        if (this.posts[postIndex]?.comments) {
          this.posts[postIndex].comments = this.posts[postIndex].comments!.map(comment => {
            if (comment.userId === authorId) {
              return {
                ...comment,
                userName: `${authorProfile.nombres} ${authorProfile.apellidos}`,
                userPhoto: authorProfile.foto || 'assets/images/default-avatar.png'
              };
            }
            return comment;
          });
          
          // Forzar detección de cambios
          this.posts = [...this.posts];
        }
      },
      error: (error) => {
        console.error(`Error al cargar información del autor ${authorId}:`, error);
      }
    });
    
    this.subs.add(authorSub);
  }

  /**
   * Mostrar notificación de nuevo contenido
   */
  private showNotification(message: string): void {
    console.log(' Notificación:', message);
    // TODO: Implementar toast o notificación visual
  }

  /**
   * ============================================
   * FIN WEBSOCKET
   * ============================================
   */

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.wsService.disconnect(); 
  }

}
