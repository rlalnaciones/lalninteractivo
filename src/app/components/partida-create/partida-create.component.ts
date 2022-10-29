import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartidaService } from 'src/app/services/partida.service';

@Component({
  selector: 'app-partida-create',
  templateUrl: './partida-create.component.html',
  styleUrls: ['./partida-create.component.css']
})
export class PartidaCreateComponent implements OnInit {
createpartida: FormGroup;
submitted = false;
loading = false;
id : string | null;
titulo = 'Crear partida';
nuevaPartida = "";

constructor(private fb: FormBuilder,
  private _partidaService: PartidaService,
  private router : Router,
  private toastr: ToastrService,
  private aRoute: ActivatedRoute) {
    this.nuevaPartida = (new Date().getFullYear() ).toString().slice(-2) + '0' + (new Date().getMonth() + 1).toString().slice(-2) + (new Date().getUTCDay() + 1).toString() + (new Date().getMilliseconds() + 1).toString();
    this,this.createpartida = this.fb.group({
        // id_partida: ['', Validators.required],
    id_partida: [this.nuevaPartida, Validators.required],
    id_tipo_partida: ['', Validators.required],
    partida: ['', Validators.required],
    descripcion: ['', Validators.required],
    estado: ['', Validators.required]
  })
  this.id = this.aRoute.snapshot.paramMap.get("id");
  console.log(this.id);
    }
    ngOnInit(): void {
      this.esEditar();
    }
  
    agregarEditarPartida(){
      this.submitted = true;
      if(this.createpartida.invalid){
        return;
      }
      if(this.id === null){
        this.titulo = 'Crear partida';
        this.agregarPartida();
      } else {
        this.titulo = 'Editar partida';
        this.editarPartida(this.id);
      }
    }
  
    agregarPartida(){
      const partida : any = {
        id_partida: this.createpartida.value.id_partida,
        id_tipo_partida: this.createpartida.value.id_tipo_partida,
        partida: this.createpartida.value.partida,
        descripcion: this.createpartida.value.descripcion,
        estado: this.createpartida.value.estado,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
      this.loading = true;
      this._partidaService.agregarPartida(partida).then(() =>{
        this.toastr.success('partida registrada con éxito!','partida registrada',{positionClass:'toast-bottom-right'});
        this.loading = false;
        this.router.navigate(['/partida-list'])
      }).catch(error => {
        console.log(error);
        this.loading=false;
      })
    }
  
  editarPartida(id: string){
    
    const partida : any = {
      id_partida: this.createpartida.value.id_partida,
      id_tipo_partida: this.createpartida.value.id_tipo_partida,
      partida: this.createpartida.value.partida,
      descripcion: this.createpartida.value.descripcion,
      estado: this.createpartida.value.estado,
      fechaActualizacion: new Date()
    }
  this.loading = true;
  
  this._partidaService.actualizarPartida(id,partida).then(() =>{
    this.loading = false;
    this.toastr.info('partida ha sido actualizada','partida actualizada',{
      positionClass:'toast-bottom-right'
    })
    this.router.navigate(['/partida-list']);
  });
  }
  
    esEditar() {
      // this.titulo = 'Editar partida';
      if(this.id !== null)  {
        this.loading = true;
        this._partidaService.getPartida(this.id).subscribe(data =>{
          this.loading = false;
          console.log(data.payload.data()['id_partida']); //accedemos a todos los datos
          this.createpartida.setValue({
            id_partida: data.payload.data()['id_partida'],
            id_tipo_partida: data.payload.data()['id_tipo_partida'],
            partida: data.payload.data()['partida'],
            descripcion: data.payload.data()['descripcion'],
            estado: data.payload.data()['estado']
          })
        })
      }
    }
  
  }