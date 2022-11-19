import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
  createItem: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = '';
  constructor(private fb: FormBuilder,
    private _itemService: ItemService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this, this.createItem = this.fb.group({
      id_item: ['', Validators.required],
      item: ['', Validators.required],
      id_tipo_respuesta: ['1', Validators.required],
      id_configuracion: ['2', Validators.required],
      estado: ['0', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get("id");
    //console.log(this.id);
  }
  ngOnInit(): void {
    this.esEditar();
  }
  agregarEditarItem() {
    this.submitted = true;
    if (this.createItem.invalid) {
      return;
    }
    if (this.id === null) {
     // console.log(this.id);

      this.titulo = 'Crear Preguntas';
      this.agregarItem();
    } else {
      this.titulo = 'Editar Pregunta';
      this.editarItem(this.id);
    }
  }

  agregarItem() {
    const Item: any = {
      id_item: this.createItem.value.id_item,
      id_configuracion: this.createItem.value.id_configuracion,
      item: this.createItem.value.item,
      id_tipo_respuesta: this.createItem.value.id_tipo_respuesta,
      estado: this.createItem.value.estado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    console.log('agregar');
    
    this._itemService.agregarItem(Item).then(() => {
     // this.toastr.success('Pregunta registrado con éxito!', 'ItePreguntam registrada', { positionClass: 'toast-bottom-right' });
      this.loading = false;
      //this.router.navigate(['/item-list'])
    }).catch(error => {
      console.log(error);
      this.loading = false;
    })
  }

  editarItem(id: string) {

    const Item: any = {
      id_item: this.createItem.value.id_item,
      id_configuracion: this.createItem.value.id_configuracion,
      item: this.createItem.value.item,
      id_tipo_respuesta: this.createItem.value.id_tipo_respuesta,
      estado: this.createItem.value.estado,
      fechaActualizacion: new Date()
    }
    this.loading = true;

    this._itemService.actualizarItem(id, Item).then(() => {
      this.loading = false;
      this.toastr.info('Pregunta ha sido actualizada', 'Pregunta actualizada', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/item-list']);
    });
  }

  esEditar() {
    // this.titulo = 'Editar Item';
    console.log('es editar, this.id ', this.id);

    if (this.id !== null) {
      this.loading = true;
      this._itemService.getItem(this.id).subscribe(data => {
        console.log('data', data);

        this.loading = false;
       // console.log('id_item', data['id_item']); //accedemos a todos los datos
        this.createItem.setValue({
          id_item: data['id_item'],
          id_configuracion: data['id_configuracion'],
          item: data['item'],
          id_tipo_respuesta: data['id_tipo_respuesta'],
          estado: data['estado']
        })
      })
    }
  }

}
