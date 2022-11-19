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
import { Observable, takeWhile, tap, timer } from 'rxjs';
import { Partida } from '../../interfaces/partida';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
  preguntas: any[] = [];
  preguntaActual: any;
  respuestas: any[] = [];
  loading = false;
  private indiceActual: number = -1;
  bienvenida: boolean = true;
  public tiempoRestante!: number;
  public mostrarRespuesta!: boolean;
  public respuestaCorrecta: any;
  public partida: Partida;

  constructor(private fb: FormBuilder,
    private _ConfiguracionService: ConfiguracionService,
    private _ItemService: ItemService,
    private _ItemDetService: ItemdetService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private router: Router) {

    this.partida = <Partida>this.router.getCurrentNavigation()!.extras.state;
    if (!this.partida) {
      this.router.navigate(['/configuracion-list'])
    }
  }

  ngOnInit(): void {
    this.getItemByIdConfiguracion();
  }

  getItemByIdConfiguracion() {
    if (this.partida != null) {
          this._ItemService.obtenerPreguntasConfiguracion(Number(this.partida.id_configuracion)).subscribe(
            (item: any) => {
              this.preguntas = item;
              this.siguientePregunta();
            }
          )
        } else {
          this.router.navigate(['/configuracion-list'])
        }
  }

  public iniciarCuentaRegresiva(): void {
    this.mostrarRespuesta = false;
    let tiempoTotal: number = 5;
    this.tiempoRestante = tiempoTotal;
    timer(1000, 1000)
      .pipe(
        takeWhile( () => this.tiempoRestante > 0 ),
        tap(() => {
          --this.tiempoRestante;
          if (this.tiempoRestante === 0) {
              this.mostrarRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  siguientePregunta(): void {
    this.indiceActual++;
    if (this.indiceActual < this.preguntas.length) {
      this.preguntaActual = this.preguntas[this.indiceActual];
      this._ItemDetService.getItemdetByIdItem(this.preguntaActual.id_item).subscribe(data => {
        this.respuestas = data;
        this.iniciarCuentaRegresiva();
      });
    }
  }
}
