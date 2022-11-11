import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, Observable, of, tap } from 'rxjs';
import { JugadorPartida } from 'src/app/interfaces/jugador-partida';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { PartidaService } from 'src/app/services/partida.service';

@Component({
  selector: 'app-partida-bienvenida',
  templateUrl: './partida-bienvenida.component.html'
})

export class PartidaBienvenidaComponent implements OnInit {
  //parametros para iniciar juego
  element = false;
  mensaje = "";
  datosPartida: FormGroup;
  submitted = false;
  loading = false;
  titulo = '¡¡Bienvenido!!';

  constructor(private _ConfiguracionService: ConfiguracionService,
    private router: Router,
    private _jugadoresService: JugadoresService,
    private _partidaService: PartidaService,
    private fb: FormBuilder
  ) {
    this, this.datosPartida = this.fb.group({
      jugador: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]],
      id_partida: ['220107179', Validators.required]
    })
  }

  ngOnInit(): void {
    this.loading = false;
    this.mensaje = "";
    this.element = false;
  }

  agregarJugador() {
    let continuar: boolean = true;
    this.loading = true;
    this.submitted = true;
    if (this.datosPartida.invalid) {
      continuar = false;
     if (this.datosPartida.invalid) {
      //   continuar
      let jug = this.datosPartida.value.jugador;
      if (this.datosPartida.value.jug == null) {
        this.mensaje = "Ingresa tu nombre";
      }
      if (jug.length < 5) {
        this.mensaje = "Tu nombre debe tener más de 5 caracteres";
      }
      if (jug.length > 20) {
        this.mensaje = "Tu nombre debe tener 20 caracteres como máximo";
      }

      }
      const configuracion: any = {
        jugador: this.datosPartida.value.jugador,
        id_partida: this.datosPartida.value.id_partida
      }

      this.element = true;
      this.loading = false;
      return;
    }

    //validando si existe jugador
    this._partidaService.getPartidaByIdPartida(Number(this.datosPartida.value.id_partida)).subscribe(
      (partida) => {
        this._jugadoresService.getDocJugadoresByJugador(partida.id, this.datosPartida.value.jugador).subscribe(
          (idDocumentoJugador) => {
            console.log('jugador', idDocumentoJugador);
            if (idDocumentoJugador != "") {
              this.mensaje = "oops! el nombre ingresado ya existe, prueba con uno differente ;) "
              this.element = true;
              continuar = false;
              return;
            } else {
              this.obtenerIdDocPartida();
            }
          }
        )
      }
    )

    // console.log('continuar:', continuar);
    
    // if (continuar==true) {
    //   this.obtenerIdDocPartida();

    // }
  }

  obtenerIdDocPartida() {
    const configuracion: any = {
      jugador: this.datosPartida.value.jugador,
      id_partida: this.datosPartida.value.id_partida
    }
    this._partidaService.getPartidaByIdPartida(Number(configuracion.id_partida))
      .pipe(
        tap((partida: any) => {
          const grJugador: JugadorPartida = {
            nombre: configuracion.jugador,
            puntaje: 0
          };
          sessionStorage.setItem("id_partida", partida.data.id_partida);
          sessionStorage.setItem("jugador", configuracion.jugador);
          sessionStorage.setItem("idConfiguracion", partida.data.id_configuracion);

          let jugador = this._jugadoresService.agregarJugador(partida.id, grJugador);
          jugador.then(result => {
            this.router.navigate(['/juegouser'])
          }).catch(error => {
            this.loading = false;
            this.mensaje = "Verifica el código ingresado";
            this.element = true;
          });
        })
      )
      .subscribe();
  }

  // obtenerIdDocPartida() {
  //   this._partidaService.getPartidaByIdPartida(Number(this.idPartida))
  //   .pipe(
  //     tap((data: any) => {  
  //       const grJugador: JugadorPartida = {
  //         nombre: this.jugador,
  //         puntaje: 0
  //       };
  //       let jugador = this._jugadoresService.agregarJugador(data[0].id, grJugador);
  //       jugador.then(result => {
  //         this.router.navigate(['/juegouser'])
  //       }).catch(
  //         error => this.enviarerError(error)
  //         );
  //     })
  //   )
  //   .subscribe();
  // }

}
