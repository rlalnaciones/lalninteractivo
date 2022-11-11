import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Item } from 'src/app/interfaces/item';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { Partida } from 'src/app/interfaces/partida';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ItemService } from 'src/app/services/item.service';
import { ItemdetService } from 'src/app/services/itemdet.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { PartidaService } from 'src/app/services/partida.service';
import { Configuracion } from '../configuracion';

@Component({
  selector: 'app-juegouser',
  templateUrl: './juegouser.component.html',
  styleUrls: ['./juegouser.component.css']
})
export class JuegouserComponent implements OnInit {
  //createConfiguracion: FormGroup;
  juegos: any[] = [];
  data: any[] = [];
  //Configuracion: any[] = [];
  //item: any[] = [];
  items: Item[] = [];
  partidas: Partida[] = [];
  Configuracions: Configuracion[] = [];
  Configuracion: any | Configuracion;
  idConfiguracion: number = 0;
  //preguntas: any[] = [];
  preguntas: any[] = [];
  preguntaActual: any;
  respuestas: any[] = [];
  //createJuego: FormGroup;
  submitted = false;
  loading = false;
  id: string = '';
  idPartida = 0;
  jugador: string = '';
  private indiceActual: number = -1;
  titulo = '';

  constructor(private fb: FormBuilder,
    private _ConfiguracionService: ConfiguracionService,
    private _partidaService: PartidaService,
    private _ItemService: ItemService,
    private _jugadoresService: JugadoresService,
    private _ItemDetService: ItemdetService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {
    //this.idConfiguracion =this.router.getCurrentNavigation().extras.state.id;
    //this.idPartida = Number(this.aRoute.snapshot.paramMap.get("idPartida"));
    console.log(this.idPartida)

  }

  ngOnInit(): void {
    this.get_PartidaByIdPartida();
  }

  get_PartidaByIdPartida() {
    //this.idPartida = 220107179;
    //this.jugador = 'Eunice'
    // this.jugador = String(sessionStorage.getItem("jugador"));
    // this.Configuracion=sessionStorage.getItem("idConfiguracion");
    // this._PartidaService.getPartidaByIdPartida(this.idPartida).subscribe(
    //   (partida: any) => {
    this.idConfiguracion = Number(sessionStorage.getItem("idConfiguracion"));
    this.jugador = String(sessionStorage.getItem("jugador"));
    this.idPartida = Number(sessionStorage.getItem("id_partida"));
    console.log('idConfiguracion ;', this.idConfiguracion, ' ,jugador:', this.jugador, ', id_poartida', this.idPartida);

    this.getItemByIdConfiguracion();

    //   }
    // )
  }

  getItemByIdConfiguracion() {
    if (this.idConfiguracion != null) {
      this._ItemService.getItemByIdConfiguracion(this.idConfiguracion, 1).subscribe(
        (item: any) => {
          this.preguntas = item;
          this.preguntaActual = this.preguntas[0];
          this.respuestas = [];
          if (this.preguntas.length > 0) {
            this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
              this.respuestas = data;
            });
          }
        }
      )
    }
  }

  getConfiguracion() {
    if (this.id !== null) {
      this.loading = true;
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(data => {
        this.loading = false;
        // console.log(data.payload.data()['id_Configuracion']); //accedemos a todos los datos
        this.juegos.push({
          id_Configuracion: data.payload.doc.data()['id_Configuracion']
        })
      })
    }
  }

  getItemdetByIdItem() {
    if (this.id != null) {
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(
        (Configuracion) => {
          this._ItemService.getItemByIdConfiguracion(Configuracion.id_configuracion, 1).subscribe(
            (item) => {
              item.forEach((element: any) => {
                this._ItemDetService.getItemdetByIdItem(element.payload.doc.id_item).subscribe(
                  (itemdet) => {
                    console.log(itemdet);
                    this.respuestas = itemdet;
                  }
                )
              }
              )
            }
          )
        }
      )
    }
  }

  grabarRespuesta(respuesta: any) {
    if (respuesta.valor_esperado == 1) {
      let punteo: number = 1000 * respuesta.id_item_det;
      const grJugador: JugadorPartida = {
        nombre: this.jugador,
        puntaje: punteo
      };

      this._partidaService.getPartidaByIdPartida(Number(this.idPartida))
        .pipe(
          tap(partida => {
            this._jugadoresService.getDocJugadoresByJugador(partida.id, this.jugador).subscribe(
              (idDocumentoJugador) => {
                let jugador = this._jugadoresService.actualizarJugador(partida.id, idDocumentoJugador, grJugador);
               // complete();
                // jugador.then(result => {
                //   console.log('result', result);

                //   // this.router.navigate(['/juegouser'])
                // }).catch(error => {
                //   console.error(error);
                //   this.loading = false;

                // });
              })
              
          })
        )
        .subscribe();
        
    }
  }
}
