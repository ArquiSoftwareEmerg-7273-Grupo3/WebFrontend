import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MiniTutorialService, MiniTutorialStep} from '../../services/mini-tutorial.service';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-mini-tutorial',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './mini-tutorial.component.html',
  styleUrl: './mini-tutorial.component.css'
})
export class MiniTutorialComponent implements OnInit, OnDestroy {
  isOpen = false;
  current: MiniTutorialStep | null = null;
  highlightStyle: any = {};
  panelStyle: any = {};
  atFirst = true;
  atLast = false;

  private subs = new Subscription();

  constructor(private tour: MiniTutorialService) {}

  ngOnInit() {
    this.subs.add(this.tour.isOpen$.subscribe(open => (this.isOpen = open)));
    this.subs.add(this.tour.steps$.subscribe(() => this.updateStep()));
    this.subs.add(this.tour.index$.subscribe(() => this.updateStep()));
    window.addEventListener('resize', this.onResizeBound);
    window.addEventListener('scroll', this.onScrollBound, true);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    window.removeEventListener('resize', this.onResizeBound);
    window.removeEventListener('scroll', this.onScrollBound, true);
  }

  private onResizeBound = () => this.updateStep();
  private onScrollBound = () => this.updateStep();

  private updateStep() {
    const steps = (this.tour as any)._steps$?.value as MiniTutorialStep[] | null;
    const index = (this.tour as any)._index$?.value as number;
    if (!steps || index == null || !this.isOpen) {
      this.current = null;
      this.highlightStyle = {};
      this.panelStyle = {};
      return;
    }
    this.current = steps[index] ?? null;
    this.atFirst = index <= 0;
    this.atLast = index >= steps.length - 1;

    if (!this.current) return;
    const padding = this.current.padding ?? 8;
    const el = this.current.selector ? document.querySelector(this.current.selector) as HTMLElement | null : null;

    if (!el) {
      this.highlightStyle = { width: '0px', height: '0px', top: '50%', left: '50%' };
      this.panelStyle = { left: '50%', top: '40%', transform: 'translate(-50%, -50%)' };
      return;
    }

    const rect = el.getBoundingClientRect();
    const left = rect.left + window.scrollX - padding;
    const top = rect.top + window.scrollY - padding;
    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;

    this.highlightStyle = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.max(30, width)}px`,
      height: `${Math.max(30, height)}px`
    };

    const panelLeft = left;
    let panelTop = top + height + 12;
    if (panelTop + 160 > window.scrollY + window.innerHeight) {
      panelTop = top - 160 - 12;
    }
    this.panelStyle = {
      left: `${Math.min(panelLeft, window.scrollX + window.innerWidth - 340)}px`,
      top: `${panelTop}px`
    };
  }

  next() { this.tour.next(); }
  prev() { this.tour.prev(); }
  stop() { this.tour.stop(); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.isOpen) return;
    if (e.key === 'Escape') this.stop();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }
}
