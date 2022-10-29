import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PartidaService } from 'src/app/services/partida.service';

@Component({
  selector: 'app-partida-list',
  templateUrl: './partida-list.component.html',
  styleUrls: ['./partida-list.component.css']
})
export class PartidaListComponent implements OnInit {
    partidas: any[] = [];
  
    constructor(private _partidaService: PartidaService,
      private toastr: ToastrService) { }
  
    ngOnInit(): void {
      this.getPartida()
    }
    getPartida() {
      this._partidaService.getPartidas().subscribe(data => {
        this.partidas = [];
        data.forEach((element:any )=> {
          // console.log(element.payload.doc.id);
          /*console.log(element.payload.doc.data());*/
          this.partidas.push({
            id : element.payload.doc.id,
            ...element.payload.doc.data()
          })
        });
        console.log(this.partidas);
      })
    }
    
    eliminarPartida(id: string) {
    this._partidaService.eliminarPartida(id).then(() => {
      console.log('partida eliminada con exito');
      this.toastr.error('partida eliminada con exito','Registro Eliminado', {positionClass: 'toast-bottom-right'});
    }).catch(error => {
    console.log(error);
    })
    }
  }
  
