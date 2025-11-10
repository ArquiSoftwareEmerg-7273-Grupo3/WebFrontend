import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgIf, NgStyle} from '@angular/common';
import {OptionsIconService, OptionsIconState} from '../../services/options-icon.service';
import {AuthenticationService} from '../../../content/pages/login/services/authentication.service';

@Component({
  selector: 'app-options-icon',
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './options-icon.component.html',
  styleUrl: './options-icon.component.css'
})
export class OptionsIconComponent implements OnInit, OnDestroy {
  visible = false;
  left = 0;
  top = 0;
  private sub = new Subscription();

  constructor(
    private el: ElementRef,
    private service: OptionsIconService,
    private router: Router,
    private authService: AuthenticationService
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
