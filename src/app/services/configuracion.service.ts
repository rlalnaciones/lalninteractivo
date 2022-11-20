import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, tap } from 'rxjs';
import { Partida } from '../interfaces/partida';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
    //parametros para iniciar juego
//@Output() disparadorJuego: EventEmitter<any> = new EventEmitter();

  constructor(private firestore: AngularFirestore) { }

  agregarConfiguracion(Configuracion: any): Promise<any> {
    return this.firestore.collection('configuracion').add(Configuracion);
  }

  getConfiguracions(): Observable<any> {
    return this.firestore.collection('configuracion', ref => ref.orderBy('id_configuracion', 'desc')).snapshotChanges();
  }

  eliminarConfiguracion(id: string): Promise<any> {
    return this.firestore.collection('configuracion').doc(id).delete();
  }
  actualizarConfiguracion(id: string, data: any): Promise<any> {
    return this.firestore.collection('configuracion').doc(id).update(data);
  }

  getConfiguracion(id: string): Observable<any> {
    return this.firestore.collection('configuracion').doc(id.toString()).get()
    .pipe(
      map(resultado => resultado.data())
    );
  }
  getConfiguracionByIdConfiguracion(idConfiguracion: string | null) {
    // return this.firestore.collection('item',ref => ref.where('id_tipo_Configuracion',"==",idConfiguracion)).valueChanges();
    return this.firestore.collection('item', ref => ref.where('id_configuracion', "==", idConfiguracion)).valueChanges();

  }

  obtenerPartidasConfiguracion(idConfiguracion: number) {
    return this.firestore.collection<Partida>('partida', ref => ref.where('id_configuracion', "==", idConfiguracion)).get()
      .pipe(
        map(coleccionPartidas => coleccionPartidas.docs.map(metadataPartida => {
          let partida: Partida = metadataPartida.data();
          partida.id = metadataPartida.id;
          return partida;
        }))
      );
  }

}
