import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionCreateComponent } from './components/configuracion-create/configuracion-create.component';
import { ConfiguracionListComponent } from './components/configuracion-list/configuracion-list.component';
import { ItemdetCreateComponent } from './components/itemdet-create/itemdet-create.component';
import { ItemdetListComponent } from './components/itemdet-list/itemdet-list.component';
import { JuegoComponent } from './components/juego/juego.component';
import { JuegouserComponent } from './components/juegouser/juegouser.component';
import { PartidaBienvenidaComponent } from './components/partida-bienvenida/partida-bienvenida.component';
import { PartidaCreateComponent } from './components/partida-create/partida-create.component';
import { PartidaListComponent } from './components/partida-list/partida-list.component';
import { PuntajePartidaComponent } from './components/puntaje-partida/puntaje-partida.component';

const routes: Routes = [
  { path: '', redirectTo: 'partida-bienvenida', pathMatch: 'full' },
  { path: 'juego', component:JuegoComponent},
  { path: 'juegouser', component:JuegouserComponent},
  { path: 'configuracion-list', component:ConfiguracionListComponent},
  { path: 'configuracionEdit/:id',component:ConfiguracionCreateComponent},
  { path: 'configuracionCreate',component:ConfiguracionCreateComponent},
  { path: 'itemdet-list', component:ItemdetListComponent},
  { path: 'itemdet-create',component:ItemdetCreateComponent},
  { path: 'itemdetEdit/:id',component:ItemdetCreateComponent},
  { path: 'partida-list', component:PartidaListComponent},
  { path: 'partidaCreate',component:PartidaCreateComponent},
  { path: 'partidaEdit/:id',component:ItemdetCreateComponent},
  { path: 'tablero-partida/:idPartida',component:PuntajePartidaComponent},
  { path: 'partida-bienvenida',  component:PartidaBienvenidaComponent },
  { path: '**', redirectTo: 'partida-bienvenida', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
