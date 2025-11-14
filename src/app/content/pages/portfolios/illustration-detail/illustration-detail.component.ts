import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IlustrationService } from '../services/ilustration.service';
import { IllustrationRatingComponent } from '../components/illustration-rating/illustration-rating.component';

@Component({
  selector: 'app-illustration-detail',
  standalone: true,
  imports: [CommonModule, IllustrationRatingComponent],
  templateUrl: './illustration-detail.component.html',
  styleUrl: './illustration-detail.component.css'
})
export class IllustrationDetailComponent implements OnInit {
  illustration: any = null;
  illustrationId!: number;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private illustrationService: IlustrationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('illustrationId');
    if (id) {
      this.illustrationId = Number(id);
      this.loadIllustration();
    }
  }

  loadIllustration() {
    this.illustrationService.getIllustrationSummary(this.illustrationId).subscribe({
      next: (data) => {
        this.illustration = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando ilustración:', err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
