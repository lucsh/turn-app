import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTableModule } from "angular2-datatable";


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
import { MedicosService } from './medico/medicos.service';
import { NavigationService } from './ui/navigation/navigation.service';
import { PacientesService } from './pacientes/pacientes.service';

import { routing } from './app.routing';
import { FooterComponent } from './ui/footer.component';
import { NavigationComponent } from './ui/navigation/navigation.component';
import { TopnavbarComponent } from './ui/topnavbar/topnavbar.component';
import { TimeAgoPipe } from './time-ago.pipe';
import { TurnosComponent } from './turnos/turnos.component';

import { TurnoSocketService } from './turnos/turnos-socket.service';

import { PacientesComponent } from './pacientes/pacientes.component';
import { DataFilterPipe }   from './pacientes/pacientes-filter.pipe';
import { SolicitudesComponent } from './pedidos/solicitudes.component';
import { SolicitudesSocketService } from './pedidos/solicitudes-socket.service';
import { PacientesDelDiaComponent } from './pacientes-del-dia/pacientes-del-dia.component';


import {AsignarPacienteComponent} from './turnos/asignarPaciente/asignarPacienteTurno';
import {AgregarPacienteComponent} from './pacientes/agregarPaciente/agregarPaciente';
import {SelectModule} from 'ng2-select';
import { ObrasComponent } from './obras/obras.component';
import { ObrasService } from './obras/obras.service';
import { TurnosDelMedicoComponent } from './turnos-del-medico/turnos-del-medico.component';

import { AuthService } from './authentication/auth.service';
import { AuthGuard } from './authentication/auth.guard';
import { Feathers } from './authentication/feathers.service';
import { LoginComponent } from './authentication/login.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    NavigationComponent,
    TopnavbarComponent,
    TimeAgoPipe,
    TurnosComponent,
    PacientesComponent,
    DataFilterPipe,
    SolicitudesComponent,
    PacientesDelDiaComponent,
    AsignarPacienteComponent,
    AgregarPacienteComponent,
    ObrasComponent,
    TurnosDelMedicoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    MomentModule,
    routing,
    DataTableModule,
    SelectModule
  ],
  providers: [
    DashboardService,
    TurnosService,
    MedicosService,
    NavigationService,
    TurnoSocketService,
    SolicitudesSocketService,
    ObrasService,
    Feathers,
    AuthService,
    AuthGuard,
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
