import {Component, OnInit} from '@angular/core';
import {Location, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PortfolioService} from '../services/portfolio.service';

@Component({
  selector: 'app-create-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './create-portfolio.component.html',
  styleUrl: './create-portfolio.component.css'
})
export class CreatePortfolioComponent implements OnInit {
  title = '';
  description = '';
  image = '';

  cannotCreateMore = false;
  private storageKey = 'portfolio:created';

  constructor(private location: Location, private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.cannotCreateMore = !!localStorage.getItem(this.storageKey);
  }

  createPorfolio() {
    if (this.cannotCreateMore) {
      alert('Ya has creado un portafolio. No puedes crear más.');
      return;
    }

    const trimmedTitle = (this.title || '').trim();
    const trimmedDescription = (this.description || '').trim();
    const imageUrl = (this.image || '').trim();

    const portfolio: any = {
      titulo: trimmedTitle,
      descripcion: trimmedDescription,
      urlImagen: imageUrl
    };

    this.portfolioService.createPortfolio(portfolio).subscribe({
      next: () => {
        this.cannotCreateMore = true;
        localStorage.setItem(this.storageKey, '1');
        alert('Portafolio creado con éxito. Ya no puedes crear más.');
        this.location.back();
      },
      error: (err: any) => {
        console.error('Error creando portafolio', err);
        const serverMessage = err?.error?.message || err?.error || err?.message || JSON.stringify(err);
        if (err?.status && err.status >= 500) {
          this.cannotCreateMore = true;
          localStorage.setItem(this.storageKey, '1');
          alert('No puedes crear más portafolios.');
          this.location.back();
          return;
        }
        alert('Error interno al procesar la solicitud: ' + serverMessage);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
