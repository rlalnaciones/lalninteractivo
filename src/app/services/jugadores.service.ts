import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { JugadorPartida } from '../interfaces/jugador-partida';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  constructor(private firestore: AngularFirestore) { }

  agregarJugador(idDocPartida: string,jugador: JugadorPartida): Promise<any> {
    console.log(idDocPartida, jugador);
    
    const shirtsCollection = this.firestore.collection<JugadorPartida>(`/partida/${idDocPartida}/jugadores`);
    return shirtsCollection.add(jugador);
     
  }

  actualizarJugador(idDocPartida: string,idDocJugador: string, data: any): Promise<any> {
    return this.firestore.collection(`/partida/${idDocPartida}/jugadores`).doc(idDocJugador).update(data);
  }
}
