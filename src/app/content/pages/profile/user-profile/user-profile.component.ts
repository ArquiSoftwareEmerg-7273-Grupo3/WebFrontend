import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, UserProfile } from '../../home/services/users.service';
import { PortfolioService } from '../../portfolios/services/portfolio.service';
import { IlustrationService } from '../../portfolios/services/ilustration.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserProfile | null = null;
  userId: number = 0;
  loading = true;
  error = '';

  portfolios: any[] = [];
  illustrations: any[] = [];
  projects: any[] = [];

  activeTab: 'portfolio' | 'projects' = 'portfolio';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private portfolioService: PortfolioService,
    private illustrationService: IlustrationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    this.usersService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        console.log('=== USER PROFILE DATA ===');
        console.log('Full user object:', user);
        console.log('user.ilustrador:', user.ilustrador);
        console.log('user.ilustrador?.suscripcion:', user.ilustrador?.suscripcion);
        console.log('typeof suscripcion:', typeof user.ilustrador?.suscripcion);
        console.log('========================');
        this.loading = false;

        if (this.isIllustrator()) {
          this.loadIllustratorContent();
        } else if (this.isWriter()) {
          this.loadWriterContent();
        }
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil';
        this.loading = false;
      }
    });
  }

  loadIllustratorContent(): void {
    // Cargar portafolios del ilustrador
    this.portfolioService.getPortfoliosByUserId(this.userId).subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
      },
      error: (err) => console.error('Error cargando portafolios', err)
    });
  }

  loadWriterContent(): void {
    // Cargar proyectos publicados del escritor
    // TODO: Implementar servicio de proyectos
  }

  isIllustrator(): boolean {
    const result = this.user?.ilustrador !== null && this.user?.ilustrador !== undefined;
    console.log('isIllustrator:', result, 'user:', this.user);
    return result;
  }

  isWriter(): boolean {
    return this.user?.escritor !== null && this.user?.escritor !== undefined;
  }

  isPremium(): boolean {
    const suscripcion = this.user?.ilustrador?.suscripcion;
    // Manejar tanto boolean como number (0/1) - el backend podría devolver cualquiera
    const result = suscripcion === true || (suscripcion as any) === 1 || (suscripcion as any) === '1';
    console.log('isPremium:', result, 'suscripcion:', suscripcion, 'type:', typeof suscripcion);
    return result;
  }

  goToPortfolio(portfolioId: number): void {
    this.router.navigate(['/portfolios/information', portfolioId]);
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/information/project', projectId]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
