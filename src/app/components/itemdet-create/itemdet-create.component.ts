import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/interfaces/item';
import { ItemdetService } from 'src/app/services/itemdet.service';

@Component({
  selector: 'app-itemdet-create',
  templateUrl: './itemdet-create.component.html',
  styleUrls: ['./itemdet-create.component.css']
})
export class ItemdetCreateComponent implements OnInit {
  itemdetCreate: FormGroup;
  submitted = false;
  loading = false;
  id : string | null;
  idItemDet: number =  0 ;
  titulo = 'Agregar Respuestas';
  pregunta='';
  public item: Item;

  constructor(private fb: FormBuilder,
    private _itemdetService: ItemdetService,
    private router : Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) { 
      this.itemdetCreate = this.fb.group({
        id_item: [0, Validators.required],
        id_item_det: [this.idItemDet, Validators.required],
        item_det: ['', Validators.required],
        valor_esperado: ['0', Validators.required]
      })
      this.id = this.aRoute.snapshot.paramMap.get("id");
      //console.log(this.id);
      this.item = <Item>this.router.getCurrentNavigation()!.extras.state;
    //console.log('configuracion',this.configuracion );
    if (this.item) {
      this.pregunta = this.item.item;
      //si es creacion se toman los datos que vienen de la pregunta
     this.itemdetCreate = this.fb.group({
      id_item: [this.item.id_item, Validators.required],
        id_item_det: [this.idItemDet, Validators.required],
        item_det: ['', Validators.required],
        valor_esperado: [0, Validators.required]
    })
    }
    }

  ngOnInit(): void {
    this.esEditar();
  }
  agregarEditarItemdet(){
    this.submitted = true;
    if(this.itemdetCreate.invalid){
      return;
    }
    if(this.id === null){
      this.agregarItemdet();
    } else {
      this.editarItemdet(this.id);
    }
  }

  agregarItemdet(){
    this.titulo = 'Agregar Respuestas';
    const Itemdet : any = {
      id_item: this.itemdetCreate.value.id_item,
      id_item_det: this.itemdetCreate.value.id_item_det,
      item_det: this.itemdetCreate.value.item_det,
      valor_esperado: this.itemdetCreate.value.valor_esperado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._itemdetService.agregarItemdet(Itemdet).then(() =>{
      //this.toastr.success('Respuestas registrado con éxito!','Itemdet registrado',{positionClass:'toast-bottom-right'});
      this.loading = false;
      this.idItemDet = this.idItemDet + 1;
      //this.router.navigate(['/itemdetList'])
      
    }).catch(error => {
      console.log(error);
      this.loading=false;
    })
  }

editarItemdet(id: string){
  
  const Itemdet : any = {
    id_item: this.itemdetCreate.value.id_item,
    id_item_det: this.itemdetCreate.value.id_item_det,
    item_det: this.itemdetCreate.value.item_det,
    valor_esperado: this.itemdetCreate.value.valor_esperado,
    fechaActualizacion: new Date()
  }
this.loading = true;

this._itemdetService.actualizarItemdet(id,Itemdet).then(() =>{
  this.loading = false;
  this.toastr.info('Respuestas actualizada','Respuestas actualizada',{
    positionClass:'toast-bottom-right'
  })
  this.router.navigate(['/itemdetList']);
});
}

  esEditar() {
    this.titulo = 'Editar Respuestas';
    if(this.id !== null)  {
      this.loading = true;
      this._itemdetService.getItemdet(this.id).subscribe(data =>{
        this.loading = false;
        console.log(data.payload.data()['id_item']); //accedemos a todos los datos
        this.itemdetCreate.setValue({
          id_item: data.payload.data()['id_item'],
          id_item_det: data.payload.data()['id_item_det'],
          item_det: data.payload.data()['item_det'],
          valor_esperado: data.payload.data()['valor_esperado']
        })
      })
    }
  }

}
