import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ItemService } from 'src/app/services/item.service';
import { ItemdetService } from 'src/app/services/itemdet.service';
import { ConfiguracionListComponent } from '../configuracion-list/configuracion-list.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { takeWhile, tap, timer, Subscription } from 'rxjs';
import { Partida } from '../../interfaces/partida';
import { PartidaService } from '../../services/partida.service';
import { JugadorPartida } from '../../interfaces/jugador-partida';
import { JugadoresService } from '../../services/jugadores.service';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit, OnDestroy {
  preguntas: any[] = [];
  preguntaActual: any;
  respuestas: any[] = [];
  loading = false;
  public indiceActual: number = -1;
  bienvenida: boolean = true;
  public tiempoRestante!: number;
  public mostrarRespuesta: boolean = false;
  public respuestaCorrecta: any;
  public partida: Partida;
  public suscripciones: Subscription;
  public listaParticpantes: JugadorPartida[] = [];
  constructor(private fb: FormBuilder,
    private _partidaService: PartidaService,
    private _ItemService: ItemService,
    private _ItemDetService: ItemdetService,
    private jugadoresService: JugadoresService,
    private router: Router) {
    this.suscripciones = new Subscription();
    this.partida = <Partida>this.router.getCurrentNavigation()!.extras.state;
    if (!this.partida) {
      this.router.navigate(['/configuracion-list'])
    }
  }

  ngOnInit(): void {
    //this.getItemByIdConfiguracion();
    if (this.partida != null) {
      this.jugadoresService.obtenerJugadoresConectados(this.partida.id!)
      .subscribe(data => this.listaParticpantes = data);
    }
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  getItemByIdConfiguracion() {
    if (this.partida != null) {
      this.suscripciones.add(
        this._ItemService.obtenerPreguntasConfiguracion(Number(this.partida.id_configuracion)).subscribe(
          (item: any) => {
            this.preguntas = item;
            this.siguientePregunta();
          }));
      } else {
        this.router.navigate(['/configuracion-list'])
      }
  }

  public iniciarPartida(): void {
    this.partida.estado = 2; //Pasa a estar en juego
    this.indiceActual = -1;
    this._partidaService.actualizarPartida(this.partida.id!, this.partida)
      .then(() => {
        this.getItemByIdConfiguracion();
        this.bienvenida = !this.bienvenida;
      });


  }

  public iniciarCuentaRegresiva(): void {
    this.mostrarRespuesta = false;
    let tiempoTotal: number = this.partida.tiempoTotal;
    this.tiempoRestante = tiempoTotal;
    this.suscripciones.add(
      timer(1000, 1000)
      .pipe(
        takeWhile( () => this.tiempoRestante > 0 ),
        tap(() => {
          --this.tiempoRestante;
          if (this.tiempoRestante === 0) {
              this.mostrarRespuesta = true;
              this.preguntaActual.estado = 0;
              this._ItemDetService.actualizarItem(this.preguntaActual.id, this.preguntaActual);
          }
        })
      )
      .subscribe()
    );
  }

  public siguientePregunta(): void {
    this.mostrarRespuesta = false;
    this.respuestas = [];
    this.indiceActual++;
    if (this.indiceActual < this.preguntas.length) {
      this.preguntaActual = this.preguntas[this.indiceActual];
      this.suscripciones.add(
        this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
          this.respuestas = data;
          this.preguntaActual.estado = 1;
          this._ItemDetService.actualizarItem(this.preguntaActual.id, this.preguntaActual)
            .then(() => {
              this.iniciarCuentaRegresiva();
            })
        }));
    }
  }

  public mostrarTableroPuntajes(): void {
    this.partida.estado = 3; //Partida Finalizada
    this._partidaService.actualizarPartida(this.partida.id!, this.partida)
      .then(() => {
        this.router.navigate(['/tablero-partida', this.partida.id_partida])
      });
  }
}
