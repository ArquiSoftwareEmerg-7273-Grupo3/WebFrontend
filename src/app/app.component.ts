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

  private wasTutorialOpen = false;

  showNavbar = true;
  private hideNavbarRoutes = ['/login', '/register'];

  private routerSub?: Subscription;
  private authSub?: Subscription;
  private tutorialOpenSub?: Subscription;

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

  /**
   * private steps = [
   *     { selector: '', title: 'Estimado Usuario:', description: 'Actualmente, tienes funciones limitadas, es importante que te crees un perfil para obtener una experiencia más completa' },
   *     { selector: '', title: 'Completa tu perfil', description: 'Si te interesa crear ofertas y encontrar a las personas calificadas, debes registrarte como escritor' },
   *     { selector: '[data-test="btn-negocios"]', title: 'Abrir Negocios', description: 'Haga clic en "Negocios" y luego en "Crear perfil como escritor"' },
   *     { router: '/register/writer', selector: '[data-test="writer-form-submit"]', title: 'Crear perfil como escritor', description: 'En esta página complete los datos. Al finalizar este proceso, contará con un perfil de escritor activo.' },
   *     { router: '/home', selector: '.popup-registro-ilustrador .btn-primary', title: 'Completa tu perfil', description: 'Si te interesa crear portafolios y encontrar ofertas adecuadas a tu perfil, debes registrarte como ilustrador'},
   *     { router: '/perfil', selector: '[data-test="btn-completar"]', title: 'Enviar formulario', description: 'Para crear un perfil de ilustrador, deberá seleccionar la opción correspondiente y dirigirse al botón de \'Completar\', donde podrá ingresar los datos requeridos. Al finalizar este proceso, contará con un perfil de ilustrador activo.' , requiresAuth: true},
   *     { router: '/home', selector: '.popup-registro-ilustrador .btn-primary', title: 'Enviar formulario', description: 'Si no estás interesado en crear algún perfil, puedes continuar sin problema'}
   *   ];
   * @private
   */

  private steps = [
    { selector: '', title: 'Estimado Usuario:', description: 'Actualmente, tienes funciones limitadas, es importante que te crees un perfil para obtener una experiencia más completa' },
    { selector: '', title: 'Completa tu perfil', description: 'Si te interesa crear ofertas y encontrar a las personas calificadas, debes registrarte como escritor' },
    { selector: '[data-test="btn-negocios"]', title: 'Abrir Negocios', description: 'Haga clic en "Negocios" y luego en "Crear perfil como escritor"' },
    { selector: '[data-test="writer-form-submit"]', title: 'Crear perfil como escritor', description: 'En esta página complete los datos. Al finalizar este proceso, contará con un perfil de escritor activo.' },
    { selector: '.popup-registro-ilustrador .btn-primary', title: 'Completa tu perfil', description: 'Si te interesa crear portafolios y encontrar ofertas adecuadas a tu perfil, debes registrarte como ilustrador'},
    { selector: '[data-test="btn-completar"]', title: 'Enviar formulario', description: 'Para crear un perfil de ilustrador, deberá seleccionar la opción correspondiente y dirigirse al botón de \'Completar\', donde podrá ingresar los datos requeridos. Al finalizar este proceso, contará con un perfil de ilustrador activo.' , requiresAuth: true},
    { selector: '.popup-registro-ilustrador .btn-primary', title: 'Enviar formulario', description: 'Si no estás interesado en crear algún perfil, puedes continuar sin problema'}
  ];

  ngOnInit() {
    this.authSub = this.authenticationService.isSignedIn.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
      if (isSignedIn) {
        this.maybeStartTutorialAfterLogin();
      }
    });

    this.tutorialOpenSub = this.miniTutorialService.isOpen$.subscribe(open => {
      if (open) {
        // Solo marcar "wasTutorialOpen" si el componente está montado en el DOM
        const el = document.querySelector('app-mini-tutorial');
        if (el) {
          this.wasTutorialOpen = true;
        } else {
          console.warn('[mini-tutorial] intento de abrir pero componente no está en DOM -> no marcar como visto');
        }
      } else if (!open && this.wasTutorialOpen) {
        (async () => {
          const key = await this.currentUserStorageKey();
          console.debug('[mini-tutorial] cerrado, clave calculada =', key);
          if (key) {
            localStorage.setItem(key, '1');
            console.debug('[mini-tutorial] guardado en localStorage:', key);
          } else {
            console.warn('[mini-tutorial] no hay clave de usuario para guardar el estado');
          }
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

  private async currentUserStorageKey(): Promise<string | null> {
    try {
      const id = await firstValueFrom(
        this.authenticationService.currentUserId.pipe(
          filter(id => id != null && true && id > 0),
          take(1)
        )
      );
      if (id != null) {
        const key = this.STORAGE_PREFIX + id;
        console.debug('[mini-tutorial] userId disponible, key=', key);
        return key;
      }
    } catch (e) {
      console.debug('[mini-tutorial] currentUserId wait failed', e);
    }

    try {
      const name = await firstValueFrom(
        this.authenticationService.currentUsername.pipe(
          filter(n => !!n && n !== '0'),
          take(1)
        )
      );
      if (name) {
        const key = this.STORAGE_PREFIX + encodeURIComponent(name);
        console.debug('[mini-tutorial] username disponible, key=', key);
        return key;
      }
    } catch (e) {
      console.debug('[mini-tutorial] currentUsername wait failed', e);
    }

    // No hay datos de usuario aún -> devolver null para reintentar
    console.debug('[mini-tutorial] no hay datos de usuario aún, devolver null');
    return null;
  }


  private async maybeStartTutorialAfterLogin() {
    const key = await this.currentUserStorageKey();

    if (!key) {
      setTimeout(() => this.maybeStartTutorialAfterLogin(), 300);
      return;
    }

    const completed = !!localStorage.getItem(key);
    console.debug('[mini-tutorial] clave=', key, 'completed=', completed);

    if (completed) return;

    // esperar hasta que el host del tutorial esté en el DOM (timeout total ~2s)
    const waitForHost = async (timeoutMs = 2000, interval = 100) => {
      const max = Math.ceil(timeoutMs / interval);
      for (let i = 0; i < max; i++) {
        if (document.querySelector('app-mini-tutorial')) return true;
        await new Promise(r => setTimeout(r, interval));
      }
      return false;
    };

    const hostPresent = await waitForHost();
    if (!hostPresent) {
      console.warn('[mini-tutorial] host no presente tras esperar -> lanzando fallback');
    }
    setTimeout(() => this.miniTutorialService.start(this.steps), hostPresent ? 300 : 0);
  }

  getName(){
    this.authenticationService.currentUsername.subscribe(username => this.username = username);
    console.log(this.username);
  }
  getId(){
    this.authenticationService.currentUserId.subscribe(id => this.userId = id);
  }

}
