import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Para usar cualquier modulo de ngx-bootstrap,
// primero hay que importar el modulo, y luego
// agregarlo al imports de @NgModule.
// http://valor-software.com/ngx-bootstrap/

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/es';


import { DashboardService } from './dashboard/dashboard.service';
import { TurnosService } from './turnos/turnos.service';
import { DoctoresService } from './turnos/doctores.service';
import { NavigationService } from './ui/navigation/navigation.service';

import { routing } from './app.routing';
import { FooterComponent } from './ui/footer.component';
import { NavigationComponent } from './ui/navigation/navigation.component';
import { TopnavbarComponent } from './ui/topnavbar/topnavbar.component';
import { TimeAgoPipe } from './time-ago.pipe';
import { TurnosComponent } from './turnos/turnos.component';

import { TurnoSocketService } from './turnos/turnos-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    NavigationComponent,
    TopnavbarComponent,
    TimeAgoPipe,
    TurnosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    MomentModule,
    routing
  ],
  providers: [
    DashboardService,
    TurnosService,
    DoctoresService,
    NavigationService,
    TurnoSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
