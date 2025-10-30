import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {BusinessMiniService, BusinessMiniState} from '../../services/business-mini.service';
import {CommonModule, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-business-mini-ventana',
  imports: [
    NgStyle,
    NgIf,
    CommonModule
  ],
  templateUrl: './business-mini-ventana.component.html',
  styleUrl: './business-mini-ventana.component.css'
})
export class BusinessMiniVentanaComponent implements OnInit, OnDestroy {
  visible = false;
  left = 0;
  top = 0;
  private sub = new Subscription();

  constructor(
    private el: ElementRef,
    private service: BusinessMiniService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub.add(
      this.service.state.subscribe((s: BusinessMiniState) => {
        this.visible = s.open;
        if (s.x !== undefined) this.left = s.x;
        if (s.y !== undefined) this.top = s.y;
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  navigate(path: string) {
    this.service.close();
    this.router.navigate([path]);
  }

  // Cerrar si se hace click fuera del componente
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.visible) return;
    if (!this.el.nativeElement.contains(ev.target)) {
      this.service.close();
    }
  }

  // evitar que clicks internos cierren la ventana
  stop(ev: MouseEvent) { ev.stopPropagation(); }
}
