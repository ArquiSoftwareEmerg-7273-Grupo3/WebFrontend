import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngIf="isPremium" class="premium-badge" [title]="tooltipText">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
      <span class="premium-text">Premium</span>
    </span>
  `,
  styles: [`
    .premium-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 8px;
      cursor: help;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .premium-badge:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .premium-badge svg {
      width: 16px;
      height: 16px;
      animation: sparkle 2s ease-in-out infinite;
    }

    .premium-text {
      letter-spacing: 0.5px;
    }

    @keyframes sparkle {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }

    /* Variante pequeña */
    .premium-badge.small {
      padding: 2px 6px;
      font-size: 10px;
    }

    .premium-badge.small svg {
      width: 12px;
      height: 12px;
    }

    /* Variante solo icono */
    .premium-badge.icon-only .premium-text {
      display: none;
    }

    .premium-badge.icon-only {
      padding: 4px;
      border-radius: 50%;
    }
  `]
})
export class PremiumBadgeComponent {
  @Input() isPremium: boolean = false;
  @Input() size: 'normal' | 'small' = 'normal';
  @Input() iconOnly: boolean = false;
  @Input() tooltipText: string = 'Usuario Premium - Suscripción activa';
}
