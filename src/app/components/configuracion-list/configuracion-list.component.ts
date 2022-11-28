import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ToastrService } from 'ngx-toastr';
import { Partida } from '../../interfaces/partida';
import { Router } from '@angular/router';
import { Configuracion } from 'src/app/interfaces/configuracion';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-configuracion-list',
  templateUrl: './configuracion-list.component.html',
  styleUrls: ['./configuracion-list.component.css']
})
export class ConfiguracionListComponent implements OnInit {
  configuraciones: any[] = [];
  listadoPartidas: Partida[] = [];
  preguntas: Item[] = [];

  constructor(private _configuracionService: ConfiguracionService,
    private router: Router,
    private toastr: ToastrService,
    private _ItemService: ItemService) { }

  ngOnInit(): void {
    this.getConfiguraciones()
  }
  getConfiguraciones() {
    this._configuracionService.getConfiguracions().subscribe(data => {
      this.configuraciones = [];
      data.forEach((element: any) => {
        this.configuraciones.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
          mostrarPartidas: false
        })
      });
    })
  }
  crearPartida(configuracion: Configuracion): void {
    this.router.navigate(['/partidaCreate'], { state: configuracion })
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
    //restablecer estado de las preguntas
    this.restablecerEstadoPreguntas(partida);
    this.router.navigate(['/juego'], { state: partida })
  }

  eliminarConfiguracion(id: string) {
    this._configuracionService.eliminarConfiguracion(id).then(() => {
      //console.log('Configuracion eliminado con exito');
      this.toastr.error('Configuracion eliminado con exito', 'Registro Eliminado', { positionClass: 'toast-bottom-right' });
    }).catch(error => {
      console.log(error);
    })
  }

  restablecerEstadoPreguntas(partida: Partida): void {
    if (partida != null) {
      this._ItemService.obtenerPreguntasConfiguracion(Number(partida.id_configuracion)).subscribe(
        (item: any) => {
          this.preguntas = item;
          for (var index in item) {
            //console.log(item[index]);  // output: Apple Orange Banana
            item[index].estado=0;
            this._ItemService.actualizarItem(item[index].id,item[index]);
          }
        });
    }

  }
}
