import {ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-analysis',
  imports: [
    RouterLink
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {

  constructor(
    private router: Router,
  ){}

  goToApplicants() {
    this.router.navigate(['recommendations/analysis/:id/applicants']);
  }
}
