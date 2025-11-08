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

// Interface para la respuesta de la API que incluye paginación
interface PostsResponse {
  content: ApiPostResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Interface para cada post en la respuesta de la API
interface ApiPostResponse {
  id: number;
  authorId: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
  reactionsCount: number;
  commentsCount: number;
  repostsCount: number;
  viewsCount: number;
  hasMedia: boolean;
  engagementRate: number;
}

// Interface extendida para compatibilidad con el template actual
interface DisplayPost extends ApiPostResponse {
  authorName?: string;
  authorPhoto?: string;
  images?: string[];
  likes?: number;
  isLiked?: boolean;
  comments?: DisplayComment[];
  rating?: number;
  showComments?: boolean;
  createdAtDate?: Date;
  visibility?: 'public' | 'private' | 'followers';
}

interface User {
  id: number;
  name: string;
  photo: string;
  role: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
}

interface DisplayComment {
  id: number;
  authorId: number;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: Date;
  isLiked?: boolean;
  likes?: number;
}

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
    private usersService: UsersService
  ) {
    // Los datos ahora se cargarán desde el servicio
    this.posts = [];
  }

  ngOnInit(): void {
    // Cargar información del usuario actual
    this.loadUserInfo();
    
    // Cargar posts del feed
    this.loadFeed();

    //const seen = localStorage.getItem(STORAGE_KEY) === '1';
    //     if (!seen) {
    //       this.miniTutorialService.start(steps);
    //       console.log("Mostrando mini tutorial");
    //
    //       // cuando el overlay se cierra guardamos la marca para no volver a mostrarlo
    //       const sub = this.miniTutorialService.isOpen$.subscribe(open => {
    //         if (!open) {
    //           try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* fallbacks si storage no disponible */ }
    //         }
    //       });
    //       this.subs.add(sub);
    //     }
  }

  private loadFeed(): void {
    this.isLoadingPosts = true;
    
    // Asegurar que tenemos información del usuario antes de cargar posts
    if (!this.currentUser) {
      console.log('Esperando información del usuario...');
      // Si no hay usuario, esperar un poco antes de intentar cargar
      setTimeout(() => this.loadFeed(), 500);
      return;
    }
    
    // Usar el servicio de posts directamente para obtener todos los posts con paginación
    const feedSub = this.socialFeedService['postsService'].getPosts(0, 10).subscribe({
      next: (response: any) => {
        console.log('Respuesta del API:', response);
        
        // Verificar si la respuesta es paginada o un array directo
        let posts: any[];
        if (response && response.content && Array.isArray(response.content)) {
          // Respuesta paginada
          posts = response.content;
        } else if (Array.isArray(response)) {
          // Array directo
          posts = response;
        } else {
          console.error('Formato de respuesta inesperado:', response);
          posts = [];
        }
        
        // Primero crear posts con datos básicos
        const basicPosts: DisplayPost[] = posts.map(post => {
          const now = new Date();
          return {
            // Campos base de ApiPostResponse
            id: post.id,
            authorId: post.author_id || post.authorId || 0, // Usar el authorId real de la DB
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
            
            // Campos temporales - se actualizarán con datos reales del autor
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

        // Asignar posts básicos inmediatamente para mostrar el contenido
        this.posts = basicPosts;
        this.isLoadingPosts = false;
        console.log('Posts cargados desde API:', this.posts);

        // Ahora obtener información de los autores
        this.loadAuthorsInfo(basicPosts);
      },
      error: (error) => {
        console.error('Error al cargar posts desde API:', error);
        this.isLoadingPosts = false;
        // En caso de error, mantener posts vacío
        this.posts = [];
      }
    });
    
    this.subs.add(feedSub);
  }

  private loadUserInfo(): void {
    // Suscribirse a la información del usuario
    const userInfoSub = this.authService.userInformation.subscribe(userInfo => {
      if (userInfo) {
        this.currentUser = userInfo;
        this.userName = `${userInfo.nombres} ${userInfo.apellidos}`;
        this.userPhoto = userInfo.foto || 'assets/images/default-avatar.png';
        
        console.log('Información del usuario cargada:', userInfo);
      }
    });
    this.subs.add(userInfoSub);

    // Si no hay información del usuario, intentar cargarla
    if (!this.currentUser) {
      this.authService.loadUserInformation().catch(error => {
        console.error('Error al cargar información del usuario:', error);
      });
    }
  }

  private loadAuthorsInfo(posts: DisplayPost[]): void {
    // Obtener IDs únicos de autores
    const authorIds = [...new Set(posts.map(post => post.authorId).filter(id => id && id > 0))];
    
    if (authorIds.length === 0) return;

    console.log('Cargando información de autores:', authorIds);

    // Cargar información de cada autor
    authorIds.forEach(authorId => {
      const authorSub = this.usersService.getUserById(authorId).subscribe({
        next: (authorProfile: UserProfile) => {
          console.log(`Información del autor ${authorId}:`, authorProfile);
          
          // Actualizar todos los posts de este autor
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
          
          // Usar información por defecto en caso de error
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

  createPost(): void {
    if (!this.newPostContent.trim()) return;

    const createSub = this.socialFeedService.createPost(this.newPostContent.trim()).subscribe({
      next: (newPost) => {
        // Convertir el post nuevo a DisplayPost y agregarlo al feed
        const now = new Date().toISOString();
        const displayPost: DisplayPost = {
          // Campos base requeridos de ApiPostResponse
          id: newPost.id,
          authorId: this.currentUser?.id || 0,
          content: newPost.content,
          tags: newPost.tags || [],
          createdAt: now,
          updatedAt: now,
          active: true,
          reactionsCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          viewsCount: 0,
          hasMedia: false,
          engagementRate: 0,
          
          // Campos adicionales para el template
          authorName: this.userName,
          authorPhoto: this.userPhoto,
          images: [],
          likes: 0,
          isLiked: false,
          comments: [],
          rating: 0,
          showComments: false,
          createdAtDate: new Date(now),
          visibility: 'public'
        };
        
        this.posts.unshift(displayPost);
        this.newPostContent = '';
        console.log('Post creado exitosamente:', newPost);
      },
      error: (error) => {
        console.error('Error al crear post:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
    
    this.subs.add(createSub);
  }

  likePost(post: DisplayPost): void {
    const likeSub = this.socialFeedService.likePost(post.id).subscribe({
      next: () => {
        // Actualizar el estado local del post
        if (post.isLiked) {
          post.likes = (post.likes || 1) - 1;
        } else {
          post.likes = (post.likes || 0) + 1;
        }
        post.isLiked = !post.isLiked;
        console.log('Like actualizado para post:', post.id);
      },
      error: (error) => {
        console.error('Error al dar like al post:', error);
      }
    });
    
    this.subs.add(likeSub);
  }

  likeComment(comment: DisplayComment): void {
    // Por ahora mantener lógica local, más tarde se puede implementar con el servicio
    if (!comment.isLiked) {
      comment.likes = (comment.likes || 0) + 1;
    } else {
      comment.likes = (comment.likes || 1) - 1;
    }
    comment.isLiked = !comment.isLiked;
  }

  sharePost(post: DisplayPost): void {
    const shareSub = this.socialFeedService.repostPost(post.id).subscribe({
      next: () => {
        console.log('Post compartido exitosamente:', post.id);
        // Aquí podrías mostrar un mensaje de éxito al usuario
      },
      error: (error) => {
        console.error('Error al compartir post:', error);
      }
    });
    
    this.subs.add(shareSub);
  }

  followUser(userId: number) {
    // Implementar lógica de seguir usuario
    console.log('Siguiendo usuario:', userId);
  }

  // Métodos para el modal
  openPostDetail(post: DisplayPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
    
    // Incrementar contador de vistas
    this.socialFeedService.viewPost(post.id).subscribe({
      next: () => console.log('Vista registrada para post:', post.id),
      error: (error) => console.error('Error al registrar vista:', error)
    });
  }

  closePostDetail(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.selectedPost = null;
      document.body.style.overflow = '';
    }
  }

  // Métodos de imágenes temporalmente removidos para evitar errores de compilación

  showPostOptions(event: MouseEvent, post: DisplayPost): void {
    event.stopPropagation();
    // Implementar menú de opciones del post
    console.log('Mostrando opciones del post:', post.id);
  }

  showLikes(post: DisplayPost): void {
    // Implementar modal de personas que dieron like
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
        // Convertir Comments a DisplayComment y agregarlo al post
        const displayComment: DisplayComment = {
          id: newComment.id,
          authorId: this.currentUser?.id || 0,
          authorName: this.userName,
          authorPhoto: this.userPhoto,
          content: newComment.content,
          createdAt: new Date(),
          isLiked: false,
          likes: 0
        };

        if (!post.comments) {
          post.comments = [];
        }
        post.comments.push(displayComment);
        this.commentTexts[post.id] = '';
        console.log('Comentario creado exitosamente:', newComment);
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
