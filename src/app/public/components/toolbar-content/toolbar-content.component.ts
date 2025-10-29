import { Component, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../content/pages/login/services/authentication.service';

@Component({
  selector: 'app-toolbar-content',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './toolbar-content.component.html',
  styleUrl: './toolbar-content.component.css'
})
export class ToolbarContentComponent {
  menuOpen = false;
  userRole: string = 'noRole'; // Valor inicial para pruebas

  // Variable para cambiar roles fácilmente durante pruebas
  availableRoles = ['noRole', 'illustrator', 'writer'];
  currentRoleIndex = 0;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService
  ) {
    // Comentamos la suscripción al servicio por ahora
    // this.authService.currentRole.subscribe(role => {
    //   this.userRole = role;
    //   this.cdr.detectChanges();
    // });
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768 && this.menuOpen) {
      this.menuOpen = false;
    }
  }

}
