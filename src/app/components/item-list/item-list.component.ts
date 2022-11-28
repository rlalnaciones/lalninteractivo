import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  constructor(private _itemService: ItemService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getItems();
  }
  getItems() {
    this._itemService.getItems().subscribe(data => {
      this.items  = [];
      data.forEach((element:any )=> {
        // console.log(element.payload.doc.id);
        /*console.log(element.payload.doc.data());*/
        this.items.push({
          id : element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      //console.log(this.items );
    })
  }
  
  eliminar(id: string) {
  this._itemService.eliminarItem(id).then(() => {
    //console.log('Item eliminado con exito');
    this.toastr.error('Configuracion eliminado con exito','Registro Eliminado', {positionClass: 'toast-bottom-right'});
  }).catch(error => {
  console.log(error);
  })
  }
}
