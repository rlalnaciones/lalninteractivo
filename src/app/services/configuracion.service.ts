import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private firestore: AngularFirestore) { }

  agregarConfiguracion(Configuracion: any): Promise<any>{
    return this.firestore.collection('configuracion').add(Configuracion);
      }
    
      getConfiguracions(): Observable<any> {
         return this.firestore.collection('configuracion', ref => ref.orderBy('id_configuracion','desc')).snapshotChanges();
      }
    
    eliminarConfiguracion(id : string): Promise<any> {
    return this.firestore.collection('configuracion').doc(id).delete();
    }
    actualizarConfiguracion(id: string, data: any): Promise<any> {
    return this.firestore.collection('configuracion').doc(id).update(data);
    }
    
    getConfiguracion(id: string): Observable<any>{
      return this.firestore.collection('configuracion').doc(id.toString()).valueChanges();
    }
    getConfiguracionByIdConfiguracion(idConfiguracion: string | null){
      console.log(idConfiguracion);
// return this.firestore.collection('item',ref => ref.where('id_tipo_Configuracion',"==",idConfiguracion)).valueChanges();
return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion)).valueChanges();

    }

}
