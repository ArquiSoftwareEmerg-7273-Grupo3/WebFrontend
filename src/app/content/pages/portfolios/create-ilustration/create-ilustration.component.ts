import {Component, OnInit} from '@angular/core';
import {Location, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PortfolioService} from '../services/portfolio.service';
import {Ilustration} from '../model/ilustration.entity';
import {AuthenticationService} from '../../login/services/authentication.service';
import {firstValueFrom, map, Observable, switchMap} from 'rxjs';
import {IlustrationService} from '../services/ilustration.service';

@Component({
  selector: 'app-create-ilustration',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './create-ilustration.component.html',
  styleUrl: './create-ilustration.component.css'
})
export class CreateIlustrationComponent implements OnInit {
  title = '';
  description = '';
  image = '';

  private portfolioId: string | null = null;
  protected portfolioIdNum: number | null = null;
  private ilustradorId: number | null = null;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private portfolioService: PortfolioService,
              private authService: AuthenticationService,
              private ilustrationService: IlustrationService
  ) {}

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.paramMap.get('portfolioId');
    this.portfolioIdNum = this.portfolioId ? Number(this.portfolioId) : null;
    this.authService.getIlustradorId$().subscribe((id: number | null) => {
      this.ilustradorId = id;
      console.log('Suscripción ilustradorId ->', this.ilustradorId);
    });
  }

  // Asegura que tengamos el ilustradorId: usa cache o fuerza carga desde el servicio
  private async ensureIlustradorId(): Promise<number | null> {
    if (this.ilustradorId) return this.ilustradorId;
    try {
      const id = await firstValueFrom(this.authService.getIlustradorId$());
      this.ilustradorId = id;
      console.log('ensureIlustradorIdNum ->', this.ilustradorId);
      return this.ilustradorId;
    } catch (e) {
      console.error('Error obteniendo ilustradorId numérico', e);
      return null;
    }
  }

  async createIllustration() {
    if (!this.portfolioIdNum || isNaN(this.portfolioIdNum)) {
      alert('ID de portafolio inválido. No se puede crear la ilustración.');
      return;
    }

    const id = await this.ensureIlustradorId();
    if (id == null) {
      alert('No se encontró el ID del ilustrador.');
      return;
    }

    const titulo = (this.title || '').trim();
    const descripcion = (this.description || '').trim();
    const urlImagen = (this.image || '').trim();

    if (!titulo) { alert('El título es obligatorio'); return; }
    if (!urlImagen) { alert('La imagen es obligatoria'); return; }

    const ilustrationPayload = { titulo, descripcion, urlImagen };

    this.ilustrationService.publicIlustration(ilustrationPayload as any, id).pipe(
      switchMap((created: any) => {
        let createdObj: any = created;
        if (typeof created === 'string') {
          try {
            createdObj = JSON.parse(created);
          } catch {
            createdObj = { urlImagen: created };
          }
        }
        if (!createdObj) createdObj = {};
        // normalizar createdObj...
        const createdId = Number(createdObj?.id ?? createdObj?.ilustracionId ?? NaN);
        const payloadForPortfolio = {
          ilustracionId: isFinite(createdId) ? createdId : 0,
          titulo: createdObj?.titulo ?? titulo,
          descripcion: createdObj?.descripcion ?? descripcion,
          urlImagen: createdObj?.urlImagen ?? urlImagen
        };

        // Ahora se pasa el ilustradorId (id)
        return this.portfolioService.createIlustration(this.portfolioIdNum!, id, payloadForPortfolio);
      })
    ).subscribe({
      next: () => { alert('Ilustración creada y asignada al portafolio con éxito'); this.location.back(); },
      error: (err: any) => { console.error(err); alert('Error al crear la ilustración: ' + (err?.message || JSON.stringify(err))); }
    });
  }

  goBack() {
    this.location.back();
  }
}
