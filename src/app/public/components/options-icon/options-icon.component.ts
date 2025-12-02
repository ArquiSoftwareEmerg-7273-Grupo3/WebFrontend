import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';
import { OptionsIconService, OptionsIconState } from '../../services/options-icon.service';
import { AuthenticationService } from '../../../content/pages/login/services/authentication.service';
import { SubscriptionStatusService } from '../../../shared/services/subscription-status.service';
import { PremiumBadgeComponent } from '../../../shared/components/premium-badge/premium-badge.component';
import { UserInfoResponse } from '../../../content/pages/login/model/user-info.response';

@Component({
  selector: 'app-options-icon',
  imports: [
    NgStyle,
    NgIf,
    PremiumBadgeComponent
  ],
  templateUrl: './options-icon.component.html',
  styleUrl: './options-icon.component.css'
})
export class OptionsIconComponent implements OnInit, OnDestroy {
  visible = false;
  left = 0;
  top = 0;
  isPremium = false;
  userName = '';
  userEmail = '';
  private sub = new Subscription();

  constructor(
    private el: ElementRef,
    private service: OptionsIconService,
    private router: Router,
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionStatusService
  ) {
  }

  ngOnInit() {
    this.sub.add(
      this.service.state.subscribe((s: OptionsIconState) => {
        this.visible = s.open;
        if (s.x !== undefined) this.left = s.x;
        if (s.y !== undefined) this.top = s.y;
      })
    );

    // Cargar información del usuario y estado de suscripción
    this.loadUserInfo();
  }

  private loadUserInfo() {
    this.authService.getUserInformation()
      .then((userInfo: UserInfoResponse | null) => {
        if (userInfo) {
          this.userName = `${userInfo.nombres} ${userInfo.apellidos}` || userInfo.username || '';
          this.userEmail = userInfo.username || ''; // UserInfoResponse no tiene email, usamos username

          // Verificar estado de suscripción
          this.subscriptionService.checkSubscriptionStatus(userInfo.id).subscribe(
            isPremium => {
              this.isPremium = isPremium;
            }
          );
        }
      })
      .catch(error => {
        console.warn('No se pudo cargar la información del usuario:', error);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  navigate(path: string) {
    this.service.close();
    this.router.navigate([path]);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.visible) return;
    if (!this.el.nativeElement.contains(ev.target)) {
      this.service.close();
    }
  }

  stop(ev: MouseEvent) {
    ev.stopPropagation();
  }

  logout() {
    this.authService.signOut();
  }
}
