import { UpperCasePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { concatMap, Subscription, takeWhile, tap, timer } from 'rxjs';
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
  juegos: any[] = [];
  data: any[] = [];
  items: Item[] = [];
  partidas: Partida[] = [];
  Configuracions: Configuracion[] = [];
  Configuracion: any | Configuracion;
  idConfiguracion: number = 0;
  preguntas: any[] = [];
  preguntaActual: any;
  respuestas: any[] = [];
  submitted = false;
  loading = false;
  id: string = '';
  idPartida = 0;
  jugador: string = '';
  tiempoTotal = 0;
  titulo = '';
  punteoAcumulado = 0;
  mensaje: string = '';
  mensajeEstado2: string = '';
  estadoPartida = 0;
  public btnColor: string='btn-danger';
  public tiempoRestante!: number;
  public mostrarRespuesta: boolean = false;
  public respuestaCorrecta: any;
  public partida!: Partida;
  public suscripciones: Subscription;

  constructor(private fb: FormBuilder,
    private _ConfiguracionService: ConfiguracionService,
    private _partidaService: PartidaService,
    private _ItemService: ItemService,
    private _jugadoresService: JugadoresService,
    private _ItemDetService: ItemdetService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {
    this.suscripciones = new Subscription();
  }

  ngOnInit(): void {
    this.idConfiguracion = Number(sessionStorage.getItem("idConfiguracion"));
    this.jugador = String(sessionStorage.getItem("jugador"));
    this.idPartida = Number(sessionStorage.getItem("id_partida"));
    this.loading = true;
    this.mensaje = `¡¡Bienvenid@!!  ${this.jugador.toUpperCase()} por favor espera un momento mientras otros amiguitos se unen para empezar!!`;
    this.getPartida()
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  getPartida() {
    this.suscripciones.add(
      this._partidaService.getPartidas(Number(this.idPartida)).subscribe(
        data => {
          this.partidas = [];
          data.forEach((element: any) => {
            this.partidas.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            })
          });
         // console.log(this.partidas[0].estado);
          this.estadoPartida = this.partidas[0].estado;
          this.getItemByIdConfiguracion();
        })
    )
  }

  get_PartidaByIdPartida() {
    this.loading = true;
    this.suscripciones.add(
      this._partidaService.getPartidaByIdPartida(Number(this.idPartida))
        .pipe(
          tap(partida => {
            this.tiempoTotal = partida.tiempoTotal
            this.estadoPartida = partida.estado
           //console.log('this.estadoPartida ', this.estadoPartida);
          }
          )
        )
        .subscribe()
    );

  }
  getItemByIdConfiguracion() {
    //PREGUNTAS
    // console.log('preguntas - estado', this.estadoPartida);

    if (this.idConfiguracion != null && this.estadoPartida == 2) {
      this.suscripciones.add(this._ItemService.getItemByIdConfiguracion(this.idConfiguracion, 1)
        .pipe(
          concatMap(item => {
            //console.log('obtiene preguntas');
            this.loading = true;
            this.preguntas = item;
            this.preguntaActual = this.preguntas[0];
            this.respuestas = [];
            if (this.preguntas.length > 0) {
              this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
                this.respuestas = data;
                this.loading = false;
                this.iniciarCuentaRegresiva();
              });
            }
            return item;
          })
        )
        .subscribe(
      ))
    }
  }

  grabarRespuesta(respuesta: any) {
    if (respuesta.valor_esperado == 1) {
      let punteo: number = 100 + (this.tiempoRestante * 100)
      this.punteoAcumulado += punteo;
      //      console.log('punteo',punteo);
      const grJugador: JugadorPartida = {
        nombre: this.jugador,
        puntaje: this.punteoAcumulado
      };

      this._partidaService.getPartidaByIdPartida(Number(this.idPartida))
        .pipe(
          tap(partida => {
            this.estadoPartida = partida.estado;
            this.suscripciones.add(this._jugadoresService.getDocJugadoresByJugador(partida.id!, this.jugador).subscribe(
              (idDocumentoJugador) => {
                let jugador = this._jugadoresService.actualizarJugador(partida.id!, idDocumentoJugador, grJugador);
              }))
          })
        )
        .subscribe();
    }
    this.tiempoRestante = 0;
    this.loading = true;
    this.mensaje = 'Muy bien! espera la siguiente pregunta';
    this.get_PartidaByIdPartida();
  }

  public iniciarCuentaRegresiva(): void {
    this.mensaje = 'ooops espera la siguiente pregunta';
    this.loading = false;
    this.mostrarRespuesta = false;
    this.tiempoRestante = this.tiempoTotal;
    this.suscripciones.add(
      timer(1000, 1000)
        .pipe(
          takeWhile(() => this.tiempoRestante > 0),
          tap(() => {
            --this.tiempoRestante;
            this.loading = false;

            if (this.tiempoRestante === 0) {
              this.loading = true;
              this.get_PartidaByIdPartida();
            }
          })
        )
        .subscribe()
    );

  }
}
