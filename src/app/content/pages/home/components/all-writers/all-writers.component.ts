import { Component } from '@angular/core';
import {Location, NgForOf} from "@angular/common";
import {ProjectCardComponent} from "../project-card/project-card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WriterCardComponent} from '../writer-card/writer-card.component';

@Component({
  selector: 'app-all-writers',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    WriterCardComponent
  ],
  templateUrl: './all-writers.component.html',
  standalone: true,
  styleUrl: './all-writers.component.css'
})
export class AllWritersComponent {
  writers = [
    {
      id: 1,
      author: 'Diego Criollo',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 2
    },
    {
      id: 2,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
    {
      id: 3,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
    {
      id: 4,
      author: 'Diego Criollo',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 2
    },
    {
      id: 5,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
    {
      id: 6,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
    {
      id: 7,
      author: 'Diego Criollo',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 2
    },
    {
      id: 8,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
    {
      id: 9,
      author: 'Blaba',
      photo: 'https://media.licdn.com/dms/image/v2/D4D03AQEHAFaD7lk0_g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722623220508?e=2147483647&v=beta&t=CNNYILifUGwe1U2GtBtJhFanyEiaeJoCYILAWfwmupo',
      suscription: 0
    },
  ];

  searchQuery: string = '';
  filteredWriters = [...this.writers];

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  filterProjects() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredWriters = this.writers.filter(writer =>
      writer.author.toLowerCase().includes(query)
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSearch() {
    this.searchQuery = '';
    this.filteredWriters = [...this.writers];
  }
}
