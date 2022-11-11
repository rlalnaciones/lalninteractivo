import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  constructor(private firestore: AngularFirestore) { }

  agregarPartida(partida: any): Promise<any> {
    return this.firestore.collection('partida').add(partida);
  }

  actualizarPartida(id: string, data: any): Promise<any> {
    return this.firestore.collection('partida').doc(id).update(data);
  }

  eliminarPartida(id: string): Promise<any> {
    return this.firestore.collection('partida').doc(id).delete();
  }

  getPartidas(): Observable<any> {
    return this.firestore.collection('partida', ref => ref.orderBy('id_partida', 'desc')).snapshotChanges();
  }

  getPartida(id: string): Observable<any> {
    return this.firestore.collection('partida').doc(id).snapshotChanges();
  }

  getPartidaByIdPartida(id_partida: number): Observable<any> {
    return this.firestore.collection('partida', ref => ref.where('id_partida', '==', id_partida).limit(1)).snapshotChanges()
      .pipe(
        take(1),
        map(coleccion => {
           const id = coleccion[0].payload.doc.id;
           const data = coleccion[0].payload.doc.data();
           return { id, data}
        })
      );
  }
}