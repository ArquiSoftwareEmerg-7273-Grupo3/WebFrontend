import { Component } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-popup-registro-ilustrador',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './popup-registro-ilustrador.component.html',
  styleUrl: './popup-registro-ilustrador.component.css'
})
export class PopupRegistroIlustradorComponent {
  constructor(private dialogRef: MatDialogRef<PopupRegistroIlustradorComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

}
