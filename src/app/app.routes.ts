import { Routes, RouterModule } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';

const APP_ROUTES: Routes = [
  { path: 'mapa', component: MapaComponent },
  { path: '**', pathMatch:'full', redirectTo: 'mapa' }

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
