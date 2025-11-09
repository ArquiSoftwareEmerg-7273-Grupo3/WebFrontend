import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-sidebar-component',
  imports: [
    RouterLink,
    MatToolbar
  ],
  templateUrl: './sidebar-component.component.html',
  styleUrl: './sidebar-component.component.css'
})
export class SidebarComponentComponent {

}
