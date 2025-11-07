import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ToolbarContentComponent} from './public/components/toolbar-content/toolbar-content.component';
import {AuthenticationService} from './content/pages/login/services/authentication.service';
import {filter, firstValueFrom, Subscription, take} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {NgIf} from '@angular/common';
import {MiniTutorialComponent} from './content/pages/mini-tutorial/mini-tutorial/components/mini-tutorial/mini-tutorial.component';
import {MiniTutorialService} from './content/pages/mini-tutorial/mini-tutorial/services/mini-tutorial.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarContentComponent, HttpClientModule, NgIf, MiniTutorialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ArtCollab';
  isSignedIn: boolean = false;
  username: string = "";
  userId: number | null = null;

  private STORAGE_PREFIX = 'mini-tutorial-completed:';
  private FALLBACK_SUFFIX = 'global';
  private wasTutorialOpen = false;

  showNavbar = true;
  private hideNavbarRoutes = ['/login', '/register'];

  private routerSub?: Subscription;
  private authSub?: Subscription;
  private tutorialOpenSub?: Subscription;

  private steps = [
    { selector: '', title: 'Estimado Usuario:', description: 'Actualmente, tienes funciones limitadas, es importante que te crees un perfil para obtener una experiencia más completa' },
    { selector: '', title: 'Completa tu perfil', description: 'Si te interesa crear ofertas y encontrar a las personas calificadas, debes registrarte como escritor' },
    { selector: '[data-test="create-writer"]', title: 'Enviar formulario', description: 'Para crear un perfil de escritor, deberá seleccionar la opción correspondiente, lo cual le permitirá completar los datos necesarios. Al finalizar este proceso, contará con un perfil de escritor activo.' },
    { selector: '.popup-registro-ilustrador .btn-primary', title: 'Enviar formulario', description: 'Si te interesa crear portafolios y encontrar ofertas adecuadas a tu perfil, debes registrarte como ilustrador'},
    { route: '/perfil', selector: '[data-test="btn-completar"]', title: 'Enviar formulario', description: 'Para crear un perfil de ilustrador, deberá seleccionar la opción correspondiente y dirigirse al botón de \'Completar\', donde podrá ingresar los datos requeridos. Al finalizar este proceso, contará con un perfil de ilustrador activo.'},
    { selector: '.popup-registro-ilustrador .btn-primary', title: 'Enviar formulario', description: 'Si no estás interesado en crear algún perfil, puedes continuar sin problema'}
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private miniTutorialService: MiniTutorialService
  ) {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !this.hideNavbarRoutes.includes(event.urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.authSub = this.authenticationService.isSignedIn.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      if (isSignedIn) {
        this.maybeStartTutorialAfterLogin();
      }
    });

    this.tutorialOpenSub = this.miniTutorialService.isOpen$.subscribe(open => {
      if (open) {
        this.wasTutorialOpen = true;
      } else if (!open && this.wasTutorialOpen) {
        (async () => {
          const key = await this.currentUserStorageKey();
          if (key) localStorage.setItem(key, '1');
          this.wasTutorialOpen = false;
        })();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.authSub?.unsubscribe();
    this.tutorialOpenSub?.unsubscribe();
  }

  private async currentUserStorageKey(): Promise<string> {
    try {
      const id = await firstValueFrom(this.authenticationService.currentUserId.pipe(take(1)));
      console.log("Storage key user id:", id);
      if (id != null) return this.STORAGE_PREFIX + id;
      const name = await firstValueFrom(this.authenticationService.currentUsername.pipe(take(1)));
      if (name) return this.STORAGE_PREFIX + encodeURIComponent(name);
    } catch {
      // ignore
    }
    // siempre devolver una clave fallback para que no retorne null
    return this.STORAGE_PREFIX + this.FALLBACK_SUFFIX;
  }

  private async maybeStartTutorialAfterLogin() {
    const key = await this.currentUserStorageKey();
    // si por alguna razón no tenemos key (defensivo), reintentar
    if (!key) {
      setTimeout(() => this.maybeStartTutorialAfterLogin(), 300);
      return;
    }

    const completed = !!localStorage.getItem(key);
    if (completed) return;

    // marcar inmediatamente como mostrado para evitar que vuelva a iniciarse por condiciones de carrera
    try {
      localStorage.setItem(key, '1');
      console.log('MiniTutorial: marcado como completado para', key);
    } catch (e) {
      console.warn('No se pudo escribir en localStorage', e);
    }

    // pequeña espera para que la UI termine de renderizar y luego arrancar
    setTimeout(() => this.miniTutorialService.start(this.steps), 300);
  }

  getName(){
    this.authenticationService.currentUsername.subscribe(username => this.username = username);
    console.log(this.username);
  }
  getId(){
    this.authenticationService.currentUserId.subscribe(id => this.userId = id);
  }
}
