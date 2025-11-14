import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../login/services/authentication.service';
import {Usuario} from './model/usuario.entity';
import {PopupRegistroIlustradorService} from './services/popup-registro-ilustrador.service';
import {UserInfoResponse} from '../login/model/user-info.response';
import {UserRoleUtils} from '../login/services/user-role.utils';
import { SocialFeedService } from '../home/services/social-feed.service';
import { DisplayPost, DisplayComment, ApiPostResponse, PostsResponse, User, Event } 
  from '../../../public/services/interface-feed';
import { Subscription } from 'rxjs';
import { UserProfile, UsersService } from '../home/services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CommonModule,
    FormsModule,
  ],
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private subs = new Subscription();
  perfil: Usuario = {
    id: 0,
    usuario: '',
    nombre: '',
    apellido: '',
    ubicacion: '',
    descripcion: '',
    foto: '',
    redesSociales: {
      additionalProp1: '',
      additionalProp2: '',
      additionalProp3: ''
    },
    rol: '',
  }
  posts: DisplayPost[] = [];

  userPhoto: string = 'assets/images/default-avatar.png';
  userName: string = 'Usuario Actual';
    newPostContent: string = '';

  // Variables para el estado de carga
  isLoadingPosts = false;
    private subscriptions: Subscription[] = [];

  // Información del usuariof actual
  currentUser: UserInfoResponse | null = null;
  userRole: string = 'GENERAL';
  selectedPost: DisplayPost | null = null;
  commentTexts: { [key: number]: string } = {};
  availableRoles = ['noRole', 'illustrator', 'writer'];
  currentRoleIndex = 0;
  constructor(
    private popupService: PopupRegistroIlustradorService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService,
    private feedService: SocialFeedService,
    private usersService: UsersService
  ) {
  }

  async ngOnInit() {
    this.loadUserInfo();
    
    const roleSubscription = this.authService.currentRole.subscribe(role => {
      this.userRole = this.mapBackendRoleToFrontend(role);
      this.cdr.detectChanges();
    });

      // Suscribirse a la información completa del usuario
    const userInfoSubscription = this.authService.userInformation.subscribe(userInfo => {
      this.currentUser = userInfo;
      if (userInfo) {
        const role = UserRoleUtils.getUserRole(userInfo);
        this.userRole = this.mapBackendRoleToFrontend(role);
      }
      this.cdr.detectChanges();
    });

    this.subscriptions.push(roleSubscription, userInfoSubscription);


    try {
      const user: UserInfoResponse | null = await this.authService.getUserInformation();

      const role = user ? UserRoleUtils.getUserRole(user) : 'GENERAL';
      if (role === 'GENERAL') {
        this.popupService.openPopup();
      }

      if (!user) return;

        this.perfil.id = user.id;
        this.perfil.usuario = user.username;
        this.perfil.nombre = user.nombres;
        this.perfil.apellido = user.apellidos;
        this.perfil.ubicacion = user.ubicacion;
        this.perfil.descripcion = user.descripcion;
        this.perfil.foto = user.foto ?? 'https://i.pinimg.com/736x/e5/91/dc/e591dc82326cc4c86578e3eeecced792.jpg';
        this.perfil.redesSociales.additionalProp1 = user.redesSociales.additionalProp1 ?? '';
        this.perfil.redesSociales.additionalProp2 = user.redesSociales.additionalProp2 ?? '';
        this.perfil.redesSociales.additionalProp3 = user.redesSociales.additionalProp3 ?? '';
        this.perfil.rol = user.roleName;

        if (role === 'ILLUSTRATOR') {
          this.perfil.rol = 'Ilustrador';
        } else if (role === 'WRITER') {
          this.perfil.rol = 'Escritor';
        } else {
          this.perfil.rol = 'Usuario';
        }

      } catch(err) {
        console.warn('No se pudo cargar la información del usuario en el perfil:', err);
      }

      this.loadUserPosts();
  }

  goToIlustradorForm() {
    this.router.navigate(['register/illustrator']);
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

  private loadUserPosts(): void {
  this.isLoadingPosts = true;

  if (!this.currentUser) {
    console.log('Esperando información del usuario...');
    setTimeout(() => this.loadUserPosts(), 500);
    return;
  }

  const userId = this.currentUser.id;

  const feedSub = this.feedService['postsService']
    .getPosts(0, 10, undefined, userId)
    .subscribe({
      next: (response: any) => {
        
        let posts: any[];

        if (response && response.content && Array.isArray(response.content)) {
          posts = response.content;        // paginado
        } else if (Array.isArray(response)) {
          posts = response;                // array simple
        } else {
          console.error('Formato inesperado:', response);
          posts = [];
        }

        const now = new Date();

        const basicPosts: DisplayPost[] = posts.map(post => ({
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

          // extras usados en el template
          authorName: "Cargando...",
          authorPhoto: "assets/images/default-avatar.png",
          images: [],
          likes: post.reactions_count || post.reactionsCount || 0,
          isLiked: false,
          comments: [],
          rating: post.engagement_rate || post.engagementRate || 0,
          showComments: false,
          createdAtDate: new Date(post.created_at || post.createdAt || now),
          visibility: "public"
        }));

        this.posts = basicPosts;
        this.isLoadingPosts = false;

        // cargar info de autores
        this.loadAuthorsInfo(basicPosts);

        // cargar comentarios para cada post
        this.loadCommentsForPosts(basicPosts);
      },
      error: (error) => {
        console.error("Error cargando posts del usuario:", error);
        this.isLoadingPosts = false;
        this.posts = [];
      }
    });

  this.subs.add(feedSub);
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
        const commentsSub = this.feedService['commentsService'].getCommentsForPost(post.id).subscribe({
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

    const createSub = this.feedService.createPost(this.newPostContent.trim()).subscribe({
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
    const likeSub = this.feedService.likePost(post.id).subscribe({
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
    const shareSub = this.feedService.repostPost(post.id).subscribe({
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
   private mapBackendRoleToFrontend(backendRole: string): string {
    switch (backendRole.toUpperCase()) {
      case 'ILLUSTRATOR':
      case 'ILUSTRADOR':
        return 'ILUSTRADOR';
      case 'WRITER':
      case 'ESCRITOR':
        return 'ESCRITOR';
      case 'ADMIN':
        return 'ADMIN';
      case 'USER':
        return 'user';
      default:
        return 'GENERAL';
    }
  }

  openPostDetail(post: DisplayPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
    
    this.feedService.viewPost(post.id).subscribe({
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

    const commentSub = this.feedService.commentOnPost(post.id, commentContent.trim()).subscribe({
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

  goToMiPortafolio() {
    this.router.navigate(['/portfolio/my-portfolio']);
  }

  goToMisPostulaciones() {
    this.router.navigate(['/applications/my-applications']);
  }
   get isIllustrator(): boolean {
    return this.userRole === 'ILUSTRADOR';
  }

  get isWriter(): boolean {
    return this.userRole === 'ESCRITOR';
  }

  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  get isNoRole(): boolean {
    return this.userRole === 'GENERAL';
  }
  





 
}