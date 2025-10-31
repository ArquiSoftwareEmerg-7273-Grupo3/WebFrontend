
import {Component, HostListener, Input, ChangeDetectorRef, ElementRef, OnInit, OnDestroy} from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../content/pages/login/services/authentication.service';
import { BusinessMiniService } from '../../services/business-mini.service';
import {BusinessMiniVentanaComponent} from '../business-mini-ventana/business-mini-ventana.component';


@Component({
  selector: 'app-toolbar-content',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    BusinessMiniVentanaComponent
  ],
  templateUrl: './toolbar-content.component.html',
  styleUrl: './toolbar-content.component.css'
})
export class ToolbarContentComponent implements OnInit, OnDestroy {
  menuOpen = false;

  miniVentanaOpen = false;
  userRole: string = 'noRole'; // Valor inicial para pruebas

  // Variable para cambiar roles fácilmente durante pruebas
  availableRoles = ['noRole', 'illustrator', 'writer'];
  currentRoleIndex = 0;

  userRole: string = 'GENERAL';
  userInfo: UserInfoResponse | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService,
    private el: ElementRef,
    private businessMiniService: BusinessMiniService
  ) {
    // Comentamos la suscripción al servicio por ahora
    // this.authService.currentRole.subscribe(role => {
    //   this.userRole = role;
    //   this.cdr.detectChanges();
    // });
  }

  openBusinessMiniVentana(event: MouseEvent) {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement || (event.target as HTMLElement);
    const rect = target.getBoundingClientRect();
    const width = 650;
    let x = rect.left + (rect.width - width) / 2 + window.scrollX;
    x = Math.min(Math.max(x, 8), window.innerWidth - width - 8);
    const verticalOffset = 14;
    const y = rect.bottom + window.scrollY + verticalOffset;

    console.log('Business mini coords', { x, y, width });
    this.businessMiniService.toggle({ x, y });
  }

  // Método para cambiar roles durante pruebas
  switchRole() {
    this.currentRoleIndex = (this.currentRoleIndex + 1) % this.availableRoles.length;
    this.userRole = this.availableRoles[this.currentRoleIndex];
    this.cdr.detectChanges();
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de rol del usuario
    const roleSubscription = this.authService.currentRole.subscribe(role => {
      this.userRole = this.mapBackendRoleToFrontend(role);
      this.cdr.detectChanges();
    });

    // Suscribirse a la información completa del usuario
    const userInfoSubscription = this.authService.userInformation.subscribe(userInfo => {
      this.userInfo = userInfo;
      if (userInfo) {
        const role = UserRoleUtils.getUserRole(userInfo);
        this.userRole = this.mapBackendRoleToFrontend(role);
      }
      this.cdr.detectChanges();
    });

    this.subscriptions.push(roleSubscription, userInfoSubscription);

    // Cargar información del usuario si está autenticado
    this.loadUserInfo();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  get userBiografia(): string {
    return this.userInfo ? UserRoleUtils.getUserBiography(this.userInfo) : '';
  }

  get hasSuscripcion(): boolean {
    return this.userInfo ? UserRoleUtils.hasPremiumSubscription(this.userInfo) : false;
  }

  get userName(): string {
    return this.userInfo ? UserRoleUtils.getUserDisplayName(this.userInfo) : '';
  }

  get userPhoto(): string {
    return this.userInfo?.foto || 'assets/images/default-avatar.png';
  }

  get isUserIllustrator(): boolean {
    return this.userInfo ? UserRoleUtils.isIllustrator(this.userInfo) : false;
  }

  get isUserWriter(): boolean {
    return this.userInfo ? UserRoleUtils.isWriter(this.userInfo) : false;
  }

  private loadUserInfo() {
    this.authService.getUserInformation()
      .then(userInfo => {
        console.log('✔️ Información del usuario cargada en toolbar:', userInfo);
      })
      .catch(error => {
        console.warn('No se pudo cargar la información del usuario:', error);
      });
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
  
  logout() {
    this.authService.signOut();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768 && this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
