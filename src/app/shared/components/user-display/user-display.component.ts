import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumBadgeComponent } from '../premium-badge/premium-badge.component';
import { SubscriptionStatusService } from '../../services/subscription-status.service';

@Component({
  selector: 'app-user-display',
  standalone: true,
  imports: [CommonModule, PremiumBadgeComponent],
  template: `
    <div class="user-display">
      <div class="user-info">
        <span class="user-name">{{ userName }}</span>
        <app-premium-badge 
          [isPremium]="isPremium" 
          [size]="badgeSize"
          [iconOnly]="iconOnly">
        </app-premium-badge>
      </div>
      <div *ngIf="showEmail && userEmail" class="user-email">
        {{ userEmail }}
      </div>
    </div>
  `,
  styles: [`
    .user-display {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-name {
      font-weight: 600;
      font-size: 16px;
      color: #333;
    }

    .user-email {
      font-size: 14px;
      color: #666;
    }
  `]
})
export class UserDisplayComponent implements OnInit {
  @Input() userId!: number;
  @Input() userName: string = '';
  @Input() userEmail?: string;
  @Input() showEmail: boolean = false;
  @Input() badgeSize: 'normal' | 'small' = 'normal';
  @Input() iconOnly: boolean = false;
  
  isPremium: boolean = false;

  constructor(private subscriptionService: SubscriptionStatusService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.subscriptionService.checkSubscriptionStatus(this.userId).subscribe(
        isPremium => {
          this.isPremium = isPremium;
        }
      );
    }
  }
}
