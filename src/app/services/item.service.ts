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
    return this.firestore.collection('item').add(Item);
      }

      actualizarItem(id: string, data: any): Promise<any> {
      return this.firestore.collection('item').doc(id).update(data);
      }

      eliminarItem(id : string): Promise<any> {
      return this.firestore.collection('item').doc(id).delete();
      }
    
      getItems(): Observable<any> {
        return this.firestore.collection('item', ref => ref.orderBy('id_item','desc')).snapshotChanges();
      }
    
        getItem(id: string): Observable<any>{
      return this.firestore.collection('item').doc(id).valueChanges();
    }
//     getItemByIdConfiguracion(idConfiguracion: number | null, estado:number | null){
//       console.log(idConfiguracion);
//       if (estado==0){
//         return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion)).valueChanges();
//       }
//       else{
//         return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion).where('estado',"==",estado) ).valueChanges();
//       }

//       //retorna solo una pregunta
// //return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion).orderBy('id_item').startAt(0).limit(1)).valueChanges();

//     }

    getItemByIdConfiguracion(idConfiguracion: number | null, estado:number | null): Observable<any> {
      console.log(idConfiguracion);
      if (estado==0){
        return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion)).valueChanges();
      }
      else{
        return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion).where('estado',"==",estado) ).valueChanges();
      }
    }
    
}
