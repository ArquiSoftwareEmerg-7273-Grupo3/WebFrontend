import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, NgForOf} from '@angular/common';

@Component({
  selector: 'app-portfolios',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './portfolios.component.html',
  styleUrl: './portfolios.component.css'
})
export class PortfoliosComponent {
  id!: number;
  portfolio: any;
  galleryItem: any;

  portfolios = [
    {
      id: 1,
      title: 'Retratos',
      author: 'María López',
      date: '10/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://png.pngtree.com/thumb_back/fh260/background/20230527/pngtree-how-to-draw-a-portrait-using-pencils-image_2676967.jpg',
      description: 'Retratos hechos en mis tiempos libres. Me gusta variar siempre los estilos que uso para darle un detalle único a cada obra.',
      galleryItems: [
        {
          id: 1,
          title: 'Retrato 1',
          imageSrc: 'https://www.artistasdelatierra.com/obras/foto40095.jpg'
        },
        {
          id: 2,
          title: 'Retrato 2',
          imageSrc: 'https://estherrojas.com/wp-content/uploads/2022/12/margot-robbie-1-retrato-de-famoso-a-lapiz-de-grafito.jpeg'
        },
        {
          id: 3,
          title: 'Retrato 3',
          imageSrc: 'https://i.pinimg.com/originals/e5/cf/ef/e5cfef3bdcd7709aeeff782af23b344b.jpg'
        }
      ]
    },
    {
      id: 2,
      title: 'Acuarelas',
      author: 'Carlos Pérez',
      date: '11/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://www.massalagros.com/wp-content/uploads/2022/04/pintar-con-acuarela.jpg',
      description: 'En este portafolio mostraré ilustraciones realizadas con acuarela, en las cuales exploré historias sobre la amistad para fomentar la empatía y la solidaridad en la infancia. A través de narraciones emotivas y personajes entrañables, los niños descubrirán el valor del compañerismo, el trabajo en equipo y la importancia de apoyarse mutuamente. Cada cuento estará diseñado para provocar reflexión y diálogo tanto en casa como en el aula.',
      galleryItems: [
        {
          id: 1,
          title: 'Acuarela 1',
          imageSrc: 'https://www.picturesensations.com/wp-content/uploads/2016/11/M009-1p-1__37649.jpg'
        },
        {
          id: 2,
          title: 'Acuarela 2',
          imageSrc: 'https://i.etsystatic.com/44718700/r/il/5a8eec/5721031934/il_570xN.5721031934_b7og.jpg'
        },
        {
          id: 3,
          title: 'Acuarela 3',
          imageSrc: 'https://isopixel.net/wp-content/uploads/2015/03/blule-watercolors-superheroes-5.jpg'
        }
      ]
    },
    {
      id: 3,
      title: 'Ilustraciones personalizadas',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://thumbs.dreamstime.com/b/esbozando-guiones-gr%C3%A1ficos-detallados-para-el-proyecto-de-v%C3%ADdeo-animado-cierre-un-animaci%C3%B3n-con-dibujos-mano-artista-la-331329054.jpg',
      description: 'Este portafolio tiene como objetivo mostrar ilustraciones personalizadas que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.',
      galleryItems: [
        {
          id: 1,
          title: 'Ilustración personalizada 1',
          imageSrc: 'https://i.pinimg.com/736x/dc/f8/12/dcf812b353ebbe0c44408beeba3539a2.jpg'
        },
        {
          id: 2,
          title: 'Ilustración personalizada 2',
          imageSrc: 'https://i.pinimg.com/736x/89/cb/42/89cb4256a0f46c59c7427fa4a2f1f751.jpg'
        },
        {
          id: 3,
          title: 'Ilustración personalizada 3',
          imageSrc: 'https://www.shutterstock.com/image-vector/ronaldo-screaming-strong-hand-celebration-600nw-2381142721.jpg'
        },
        {
          id: 4,
          title: 'Ilustración personalizada 4',
          imageSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuUWQtiH-YRBTh-407coXDyQd4FS3dceiJdg&s'
        },
        {
          id: 5,
          title: 'Ilustración personalizada 5',
          imageSrc: 'https://www.shutterstock.com/image-vector/neymar-jr-goal-celebration-jumping-260nw-2383597057.jpg'
        }
      ]
    }
  ];


  constructor(private route: ActivatedRoute, private router: Router, private location: Location) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.portfolio = this.portfolios.find(p => p.id === this.id);

    // Forzar scroll al inicio
    window.scrollTo(0, 0);
  }

  goBack() {
    this.location.back();
  }

  goToCreateIllustration() {
    this.router.navigate(['/portfolios/information/:id/create-new-illustration']);
  }
}
