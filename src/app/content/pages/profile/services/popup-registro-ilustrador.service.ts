import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PopupRegistroIlustradorComponent} from '../popup-registro-ilustrador/popup-registro-ilustrador.component';

@Injectable({
  providedIn: 'root'
})
export class PopupRegistroIlustradorService {
  constructor(private dialog: MatDialog) { }

  openPopup(config: { width?: string } = { width: '520px' }) {
    this.dialog.open(PopupRegistroIlustradorComponent, {
      width: config.width,
      disableClose: false,
      autoFocus: false
    });
  }
}
