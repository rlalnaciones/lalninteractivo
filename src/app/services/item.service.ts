import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private firestore: AngularFirestore) { }
  
  agregarItem(Item: any): Promise<any>{
    return this.firestore.collection('Item').add(Item);
      }

      actualizarItem(id: string, data: any): Promise<any> {
      return this.firestore.collection('Item').doc(id).update(data);
      }

      eliminarItem(id : string): Promise<any> {
      return this.firestore.collection('Item').doc(id).delete();
      }
    
      getItems(): Observable<any> {
        return this.firestore.collection('Item', ref => ref.orderBy('id_item','desc')).snapshotChanges();
      }
    
        getItem(id: string): Observable<any>{
      return this.firestore.collection('Item').doc(id).snapshotChanges();
    }
    getItemByIdConfiguracion(idConfiguracion: string | null){
      //console.log(idConfiguracion);
            return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion)).valueChanges();

      //retorna solo una pregunta
//return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion).orderBy('id_item').startAt(0).limit(1)).valueChanges();

    }
    
}
