import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemdetService } from 'src/app/services/itemdet.service';

@Component({
  selector: 'app-itemdet-list',
  templateUrl: './itemdet-list.component.html',
  styleUrls: ['./itemdet-list.component.css']
})
export class ItemdetListComponent implements OnInit {
  itemsdet: any[] = [];
  constructor( private _itemdetService: ItemdetService,
    private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.getItems();
  }
  getItems() {
    this._itemdetService.getItemdets().subscribe(data => {
      this.itemsdet  = [];
      data.forEach((element:any )=> {
        // console.log(element.payload.doc.id);
        /*console.log(element.payload.doc.data());*/
        this.itemsdet.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.itemsdet );
    })
  }
  
  eliminar(id: string) {
  this._itemdetService.eliminarItemdet(id).then(() => {
    console.log('Respuesta eliminada con exito');
    this.toastr.error('Respuesta eliminada con exito','Registro Eliminado', {positionClass: 'toast-bottom-right'});
  }).catch(error => {
  console.log(error);
  })
  }
}
