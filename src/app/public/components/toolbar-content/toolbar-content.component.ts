import {Component, HostListener, Input, ChangeDetectorRef, ElementRef} from '@angular/core';
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
export class ToolbarContentComponent {
  menuOpen = false;
  miniVentanaOpen = false;
  userRole: string = 'noRole'; // Valor inicial para pruebas

  // Variable para cambiar roles fácilmente durante pruebas
  availableRoles = ['noRole', 'illustrator', 'writer'];
  currentRoleIndex = 0;

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
  }

  get isIllustrator(): boolean {
    return this.userRole === 'illustrator';
  }

  get isWriter(): boolean {
    return this.userRole === 'writer';
  }

  get isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  get isNoRole(): boolean {
    return this.userRole === 'noRole';
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

}
