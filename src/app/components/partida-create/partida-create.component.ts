import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartidaService } from 'src/app/services/partida.service';
import { Configuracion } from '../configuracion';

@Component({
  selector: 'app-partida-create',
  templateUrl: './partida-create.component.html',
  styleUrls: ['./partida-create.component.css']
})
export class PartidaCreateComponent implements OnInit {
  createpartida: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Crear partida';
  nuevaPartida: string;
  public configuracion : Configuracion;

  constructor(private fb: FormBuilder,
    private _partidaService: PartidaService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this.nuevaPartida = Number(new Date().getFullYear()).toString().slice(-2) + Number((new Date().getMonth() + 1).toString().slice(-2)) + Number((new Date().getUTCDay() + 1) + (new Date().getMilliseconds() + 1));
//inicializando datod partida
    this, this.createpartida = this.fb.group({
      id_partida: [this.nuevaPartida, Validators.required],
      id_configuracion: [0, Validators.required],
      partida: ['', Validators.required],
      estado: [1, Validators.required ],
      tiempoTotal: [20, Validators.required]
    })
    //obteniendo id si es edicion
    this.id = this.aRoute.snapshot.paramMap.get("id");
    //console.log(this.id);
    //obteniendo datos si es creacion
    this.configuracion = <Configuracion>this.router.getCurrentNavigation()!.extras.state;
    //console.log('configuracion',this.configuracion );
    if (this.configuracion) {
      //si es creacion se toman los datos que vienen de la configuracion
     this.createpartida = this.fb.group({
      id_partida: [Number(this.nuevaPartida), Validators.required],
      id_configuracion: [this.configuracion.id_configuracion, Validators.required],
      partida: [this.configuracion.configuracion, Validators.required],
      estado: [1, Validators.required],
      tiempoTotal: [20, Validators.required ]
    })
    }
    
  }
  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarPartida() {
    this.submitted = true;
    if (this.createpartida.invalid) {
      return;
    }
    if (this.id === null) {
      this.titulo = 'Crear partida';
      this.agregarPartida();
    } else {
      this.titulo = 'Editar partida';
      this.editarPartida(this.id);
    }
  }

  agregarPartida() {
    
    const partida: any = {
      id_partida: this.createpartida.value.id_partida,
      id_configuracion: this.createpartida.value.id_configuracion,
      partida: this.createpartida.value.partida,
      estado: this.createpartida.value.estado,
      tiempoTotal : this.createpartida.value.tiempoTotal,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._partidaService.agregarPartida(partida).then(() => {
      this.toastr.success('partida registrada con éxito!', 'partida registrada', { positionClass: 'toast-bottom-right' });
      this.loading = false;
      this.router.navigate(['/configuracion-list'])
    }).catch(error => {
      //console.log(error);
      this.loading = false;
    })
  }

  editarPartida(id: string) {
    const partida: any = {
      id_partida: this.createpartida.value.id_partida,
      id_configuracion: this.createpartida.value.id_configuracion,
      partida: this.createpartida.value.partida,
      estado: this.createpartida.value.estado,
      tiempoTotal : this.createpartida.value.tiempoTotal,
      fechaActualizacion: new Date()
    }
    this.loading = true;

    this._partidaService.actualizarPartida(id, partida).then(() => {
      this.loading = false;
      this.toastr.info('partida ha sido actualizada', 'partida actualizada', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/partida-list']);
    });
  }

  esEditar() {
    // this.titulo = 'Editar partida';
    if (this.id !== null) {
      this.loading = true;
      this._partidaService.getPartida(this.id).subscribe(data => {
        this.loading = false;
        console.log(data.payload.data()['id_partida']); //accedemos a todos los datos
        this.createpartida.setValue({
          id_partida: data.payload.data()['id_partida'],
          id_configuracion: data.payload.data()['id_configuracion'],
          partida: data.payload.data()['partida'],
          estado: data.payload.data()['estado'],
          tiempoTotal: data.payload.data()['tiempoTotal']
        })
      })
    }
  }

}