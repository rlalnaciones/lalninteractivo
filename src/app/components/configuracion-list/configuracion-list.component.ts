import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ToastrService } from 'ngx-toastr';
import { Partida } from '../../interfaces/partida';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.css']
})
export class ConfiguracionListComponent implements OnInit {
  configuraciones: any[] = [];
  listadoPartidas: Partida[] = [];

  constructor(private _configuracionService: ConfiguracionService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getConfiguraciones()
  }
  getConfiguraciones() {
    this._configuracionService.getConfiguracions().subscribe(data => {
      this.configuraciones = [];
      data.forEach((element:any )=> {
        this.configuraciones.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data(),
          mostrarPartidas: false
        })
      });
    })
  }

  obtenerPartidasConfiguracion(configuracion: any): void {
    configuracion.mostrarPartidas = !configuracion.mostrarPartidas
    this._configuracionService.obtenerPartidasConfiguracion(configuracion.id_configuracion).subscribe(data => configuracion.listadoPartidas = data);
  }

  public iniciarPartida(partida: Partida): void {
    if (partida.estado === 2 || partida.estado === 3) {
      this.toastr.error('No puede iniciar una partida que se encuentre en juego o finalizada!!!');
      return;
    }
    this.router.navigate(['/juego'], {state: partida })
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
