import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemdetService {

  constructor(private firestore: AngularFirestore) { }
  
  agregarItemdet(itemdet: any): Promise<any>{
    return this.firestore.collection('item_det').add(itemdet);
      }

    eliminarItemdet(id : string): Promise<any> {
    return this.firestore.collection('item_det').doc(id).delete();
    }
    
    actualizarItemdet(id: string, data: any): Promise<any> {
    return this.firestore.collection('item_det').doc(id).update(data);
    }

    getItemdets(): Observable<any> {
      return this.firestore.collection('item_det', ref => ref.orderBy('id_item_det','desc')).snapshotChanges();
   }

    getItemdet(id: string): Observable<any>{
      return this.firestore.collection('item_det').doc(id).snapshotChanges();
    }


    getItemdetByIdItem(id_item: number): Observable<any>{
      console.log(id_item);
            return this.firestore.collection('item_det',ref => ref.where('id_item',"==",id_item)).valueChanges();

      //retorna solo una pregunta
//return this.firestore.collection('item',ref => ref.where('id_configuracion',"==",idConfiguracion).orderBy('id_item').startAt(0).limit(1)).valueChanges();

    }
}
