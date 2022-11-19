import { Component, OnInit, Input } from '@angular/core';
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
  juegos: any[] = [];
  Configuracion: any | Configuracion;
  preguntas: any[] = [];
  preguntaActual: any;
  respuestas: any[] = [];
  loading = false;
  id: string | null;
  private indiceActual: number = -1;
  seconds!: number;
  intervalId!: number;

  constructor(private fb: FormBuilder,
    private _ConfiguracionService: ConfiguracionService,
    private _ItemService: ItemService,
    private _ItemDetService: ItemdetService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {

    this.resetSecs();
    this.id = this.aRoute.snapshot.paramMap.get("id");
  }


  ngOnInit(): void {
    this.getItemByIdConfiguracion();
  }
  private resetSecs() {
    this.seconds = 3;
  }
  private conteoRegresivo(): void {

    if (--this.seconds >= 0) {
     // console.log('quedan ', this.seconds + 1);
      clearInterval(this.intervalId);
    }
  }

  contador() {
    this.resetSecs();
    setInterval(() => this.conteoRegresivo(), 1000);
    let i = 0;

    for (i = 0; i < this.preguntas.length; i++) {
      this.doSetTimeout(i + 1, 'test');
      this.cambiarEstadoTimeOut(i + 1);
    }
  }

  doSetTimeout(ciclo: number, valor: string) {

    const name = () => {
      this.siguientePregunta()
     // console.log('ciclo siguientePregunta', ciclo);
      this.resetSecs();
      setInterval(() => this.conteoRegresivo(), (ciclo + 1) * 1000);
    };
    setTimeout(function () {
      name()
    }, (ciclo * this.seconds) * 1000); //1000 = time in milliseconds
  }

  cambiarEstadoTimeOut(ciclo: number) {

    const name = () => {
     // console.log('metodo para cambiar estado');
      if (this.indiceActual < this.preguntas.length) {
        this.preguntaActual = this.preguntas[this.indiceActual];
       // this._ItemService.actualizarItem()
        //console.log(this.preguntaActual );
        //console.log(this.preguntas[this.indiceActual+1]);
        this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
          this.respuestas = data;
        });
      }
      //this.siguientePregunta()
     // console.log('ciclo', ciclo);
      //this.resetSecs();
      //setInterval(() => this.conteoRegresivo(), (ciclo + 1) * 1000);
    };
    setTimeout(function () {
      name()
    }, (ciclo * this.seconds) * 1000); //1000 = time in milliseconds
  }

  getItemByIdConfiguracion() {
    if (this.id != null) {
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(
        (Configuracion) => {
          this.Configuracion = Configuracion;
          this._ItemService.getItemByIdConfiguracion(Configuracion.id_configuracion, 0).subscribe(
            (item: any) => {
              this.preguntas = item;
              this.siguientePregunta();
            }
          )
        }
      )
    }
  }

  siguientePregunta(): void {
    this.indiceActual++;
    //console.log('siguientePregunta--indiceActual', this.indiceActual);
    //console.log('siguientePregunta--this.preguntas.length)', this.preguntas.length);

    if (this.indiceActual < this.preguntas.length) {
      this.preguntaActual = this.preguntas[this.indiceActual];
      //console.log('preguntaActual' ,this.preguntaActual );
      //console.log(this.preguntas[this.indiceActual+1]);
      //console.log('id_item consulta: ',Number(this.preguntaActual.id_item));
      
      this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
       // console.log(data);
        
        this.respuestas = data;
      });
    }

  }

  getConfiguracion() {
    if (this.id !== null) {
      this.loading = true;
      this._ConfiguracionService.getConfiguracion(this.id).subscribe(data => {
        this.loading = false;
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
          this._ItemService.getItemByIdConfiguracion(Configuracion.id_configuracion, 0).subscribe(
            (item) => {
              item.forEach((element: any) => {
                this._ItemDetService.getItemdetByIdItem(element.payload.doc.id_item).subscribe(
                  (itemdet) => {
                    //console.log('getItemdetByIdItem--itemdet', itemdet);
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

}
