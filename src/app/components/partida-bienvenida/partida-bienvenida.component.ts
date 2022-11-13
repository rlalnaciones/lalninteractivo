import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, Observable, of, Subscription, tap } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { Partida } from 'src/app/interfaces/partida';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { PartidaService } from 'src/app/services/partida.service';

@Component({
  selector: 'app-partida-bienvenida',
  templateUrl: './partida-bienvenida.component.html'
})

export class PartidaBienvenidaComponent implements OnInit, OnDestroy {
  //parametros para iniciar juego
  element = false;
  mensaje = "";
  datosPartida!: FormGroup;
  submitted = false;
  loading = false;
  titulo = '¡¡Bienvenido!!';
  public partida: Partida | undefined;
  private suscripciones: Subscription;
  constructor(private _ConfiguracionService: ConfiguracionService,
    private router: Router,
    private _jugadoresService: JugadoresService,
    private _partidaService: PartidaService,
    private fb: FormBuilder
  ) {
    this.suscripciones = new Subscription();
  }

  ngOnInit(): void {
    this.datosPartida = this.fb.group({
      nombreJugador: [null, [Validators.required, Validators.maxLength(20), Validators.minLength(5)]],
      idPartida: [null, Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }
 
  agregarJugador() {
    this.loading = true;
    this.suscripciones.add(
      this._partidaService.getPartidaByIdPartida(Number(this.idPartida?.value))
      .pipe(
        concatMap(dataPartida => {
          this.partida = dataPartida;
          return this._jugadoresService.existeJugador(this.partida.id!, this.nombreJugador?.value);
        }),
        tap(result => {
          if (!result) {
            const grJugador: JugadorPartida = {
              nombre: this.nombreJugador?.value,
              puntaje: 0
            };
  
            sessionStorage.setItem("id_partida", String(this.partida?.id_partida));
            sessionStorage.setItem("jugador", this.nombreJugador?.value);
            sessionStorage.setItem("idConfiguracion", String(this.partida?.id_configuracion));
  
            this._jugadoresService.agregarJugador(this.partida?.id!, grJugador)
              .then(() => {
                this.router.navigate(['/juegouser'])
              }).catch(() => {
                this.loading = false;
                this.mensaje = "Verifica el código ingresado";
                this.element = true;
              });
          } else {
            this.mensaje = "Oops! el nombre ingresado ya existe, prueba con uno differente"
            this.element = true;
            this.loading = false;
          }
        })
      )
      .subscribe()
    );
  }

  obtenerIdDocPartida() {
    const configuracion: any = {
      jugador: this.datosPartida.value.jugador,
      id_partida: this.datosPartida.value.id_partida
    }
    this._partidaService.getPartidaByIdPartida(Number(configuracion.id_partida))
      .pipe(
        tap((partida: any) => {
          const grJugador: JugadorPartida = {
            nombre: configuracion.jugador,
            puntaje: 0
          };
          sessionStorage.setItem("id_partida", partida.data.id_partida);
          sessionStorage.setItem("jugador", configuracion.jugador);
          sessionStorage.setItem("idConfiguracion", partida.data.id_configuracion);

          let jugador = this._jugadoresService.agregarJugador(partida.id, grJugador);
          jugador.then(result => {
            this.router.navigate(['/juegouser'])
          }).catch(error => {
            this.loading = false;
            this.mensaje = "Verifica el código ingresado";
            this.element = true;
          });
        })
      )
      .subscribe();
  }

  
  public get idPartida() {
    return this.datosPartida.get('idPartida');
  }

  public get nombreJugador() {
    return this.datosPartida.get('nombreJugador');
  }
}
