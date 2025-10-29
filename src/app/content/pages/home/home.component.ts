import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorPhoto: string;
  content: string;
  images?: string[];
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  rating: number;
  showComments: boolean;
  createdAt: Date;
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

interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: Date;
  isLiked?: boolean;
  likes?: number;
}

type MediaViewerOptions = {
  post: Post;
  index: number;
  event?: MouseEvent;
};

@Component({
  selector: 'app-social-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  posts: Post[] = [];
  newPostContent: string = '';
  commentTexts: { [key: number]: string } = {};
  userPhoto: string = 'assets/images/default-avatar.png';
  userName: string = 'Usuario Actual';
  
  // Variables para el modal
  selectedPost: Post | null = null;
  currentImageIndex: number = 0;

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

  constructor() {
    // Datos de ejemplo con múltiples imágenes y comentarios
    this.posts = [
      {
        id: 1,
        authorId: 1,
        authorName: 'María López',
        authorPhoto: 'assets/images/users/maria.jpg',
        content: '¡Acabo de terminar mi última serie de ilustraciones! ¿Qué les parece? Me inspiré en la naturaleza y los colores del otoño para crear esta colección. Cada pieza representa un momento diferente del día y cómo la luz natural afecta los colores del paisaje. #Ilustración #Arte #Naturaleza',
        images: [
          'assets/images/posts/illustration1.jpg',
          'assets/images/posts/illustration2.jpg',
          'assets/images/posts/illustration3.jpg',
          'assets/images/posts/illustration4.jpg',
          'assets/images/posts/illustration5.jpg'
        ],
        likes: 24,
        isLiked: false,
        rating: 4.5,
        showComments: false,
        comments: [
          {
            id: 1,
            authorId: 2,
            authorName: 'Carlos Ruiz',
            authorPhoto: 'assets/images/users/carlos.jpg',
            content: '¡Me encanta el uso del color en cada pieza! Especialmente en la tercera ilustración, la luz del atardecer está perfectamente capturada.',
            createdAt: new Date(),
            isLiked: false,
            likes: 3
          },
          {
            id: 2,
            authorId: 3,
            authorName: 'Ana García',
            authorPhoto: 'assets/images/users/ana.jpg',
            content: 'La evolución de tu estilo es increíble. ¿Qué técnicas usaste para lograr esos efectos de luz?',
            createdAt: new Date(),
            isLiked: true,
            likes: 5
          }
        ],
        createdAt: new Date(),
        visibility: 'public'
      }
    ];
  }

  ngOnInit(): void {
    // Aquí se cargarían los posts desde el servicio
  }

  createPost() {
    if (!this.newPostContent.trim()) return;

    const newPost: Post = {
      id: this.posts.length + 1,
      authorId: 1,
      authorName: this.userName,
      authorPhoto: this.userPhoto,
      content: this.newPostContent,
      likes: 0,
      isLiked: false,
      rating: 0,
      showComments: false,
      comments: [],
      createdAt: new Date(),
      visibility: 'public'
    };

    this.posts.unshift(newPost);
    this.newPostContent = '';
  }

  likePost(post: Post) {
    if (post.isLiked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.isLiked = !post.isLiked;
  }

  likeComment(comment: Comment) {
    if (!comment.isLiked) {
      comment.likes = (comment.likes || 0) + 1;
    } else {
      comment.likes = (comment.likes || 1) - 1;
    }
    comment.isLiked = !comment.isLiked;
  }

  sharePost(post: Post) {
    // Implementar lógica de compartir
    console.log('Compartiendo post:', post.id);
  }

  followUser(userId: number) {
    // Implementar lógica de seguir usuario
    console.log('Siguiendo usuario:', userId);
  }

  // Métodos para el modal
  openPostDetail(post: Post) {
    this.selectedPost = post;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closePostDetail(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.selectedPost = null;
      document.body.style.overflow = '';
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.selectedPost?.images && this.currentImageIndex < this.selectedPost.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  openMediaViewer(options: MediaViewerOptions): void {
    if (options.event) {
      options.event.stopPropagation();
    }
    
    this.selectedPost = options.post;
    this.currentImageIndex = options.index;
    document.body.style.overflow = 'hidden';
  }

  showPostOptions(event: MouseEvent, post: Post) {
    event.stopPropagation();
    // Implementar menú de opciones del post
    console.log('Mostrando opciones del post:', post.id);
  }

  showLikes(post: Post) {
    // Implementar modal de personas que dieron like
    console.log('Mostrando likes del post:', post.id);
  }

  focusComment(post: Post) {
    const commentInput = document.querySelector(`#comment-input-${post.id}`) as HTMLInputElement;
    if (commentInput) {
      commentInput.focus();
    }
  }

  submitComment(post: Post) {
    const commentContent = this.commentTexts[post.id];
    if (!commentContent?.trim()) return;

    const newComment: Comment = {
      id: post.comments.length + 1,
      authorId: 1,
      authorName: this.userName,
      authorPhoto: this.userPhoto,
      content: commentContent.trim(),
      createdAt: new Date(),
      isLiked: false,
      likes: 0
    };

    post.comments.push(newComment);
    this.commentTexts[post.id] = '';
  }
}
