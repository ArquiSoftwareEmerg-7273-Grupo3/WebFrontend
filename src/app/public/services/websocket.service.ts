import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  type: 'NEW_POST' | 'NEW_COMMENT' | 'LIKE' | 'DELETE_POST' | 'UPDATE_POST';
  data: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private messages$ = new Subject<WebSocketMessage>();
  
  // Subjects para diferentes tipos de eventos
  private newPosts$ = new Subject<any>();
  private newComments$ = new Subject<{ postId: number; comment: any }>();
  private postLikes$ = new Subject<{ postId: number; likesCount: number; userId: number }>();
  private postDeleted$ = new Subject<number>();
  private postUpdated$ = new Subject<any>();

  constructor() {}

  /**
   * Conectar al servidor WebSocket usando STOMP sobre SockJS
   */
  connect(userId?: number): void {
    if (this.stompClient?.connected) {
      return;
    }


    // Crear cliente STOMP
    this.stompClient = new Client({
      // Función para crear la conexión WebSocket usando SockJS
      webSocketFactory: () => {
        return new SockJS(environment.wsUrl) as any;
      },

      // Configuración de reconexión
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Logs para debugging
      debug: (str: string) => {
      },

      // Callback cuando se conecta
      onConnect: (frame: any) => {
        
        this.connected$.next(true);
        
        // Suscribirse a los topics
        this.subscribeToTopics();
      },

      // Callback cuando se desconecta
      onDisconnect: (frame: any) => {

        this.connected$.next(false);
      },

      // Callback cuando hay error
      onStompError: (frame: any) => {
        
        this.connected$.next(false);
      },

      // Callback cuando hay error de conexión WebSocket
      onWebSocketError: (event: any) => {
        this.connected$.next(false);
      }
    });

    // Activar el cliente (inicia la conexión)
    this.stompClient.activate();
  }

  /**
   * Suscribirse a todos los topics del backend
   */
  private subscribeToTopics(): void {
    if (!this.stompClient || !this.stompClient.connected) {
      return;
    }


    // Suscribirse a posts creados
    this.stompClient.subscribe('/topic/post-created', (message: IMessage) => {
      const post = JSON.parse(message.body);
      this.newPosts$.next(post);
      this.messages$.next({
        type: 'NEW_POST',
        data: post,
        timestamp: new Date().toISOString()
      });
    });

    // Suscribirse a comentarios creados
    this.stompClient.subscribe('/topic/comment-created', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.newComments$.next(data);
      this.messages$.next({
        type: 'NEW_COMMENT',
        data,
        timestamp: new Date().toISOString()
      });
    });

    // Suscribirse a likes
    this.stompClient.subscribe('/topic/post-liked', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.postLikes$.next(data);
      this.messages$.next({
        type: 'LIKE',
        data,
        timestamp: new Date().toISOString()
      });
    });

    // Suscribirse a posts eliminados
    this.stompClient.subscribe('/topic/post-deleted', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.postDeleted$.next(data.postId);
      this.messages$.next({
        type: 'DELETE_POST',
        data,
        timestamp: new Date().toISOString()
      });
    });

    // Suscribirse a posts actualizados
    this.stompClient.subscribe('/topic/post-updated', (message: IMessage) => {
      const post = JSON.parse(message.body);
      this.postUpdated$.next(post);
      this.messages$.next({
        type: 'UPDATE_POST',
        data: post,
        timestamp: new Date().toISOString()
      });
    });

  }

  /**
   * Desconectar del servidor WebSocket
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected$.next(false);
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  /**
   * Enviar un mensaje al servidor (opcional - para casos bidireccionales)
   * Ejemplo: this.wsService.publish('/app/message', { content: 'Hello' });
   */
  publish(destination: string, body: any): void {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body)
      });
    } else {
      console.warn('[STOMP] No se puede enviar mensaje. Cliente no conectado.');
    }
  }

  /**
   * Observables públicos para suscribirse
   */
  get isConnected$(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  get allMessages$(): Observable<WebSocketMessage> {
    return this.messages$.asObservable();
  }

  get newPosts(): Observable<any> {
    return this.newPosts$.asObservable();
  }

  get newComments(): Observable<{ postId: number; comment: any }> {
    return this.newComments$.asObservable();
  }

  get postLikes(): Observable<{ postId: number; likesCount: number; userId: number }> {
    return this.postLikes$.asObservable();
  }

  get postDeleted(): Observable<number> {
    return this.postDeleted$.asObservable();
  }

  get postUpdated(): Observable<any> {
    return this.postUpdated$.asObservable();
  }
}
