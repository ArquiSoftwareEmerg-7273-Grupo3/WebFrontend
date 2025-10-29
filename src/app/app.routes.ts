import { Routes } from '@angular/router';
import {HomeComponent} from './content/pages/home/home.component';
import {ChatsComponent} from './content/pages/chats/chats.component';
import {ApplicationsComponent} from './content/pages/applications/applications.component';
import {CreateProjectComponent} from './content/pages/create-project/create-project.component';
import {PortfoliosListComponent} from './content/pages/portfolios-list/portfolios-list.component';
import {CreatePortfolioComponent} from './content/pages/create-portfolio/create-portfolio.component';
import {PortfoliosComponent} from './content/pages/portfolios/portfolios.component';
import {CreateIlustrationComponent} from './content/pages/portfolios/create-ilustration/create-ilustration.component';
import {ProfileComponent} from './content/pages/profile/profile.component';
import {WriterIndividualComponent} from './content/pages/home/components/writer-individual/writer-individual.component';
import {BookIndividualComponent} from './content/pages/home/components/book-individual/book-individual.component';
import {
  ProjectIndividualComponent
} from './content/pages/home/components/project-individual/project-individual.component';
import {AllWritersComponent} from './content/pages/home/components/all-writers/all-writers.component';
import {AllProjectsComponent} from './content/pages/home/components/all-projects/all-projects.component';
import {AllBooksComponent} from './content/pages/home/components/all-books/all-books.component';
import {
  PortfolioIndividualComponent
} from './content/pages/home/components/portfolio-individual/portfolio-individual.component';
import {
  IllustratorIndividualComponent
} from './content/pages/home/components/illustrator-individual/illustrator-individual.component';
import {AllIllustratorsComponent} from './content/pages/home/components/all-illustrators/all-illustrators.component';
import {AllIllustrationsComponent} from './content/pages/home/components/all-illustrations/all-illustrations.component';
import {AllPortfoliosComponent} from './content/pages/home/components/all-portfolios/all-portfolios.component';
import {
  IllustrationIndividualComponent
} from './content/pages/home/components/illustration-individual/illustration-individual.component';
import {SignInComponent} from './content/pages/login/pages/sign-in/sign-in.component';
import {SignUpComponent} from './content/pages/login/pages/sign-up/sign-up.component';
import {authenticationGuard} from './content/pages/login/services/authentication.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent,  canActivate: [authenticationGuard] },
  { path: 'login', component: SignInComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard]},
  { path: 'register', component: SignUpComponent},
  { path: 'messages', component: ChatsComponent, canActivate: [authenticationGuard] },
  { path: 'projects/create-new-project', component: CreateProjectComponent, canActivate: [authenticationGuard] },
  { path: 'information/project/:id', component: ProjectIndividualComponent, canActivate: [authenticationGuard] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [authenticationGuard] },
  { path: 'portfolios', component: PortfoliosListComponent, canActivate: [authenticationGuard] },
  { path: 'portfolios/create-new-portfolio', component: CreatePortfolioComponent, canActivate: [authenticationGuard] },
  { path: 'portfolios/information/:id', component: PortfoliosComponent },
  { path: 'information/writer/:id', component: WriterIndividualComponent },
  { path: 'information/illustrator/:id', component: IllustratorIndividualComponent },
  { path: 'information/illustration/:id', component: IllustrationIndividualComponent },
  { path: 'information/book/:id', component: BookIndividualComponent},
  { path: 'information/portfolio/:id', component: PortfolioIndividualComponent },
  { path: 'all-writers', component: AllWritersComponent},
  { path: 'all-projects', component: AllProjectsComponent},
  { path: 'all-books', component: AllBooksComponent},
  { path: 'all-illustrators', component: AllIllustratorsComponent},
  { path: 'all-illustrations', component: AllIllustrationsComponent},
  { path: 'all-portfolios', component: AllPortfoliosComponent},
  { path: 'portfolios/information/:id/create-new-illustration', component: CreateIlustrationComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];
