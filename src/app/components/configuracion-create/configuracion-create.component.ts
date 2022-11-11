import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-configuracion-create',
  templateUrl: './configuracion-create.component.html',
  styleUrls: ['./configuracion-create.component.css']
})
export class ConfiguracionCreateComponent implements OnInit {
createConfiguracion: FormGroup;
submitted = false;
loading = false;
id : string | null;
titulo = 'Crear configuracion';

constructor(private fb: FormBuilder,
  private _configuracionService: ConfiguracionService,
  private router : Router,
  private toastr: ToastrService,
  private aRoute: ActivatedRoute) {
    this,this.createConfiguracion = this.fb.group({
    id_configuracion: ['', Validators.required],
    id_tipo_configuracion: ['', Validators.required],
    configuracion: ['', Validators.required],
    descripcion: ['', Validators.required],
    estado: ['', Validators.required]
  })
  this.id = this.aRoute.snapshot.paramMap.get("id");
  //console.log(this.id);
    }
    ngOnInit(): void {
      this.esEditar();
    }
  
    agregarEditarConfiguracion(){
      this.submitted = true;
      if(this.createConfiguracion.invalid){
        return;
      }
      if(this.id === null){
        this.titulo = 'Crear configuracion';
        this.agregarconfiguracion();
      } else {
        this.titulo = 'Editar configuracion';
        this.editarconfiguracion(this.id);
      }
    }
  
    agregarconfiguracion(){
      const configuracion : any = {
        id_configuracion: this.createConfiguracion.value.id_configuracion,
        id_tipo_configuracion: this.createConfiguracion.value.id_tipo_configuracion,
        configuracion: this.createConfiguracion.value.configuracion,
        descripcion: this.createConfiguracion.value.descripcion,
        estado: this.createConfiguracion.value.estado,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
      this.loading = true;
      this._configuracionService.agregarConfiguracion(configuracion).then(() =>{
        this.toastr.success('configuracion registrada con éxito!','configuracion registrada',{positionClass:'toast-bottom-right'});
        this.loading = false;
        this.router.navigate(['/configuracion-list'])
      }).catch(error => {
        console.log(error);
        this.loading=false;
      })
    }
  
  editarconfiguracion(id: string){
    
    const configuracion : any = {
      id_configuracion: this.createConfiguracion.value.id_configuracion,
      id_tipo_configuracion: this.createConfiguracion.value.id_tipo_configuracion,
      configuracion: this.createConfiguracion.value.configuracion,
      descripcion: this.createConfiguracion.value.descripcion,
      estado: this.createConfiguracion.value.estado,
      fechaActualizacion: new Date()
    }
  this.loading = true;
  
  this._configuracionService.actualizarConfiguracion(id,configuracion).then(() =>{
    this.loading = false;
    this.toastr.info('configuracion ha sido actualizada','configuracion actualizada',{
      positionClass:'toast-bottom-right'
    })
    this.router.navigate(['/configuracion-list']);
  });
  }
  
    esEditar() {
      // this.titulo = 'Editar configuracion';
      if(this.id !== null)  {
        this.loading = true;
        this._configuracionService.getConfiguracion(this.id).subscribe(data =>{
          this.loading = false;
          console.log(data.payload.data()['id_configuracion']); //accedemos a todos los datos
          this.createConfiguracion.setValue({
            id_configuracion: data.payload.data()['id_configuracion'],
            id_tipo_configuracion: data.payload.data()['id_tipo_configuracion'],
            configuracion: data.payload.data()['configuracion'],
            descripcion: data.payload.data()['descripcion'],
            estado: data.payload.data()['estado']
          })
        })
      }
    }
  
  }