import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap, of, tap } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { Partida } from 'src/app/interfaces/partida';
import { PartidaService } from 'src/app/services/partida.service';
import { PuntajePartidaService } from './puntaje-partida.service';

@Component({
  selector: 'app-puntaje-partida',
  templateUrl: './puntaje-partida.component.html'
})
export class PuntajePartidaComponent implements OnInit {
  public jugadores: JugadorPartida[] = [];
  public partida?: Partida;
  constructor(private puntajeService: PuntajePartidaService,
    private partidaService: PartidaService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idPartida: number = Number(this.route.snapshot.paramMap.get("idPartida"));
    this.partidaService.getPartidaByIdPartida(idPartida)
    .pipe(
      concatMap(partida => {
        this.partida = partida;
        return this.puntajeService.actualizarTableroPuntajes(this.partida.id!)
      }),
      tap(data => this.jugadores = data)
    )
    .subscribe();
  }
}
