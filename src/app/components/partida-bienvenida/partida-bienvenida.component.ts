import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, Observable, of, tap } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { PartidaService } from 'src/app/services/partida.service';

@Component({
  selector: 'app-partida-bienvenida',
  templateUrl: './partida-bienvenida.component.html'
})

export class PartidaBienvenidaComponent implements OnInit {
  //parametros para iniciar juego
  partidas: any[] = [];
  dataSaliente: any[] = [];
  idPartida: any = {};
  idDocPartida: string = '';
  public partida: any;
  jugadores: JugadorPartida[] = [];
  jugador: string = '';
  public idDocPartida$: Observable<any> | undefined;

  constructor(private _ConfiguracionService: ConfiguracionService,
    private router: Router,
    private _jugadoresService: JugadoresService,
    private _partidaService: PartidaService
  ) {
  }

  ngOnInit(): void {
  }

  agregarJugador(jugador: string, idPartida: string) {
    this.jugador = jugador;
    this.idPartida = idPartida;
    this.obtenerIdDocPartida();

  }

  obtenerIdDocPartida() {
    this._partidaService.getPartidaByIdPartida(Number(this.idPartida))
    .pipe(
      tap((data: any) => {  
        const grJugador: JugadorPartida = {
          nombre: this.jugador,
          puntaje: 0
        };
        let jugador = this._jugadoresService.agregarJugador(data[0].id, grJugador);
        jugador.then(result => {
          this.router.navigate(['/juegouser'])
        }).catch(error => console.log(error));
      })
    )
    .subscribe();
  }
  
}
