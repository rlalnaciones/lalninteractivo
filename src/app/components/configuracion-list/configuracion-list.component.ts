import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.css']
})
export class ConfiguracionListComponent implements OnInit {
  configuraciones: any[] = [];

  constructor(private _configuracionService: ConfiguracionService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getConfiguraciones()
  }
  getConfiguraciones() {
    this._configuracionService.getConfiguracions().subscribe(data => {
      this.configuraciones = [];
      data.forEach((element:any )=> {
        // console.log(element.payload.doc.id);
        /*console.log(element.payload.doc.data());*/
        this.configuraciones.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.configuraciones);
    })
  }
  
  eliminarConfiguracion(id: string) {
  this._configuracionService.eliminarConfiguracion(id).then(() => {
    console.log('Configuracion eliminado con exito');
    this.toastr.error('Configuracion eliminado con exito','Registro Eliminado', {positionClass: 'toast-bottom-right'});
  }).catch(error => {
  console.log(error);
  })
  }
}
