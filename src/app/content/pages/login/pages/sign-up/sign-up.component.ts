
import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../services/authentication.service';
import {EscritorService} from '../../../profile/services/escritor.service';
import {IlustradorService} from '../../../profile/services/ilustrador.service';
import {SignUpRequest} from '../../model/sign-up.request';
import {Ilustrador} from '../../../profile/model/ilustrador.entity';
import {Escritor} from '../../../profile/model/escritor.entity';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  formEscritor!: FormGroup;
  formIlustrador!: FormGroup;
  userId: number = -1;
  showPassword = false;
  submitted = false;
  step: number = 1; // <-- Etapa del registro

  availableSocialNetworks = [
    { 
      id: 'youtube',
      name: 'YouTube',
      icon: 'fab fa-youtube'
    },
    {
      id: 'twitter',
      name: 'X',
      icon: 'fab fa-x-twitter'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'fab fa-facebook'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'fab fa-linkedin'
    }
  ];
  selectedNetworks: any[] = [];

  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private escritorService: EscritorService,
    private ilustradorService: IlustradorService,
    private router: Router
  ) {
    super();
  }


  ngOnInit(): void {
    this.form = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      role: ['', Validators.required],
      ubicacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      youtubeLink: [''],
      twitterLink: [''],
      facebookLink: [''],
      linkedinLink: [''],
      descripcion: ['']
    });

    this.formEscritor = this.builder.group({
      biografia: ['', Validators.required],
      foto: ['', Validators.required],
      redes: ['', Validators.required],
      suscripcion: [null, Validators.required]
    });

    this.formIlustrador = this.builder.group({
      biografia: ['', Validators.required],
      foto: ['', Validators.required],
      redes: ['', Validators.required],
      suscripcion: [null, Validators.required]
    });
  }

  onAddSocialNetwork(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedId = select.value;
    
    if (!selectedId) return;

    const network = this.availableSocialNetworks.find(n => n.id === selectedId);
    if (network && !this.selectedNetworks.find(n => n.id === network.id)) {
      this.selectedNetworks.push(network);
      this.form.addControl(network.id + 'Link', this.builder.control(''));
    }
    
    // Reset select
    select.value = '';
  }

  removeSocialNetwork(networkId: string) {
    this.selectedNetworks = this.selectedNetworks.filter(n => n.id !== networkId);
    this.form.removeControl(networkId + 'Link');
  }

  private getSocialNetworksData(): { [key: string]: string } {
    const socialData: { [key: string]: string } = {};
    this.selectedNetworks.forEach(network => {
      const value = this.form.get(network.id + 'Link')?.value;
      if (value) {
        socialData[network.id] = value;
      }
    });
    return socialData;
  }

  goToNextStep() {
    // Paso 1: datos básicos
    if (this.step === 1) {
      if (!this.form.get('firstName')?.value || !this.form.get('lastName')?.value || !this.form.get('username')?.value || !this.form.get('password')?.value) {
        alert("Completa todos los campos obligatorios.");
        return;
      }
      this.step = 2;
      return;
    }
    // Paso 2: ubicación
    if (this.step === 2) {
      if (!this.form.get('ubicacion')?.value) {
        alert("Completa la ubicación.");
        return;
      }
      this.step = 3;
      return;
    }
  }

  onSubmitFinal() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    const nombre = this.form.value.firstName;
    const apellido = this.form.value.lastName;
    const ubicacion = this.form.value.ubicacion;
    const fechaNacimiento = this.form.value.fechaNacimiento;
    const telefono = this.form.value.telefono;
    const descripcion = this.form.value.descripcion;

    // redes ya está en formato JSON
    const signUpRequest = new SignUpRequest(username, password, nombre,apellido,ubicacion,fechaNacimiento,telefono,this.getSocialNetworksData(), descripcion);

    this.authenticationService.signUp(signUpRequest)
      .then(() => {
        this.authenticationService.currentUserId.subscribe(id => {
          this.userId = id;

        });
      })
      .catch(error => {
        alert("Error al registrar: " + error.message);
      });
  }

 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
