import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from '../../services/admin-service.service';
import {DatePipe, NgIf} from '@angular/common';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import { MatCardContent, MatCardModule} from '@angular/material/card';

import {MatButtonModule} from '@angular/material/button';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

interface Report {
  id: string | number;
  [key: string]: any;
}

import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-reports-list-component',
  imports: [
    DatePipe,
    SidebarComponentComponent,
    MatCardModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    NgIf,
    MatCardContent,
    MatButtonModule
  ],
  templateUrl: './reports-list-component.component.html',
  styleUrl: './reports-list-component.component.css'
})


export class ReportsListComponentComponent implements OnInit {
  reports: Report[] = [];
  dataSource = new MatTableDataSource<Report>([]);
  loading = false;
  error = '';

  constructor(private svc: AdminServiceService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getReports().subscribe({
      next: (r: any) => {
        console.log('getReports response:', r);
        const data = Array.isArray(r) ? r : (r?.data ?? r?.items ?? []);
        this.reports = data as Report[];
        this.dataSource.data = this.reports;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reports:', err);
        this.error = 'No se pudieron cargar reportes';
        this.loading = false;
      }
    });
  }

  resolve(report: any, action: 'delete' | 'dismiss' | 'flag' | 'removeUser'): void {
    if (action === 'delete' && !confirm('Confirmar eliminación de la publicación?')) return;
    this.svc.resolveReport(report.id, action).subscribe({
      next: () => this.load(),
      error: () => alert('Error procesando acción')
    });
  }
}
