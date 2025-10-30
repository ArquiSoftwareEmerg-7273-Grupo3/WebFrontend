import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SignUpRequest} from '../model/sign-up.request';
import {SignInRequest} from '../model/sign-in.request';
import {AuthResponse} from '../model/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  // Bandera para activar/desactivar el modo de simulación
  private simulationMode: boolean = false;

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername : BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInRole: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router, private http: HttpClient) {
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

  // Método para activar/desactivar el modo de simulación
  setSimulationMode(enabled: boolean) {
    this.simulationMode = enabled;
    console.log(`Modo de simulación: ${enabled ? 'activado' : 'desactivado'}`);
  }

  signUp(signUpRequest: SignUpRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.simulationMode) {
        // Simular un registro exitoso
        console.log('Modo simulación: Registro exitoso', signUpRequest);
        alert('Registro exitoso (Modo simulación)');
        this.router.navigate(['/sign-in']).then(() => resolve());
        return;
      }

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
      if (this.simulationMode) {
        // Simular un inicio de sesión exitoso
        this.signedIn.next(true);
        this.signedInUserId.next(1);
        this.signedInRole.next('ARTIST');
        this.signedInUsername.next(signInRequest.username);
        localStorage.setItem('token', 'simulation-token');
        console.log('Modo simulación: Inicio de sesión exitoso', signInRequest);
        this.router.navigate(['/']).then(() => resolve());
        return;
      }

      this.http.post<AuthResponse>(`${this.basePath}/api/v1/authentication/sign-in`, signInRequest, this.httpOptions)
        .subscribe({
          next: (response) => {
            this.signedIn.next(true);
            this.signedInUserId.next(response.id);
            this.signedInRole.next(response.role);
            this.signedInUsername.next(response.username);
            localStorage.setItem('token', response.token);
            console.log(`Signed In as ${response.username} with token: ${response.token}`);
            this.router.navigate(['/']).then(() => resolve());
          },
          error: (error) => {
            this.signedIn.next(false);
            this.signedInUserId.next(0);
            this.signedInUsername.next('');
            localStorage.removeItem('token');
            console.error(`Error while signing in: ${error.message}`);
            this.router.navigate(['/sign-in']).then(() => reject(error));
          }
        });
    });
  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }
}
