import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, take } from 'rxjs';
import { JugadorPartida } from '../interfaces/jugador-partida';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  constructor(private firestore: AngularFirestore) { }

  agregarJugador(idDocPartida: string,jugador: JugadorPartida): Promise<any> {
    const jugadores = this.firestore.collection<JugadorPartida>(`/partida/${idDocPartida}/jugadores`);
    return jugadores.add(jugador);

  }

  actualizarJugador(idDocPartida: string,idDocJugador: string, data: any): Promise<any> {
    return this.firestore.collection(`/partida/${idDocPartida}/jugadores`).doc(idDocJugador).update(data);
  }

  getDocJugadoresByJugador(idDocPartida: string,jugador: string): Observable<string> {
    return this.firestore.collection(`/partida/${idDocPartida}/jugadores`, ref => ref.where('nombre', '==', jugador).limit(1)).snapshotChanges()
      .pipe(
        take(1),
        map(coleccion => {
          if (coleccion.length > 0) {
            return coleccion[0].payload.doc.id;
          }
          return "";
        })
      );
  }

  existeJugador(idDocPartida: string, jugador: string): Observable<boolean> {
      return this.firestore.collection(`/partida/${idDocPartida}/jugadores`, ref => ref.where('nombre', '==', jugador)).get()
      .pipe(
        map(resultado => {
          return resultado.docs.length > 0;
        })
      );
  }

  public obtenerJugadoresConectados(idPartida: string): Observable<JugadorPartida[]>{
    return this.firestore
      .collection<JugadorPartida>(`/partida/${idPartida}/jugadores`).valueChanges();
  }

}
