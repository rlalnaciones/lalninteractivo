import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap, of, tap } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { PartidaService } from 'src/app/services/partida.service';
import { PuntajePartidaService } from './puntaje-partida.service';

@Component({
  selector: 'app-puntaje-partida',
  templateUrl: './puntaje-partida.component.html'
})
export class PuntajePartidaComponent implements OnInit {
  public jugadores: JugadorPartida[] = [];
  public partida: any;
  constructor(private puntajeService: PuntajePartidaService,
    private partidaService: PartidaService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idPartida: number = Number(this.route.snapshot.paramMap.get("idPartida"));
    this.partidaService.getPartidaByIdPartida(idPartida)
    .pipe(
      concatMap((data: any) => {  
      this.partida = data[0]; 
        return this.puntajeService.actualizarTableroPuntajes(this.partida.id)
      }),
      tap(data => this.jugadores = data)
    )
    .subscribe();
  }
}
