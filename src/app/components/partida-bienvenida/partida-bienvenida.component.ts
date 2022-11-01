import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';

@Component({
  selector: 'app-partida-bienvenida',
  templateUrl: './partida-bienvenida.component.html'
})
export class PartidaBienvenidaComponent implements OnInit {
  //parametros para iniciar juego
    dataSaliente: any[] = [];
  idPartida: any = {};
  jugador: any = {};
  //bienvenida: FormGroup;

  constructor(private _ConfiguracionService: ConfiguracionService,
    private fb: FormBuilder,
    private router: Router
  ) {

    // this.bienvenida = this.fb.group({
    //   idPartida: ['', Validators.required],
    //   jugador: ['', Validators.required]
    // })

    //this.idPartida = this._ConfiguracionService.getIdPartida()
  }

  addData(jugador: string, idPartida: string) {
    // console.log('data saliente ...', jugador);
    // console.log('data saliente ...', idPartida);
    this.dataSaliente = [jugador, idPartida];
    console.log('data saliente ...', this.dataSaliente );
    this._ConfiguracionService.disparadorJuego.emit({ data: this.dataSaliente })
    this.router.navigate(['/juegouser'])
  }

  ngOnInit(): void {

  }

}
