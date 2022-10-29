import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JuegoComponent } from './components/juego/juego.component';
import { ItemdetListComponent } from './components/itemdet-list/itemdet-list.component';
import { ItemdetCreateComponent } from './components/itemdet-create/itemdet-create.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConfiguracionListComponent } from './components/configuracion-list/configuracion-list.component';
import { ConfiguracionCreateComponent } from './components/configuracion-create/configuracion-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { ToastrModule } from 'ngx-toastr';
import { PartidaListComponent } from './components/partida-list/partida-list.component';
import { PartidaCreateComponent } from './components/partida-create/partida-create.component';

@NgModule({
  declarations: [
    AppComponent,
    JuegoComponent,
    ItemdetListComponent,
    ItemdetCreateComponent,
    NavbarComponent,
    ConfiguracionListComponent,
    ConfiguracionCreateComponent,
    PartidaListComponent,
    PartidaCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFirestoreModule,
    ToastrModule.forRoot()
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
