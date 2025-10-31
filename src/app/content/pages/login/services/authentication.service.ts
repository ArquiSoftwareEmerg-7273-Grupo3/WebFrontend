import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SignUpRequest} from '../model/sign-up.request';
import {SignInRequest} from '../model/sign-in.request';
import {AuthResponse} from '../model/auth-response';
import {UserInfoResponse} from '../model/user-info.response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  // Bandera para activar/desactivar el modo de simulación

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername : BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInRole: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private userInfo: BehaviorSubject<UserInfoResponse | null> = new BehaviorSubject<UserInfoResponse | null>(null);

  constructor(private router: Router, private http: HttpClient) {
    // Verificar si hay un token almacenado al inicializar el servicio
    this.checkStoredAuth();
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }
  get currentUsername() {
    return this.signedInUsername.asObservable();
  }
  get currentRole(){
    return this.signedInRole.asObservable();
  }
  
  get userInformation(){
    return this.userInfo.asObservable();
  }

  // Método para activar/desactivar el modo de simulación
  

  // Verificar si hay autenticación almacenada
  private checkStoredAuth() {
    const token = localStorage.getItem('token');
    if (token && token !== 'simulation-token') {
      this.signedIn.next(true);
      this.loadUserInformation();
    }
  }

  // Cargar información del usuario desde el backend
  loadUserInformation(): Promise<UserInfoResponse | null> {
    return new Promise((resolve, reject) => {

      this.http.get<UserInfoResponse>(`${this.basePath}/api/v1/users/me`, this.httpOptions)
        .subscribe({
          next: (response) => {
            console.log('✔️ Información del usuario obtenida:', response);
            this.userInfo.next(response);
            
            // Determinar el rol basado en la información específica presente
            const role = this.determineUserRole(response);
            this.signedInRole.next(role);
            this.signedInUsername.next(response.username);
            this.signedInUserId.next(response.id);
            resolve(response);
          },
          error: (error) => {
            console.error('❌ Error al obtener la información del usuario:', error);
            // Si hay error al obtener info del usuario, limpiar la sesión
            this.signOut();
            reject(error);
          }
        });
    });
  }

  // Método público para obtener información del usuario
  getUserInformation(): Promise<UserInfoResponse | null> {
    return this.loadUserInformation();
  }

  // Determinar el rol del usuario basado en la información específica presente
  private determineUserRole(userInfo: UserInfoResponse): string {
    if (userInfo.ilustrador && userInfo.ilustrador !== null) {
      return 'ILLUSTRATOR';
    } else if (userInfo.escritor && userInfo.escritor !== null) {
      return 'WRITER';
    } else {
      return 'GENERAL'; // Rol por defecto si no tiene información específica
    }
  }
  signUp(signUpRequest: SignUpRequest): Promise<void> {
    return new Promise((resolve, reject) => {

      this.http.post(`${this.basePath}/api/v1/authentication/sign-up`, signUpRequest, this.httpOptions)
        .subscribe({
          next: (response) => {
            console.log(`✔️ Usuario registrado exitosamente`);
            alert('Registro exitoso');
            this.router.navigate(['/sign-in']).then(() => resolve());
          },
          error: (error) => {
            console.error(`❌ Error while signing up: ${error.message}`);
            alert(`Error: ${error.message}`);
            reject(error);
          }
        });
    });
  }

  signIn(signInRequest: SignInRequest) : Promise<void> {
    return new Promise((resolve, reject) => {
  
      this.http.post<AuthResponse>(`${this.basePath}/api/v1/authentication/sign-in`, signInRequest, this.httpOptions)
        .subscribe({
          next: (response) => {
            this.signedIn.next(true);
            this.signedInUserId.next(response.id);
            this.signedInRole.next(response.role);
            this.signedInUsername.next(response.username);
            localStorage.setItem('token', response.token);
            console.log(`✔️ Signed In as ${response.username} with token: ${response.token}`);
            
            // Cargar información completa del usuario
            this.loadUserInformation()
              .then(() => {
                this.router.navigate(['/home']).then(() => resolve());
              })
              .catch(error => {
                console.warn('No se pudo cargar la información completa del usuario:', error);
                this.router.navigate(['/home']).then(() => resolve());
              });
          },
          error: (error) => {
            this.signedIn.next(false);
            this.signedInUserId.next(0);
            this.signedInUsername.next('');
            localStorage.removeItem('token');
            console.error(`❌ Error while signing in: ${error.message}`);
            this.router.navigate(['/sign-in']).then(() => reject(error));
          }
        });
    });
  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    this.signedInRole.next('');
    this.userInfo.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then();
  }

 
}
