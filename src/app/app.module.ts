import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Rutas
import {APP_ROUTING} from './app.routes'
//Servicios
import {LeafletService} from './servicio/leaflet.service'
// Componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //APP_ROUTING
  ],
  providers: [
    LeafletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
