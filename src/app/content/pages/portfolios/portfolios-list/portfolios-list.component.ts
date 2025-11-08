import {Component, HostListener} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from '@angular/router';
import {PortfolioCardComponent} from '../../home/components/portfolio-card/portfolio-card.component';
import {
  PortfolioCardWriterComponent
} from './components/portfolio-card-writer/portfolio-card-writer.component';
import {Portfolio} from '../model/portfolio.entity';
import {EditPortfolioComponent} from '../edit-portfolio/edit-portfolio.component';

@Component({
  selector: 'app-portfolios-list',
  standalone: true,
  imports: [
    NgForOf,
    PortfolioCardWriterComponent,
    NgIf,
    EditPortfolioComponent
  ],
  templateUrl: './portfolios-list.component.html',
  styleUrl: './portfolios-list.component.css'
})
export class PortfoliosListComponent {
  portfolios: Portfolio[] = [
    {
      id: 1,
      title: 'Retratos',
      imageSrc: 'https://png.pngtree.com/thumb_back/fh260/background/20230527/pngtree-how-to-draw-a-portrait-using-pencils-image_2676967.jpg',
      description: 'Este proyecto trata sobre crear cuentos ilustrados con animales fantásticos que enseñen valores a los niños. A través de personajes mágicos y situaciones sorprendentes, se busca estimular la creatividad y la imaginación infantil. Además, se abordarán temas como la empatía, el respeto por la diversidad y la importancia de la amistad en un formato lúdico y educativo que permitirá a los niños aprender mientras se divierten.',
      showMenu: false,
    },
    {
      id: 2,
      title: 'Acuarelas',
      imageSrc: 'https://www.massalagros.com/wp-content/uploads/2022/04/pintar-con-acuarela.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía y la solidaridad en la infancia. A través de narraciones emotivas y personajes entrañables, los niños descubrirán el valor del compañerismo, el trabajo en equipo y la importancia de apoyarse mutuamente. Cada cuento estará diseñado para provocar reflexión y diálogo tanto en casa como en el aula.'

    },
    {
      id: 3,
      title: 'Ilustraciones personalizadas',
      imageSrc: 'https://thumbs.dreamstime.com/b/esbozando-guiones-gr%C3%A1ficos-detallados-para-el-proyecto-de-v%C3%ADdeo-animado-cierre-un-animaci%C3%B3n-con-dibujos-mano-artista-la-331329054.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    }
  ];
  editVisible: boolean | undefined;
  selectedPortfolio: Portfolio | undefined;
  categories: string[] | undefined | undefined;

  constructor(private router: Router) {}

  toggleMenu(p: Portfolio, event?: MouseEvent) {
    event?.stopPropagation();
    this.portfolios.forEach(x => {
      if (x !== p) x.showMenu = false;
    });
    p.showMenu = !p.showMenu;
  }

  /** Cierra todos los menús al hacer clic fuera (documento) */
  @HostListener('document:click')
  closeAllMenus() {
    this.portfolios.forEach(p => (p.showMenu = false));
  }

  goToPortfolio(id: number) {
    this.router.navigate(['/portfolios/information', id]);
  }

  goToCreatePortfolio() {
    this.router.navigate(['/portfolios/create-new-portfolio']);
  }

  editPortfolio(id: number) {
    alert('Funcionalidad de edición de portafolio en desarrollo.');
  }

  deletePortfolio(id: number) {
    alert('Funcionalidad de eliminación de portafolio en desarrollo.');
  }

  goToEditPortolio() {
    this.router.navigate(['/portfolios/edit']);
  }

  closeEdit() {
    //
  }

  savePortfolio($event: Portfolio) {

  }
}
