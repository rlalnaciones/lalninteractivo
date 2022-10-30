import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';

@Injectable({
  providedIn: 'root'
})
export class PuntajePartidaService {

  constructor(private firestore: AngularFirestore) { }

  public actualizarTableroPuntajes(idPartida: string): Observable<JugadorPartida[]>{
    console.log(idPartida);
    
    return this.firestore
      .collection<JugadorPartida>(`/partida/${idPartida}/jugadores`, ref => ref.orderBy('puntaje','desc'))
      .valueChanges();
  }
}
