import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ItemService } from 'src/app/services/item.service';
import { ItemdetService } from 'src/app/services/itemdet.service';
import { ConfiguracionListComponent } from '../configuracion-list/configuracion-list.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { Configuracion } from 'src/app/interfaces/configuracion';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
  //createConfiguracion: FormGroup;
  juegos: any[] = [];
  //Configuracion: any[] = [];
  //item: any[] = [];
  items: Item[] = [];
  Configuracions: Configuracion[] = [];
  Configuracion:  any | Configuracion;
  idConfiguracion = '';
  //preguntas: any[] = [];
  preguntas: any[] = [];
  preguntaActual:any;
  respuestas: any[] = [];
  //createJuego: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  private indiceActual:number = -1;
  titulo = 'Armar Juego';

  constructor(private fb: FormBuilder,
    private _ConfiguracionService: ConfiguracionService,
    private _ItemService: ItemService,
    private _ItemDetService: ItemdetService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {
      //this.idConfiguracion =this.router.getCurrentNavigation().extras.state.id;

    this.id = this.aRoute.snapshot.paramMap.get("id");
    // this.idItem = this.aRoute.snapshot.paramMap.get("id_item");
    // console.log(this.id);
     }

  ngOnInit(): void {
     // this._ConfiguracionService.getConfiguracions().subscribe(
    //   prod => {
    //     console.log(prod);
    //   }
    //)
   // this.getConfiguracionByIdConfiguracion();
   this.getItemByIdConfiguracion();
   //this.getItemdetByIdItem();
  }
  getItemByIdConfiguracion() {
    // console.log(this.id);
    //let identificador = this.id;
    if (this.id != null) {
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(
        (Configuracion) => {
          this.Configuracion = Configuracion;
          this._ItemService.getItemByIdConfiguracion(Configuracion.id_configuracion,0).subscribe(
            (item: any) => {
              this.preguntas = item;
              this.siguientePregunta();
          }
          )
        }
      )
    }
  }

  baseRandom(lower: number, upper: number) {
    return 1;
     //return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
  }

  siguientePregunta(): void {
    this.indiceActual++;
    console.log(this.indiceActual);
    console.log(this.preguntas.length);
       
    if(this.indiceActual < this.preguntas.length){
      this.preguntaActual = this.preguntas[this.indiceActual];
      this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
          this.respuestas = data;
      });
    }
    
  }

  // getConfiguracionByIdConfiguracion() {
  //   // console.log(this.idConfiguracion);
  //   let identificador = this.id;
  //   if (identificador != null) {
  //     this._ConfiguracionService.getConfiguracion(identificador).subscribe(
  //       (part) => {
  //         console.log(part);
  //         //obtiene el id_Configuracion del documento(id) recibido
  //         this._ConfiguracionService.getConfiguracionByIdConfiguracion(part.id_Configuracion).subscribe(
  //           (Configuracion) => {
  //             console.log(Configuracion);
  //             this.preguntas = Configuracion;
  //             // this.Configuracions = part;
  //           }
  //         )
  //       }
  //     )
  //   }
  // }

  getConfiguracion() {
    if (this.id !== null) {
      this.loading = true;
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(data => {
        this.loading = false;
        // console.log(data.payload.data()['id_Configuracion']); //accedemos a todos los datos
        this.juegos.push({
          id_Configuracion: data.payload.doc.data()['id_Configuracion']
        })
      })
    }
  }

  getItemdetByIdItem() {
    if (this.id != null) {
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(
        (Configuracion) => {
          this._ItemService.getItemByIdConfiguracion(Configuracion.id_configuracion,0).subscribe(
            (item) => {
              item.forEach((element: any) => {
                this._ItemDetService.getItemdetByIdItem(element.payload.doc.id_item).subscribe(
                  (itemdet) => {
                    console.log(itemdet);
                    this.respuestas = itemdet;
                  }
                )
              }
              )
            }
          )
        }
      )
    }
  }

  // getConfiguracion(){
  //   if(this.id !== null)  {
  //     this.loading = true;
  //     this._ConfiguracionService.getConfiguracion(this.id).subscribe(data =>{
  //       this.loading = false;
  //       console.log(data.payload.data()['id_Configuracion']); //accedemos a todos los datos       
  //     })
  //   }
  //   this._ConfiguracionService.getConfiguracions().subscribe(data => {
  //     this.Configuracion = [];
  //     data.forEach((element:any )=> {
  //       // console.log(element.payload.doc.id);
  //       /*console.log(element.payload.doc.data());*/
  //       this.Configuracion.push({
  //         id : element.payload.doc.id,
  //         ...element.payload.doc.data()
  //       })
  //     });
  //     console.log(this.Configuracion);
  //   }
  //   )
  // }

}
