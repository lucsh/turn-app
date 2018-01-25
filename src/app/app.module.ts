import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DataTableModule } from 'angular2-datatable';


import 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdFormFieldModule} from '@angular/material';

import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdCoreModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Para usar cualquier modulo de ngx-bootstrap,
// primero hay que importar el modulo, y luego
// agregarlo al imports de @NgModule.
// http://valor-software.com/ngx-bootstrap/

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MomentModule} from 'angular2-moment';

import { Select2Module } from 'ng2-select2';
import 'moment/locale/es';

import { SimpleNotificationsModule } from 'angular2-notifications';

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

import { DataFilterPipe2 }   from './obras/obras-filter.pipe';


import {AsignarPacienteComponent} from './turnos/asignarPaciente/asignarPacienteTurno';
import {AgregarPacienteComponent} from './pacientes/agregarPaciente/agregarPaciente';
import {SelectModule} from 'ng2-select';
import { ObrasComponent } from './obras/obras.component';

import { ObrasService } from './obras/obras.service';
import { TurnosDelMedicoComponent } from './turnos-del-medico/turnos-del-medico.component';
import { ConfiguracionMedicoComponent } from './configuracion-medico/configuracion-medico.component';
import { ModalSemanaComponent } from './configuracion-medico/modal-semana/modal-semana.component';
import { EditarPacienteComponent } from './pacientes/editarPaciente/editarPaciente';
import { EditarObraComponent } from './obras/editarObra/editarObra';
import { TablaMedicosComponent } from './medico/tablaMedicos/tablaMedicos.component';
import { EditarMedicoComponent } from './medico/editarMedico/editarMedico';


import { AuthService } from './authentication/auth.service';
import { AuthGuard } from './authentication/auth.guard';
import { AdministrativoGuard } from './authentication/administrativo.guard';
import { MedicoGuard } from './authentication/medico.guard';
import { Feathers } from './authentication/feathers.service';
import { LoginComponent } from './authentication/login.component';
import { RegisterComponent } from './authentication/register.component';
import { TareasComponent } from './tareas/tareas.component';
import { VerTurnoComponent } from './turnos/verTurno/verTurno';
import { AgePipe } from './pacientes/edad.pipe';

import { AgregarMedicoComponent } from './medico/agregarMedico/agregarMedico';

import { MedicosCompartidosService } from './routerService/medicos.sistema';
import { PacientesCompartidosService } from './routerService/pacientes.sistema';
import { ObrasCompartidasService } from './routerService/obras.sistema';

import { TablaPacientesComponent } from './pacientes/tablaPacientes/tablaPacientes.component';


import { MyDatePickerModule } from 'mydatepicker';

import { AgregarObraComponent } from './obras/agregarObra/agregarObra';
import { TablaObrasComponent } from './obras/tablaObras/tablaObras.component';

import {ConfiguracionMedicoService} from './configuracion-medico/configuracion-medico.service';

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
    DataFilterPipe2,
    SolicitudesComponent,
    PacientesDelDiaComponent,
    AsignarPacienteComponent,
    AgregarPacienteComponent,
    ObrasComponent,
    TurnosDelMedicoComponent,
    EditarPacienteComponent,
    EditarObraComponent,
    TablaMedicosComponent,
    EditarMedicoComponent,

    LoginComponent,
    RegisterComponent,

    ConfiguracionMedicoComponent,
    ModalSemanaComponent,
    TareasComponent,
    VerTurnoComponent,
    AgePipe,
    AgregarMedicoComponent,
    TablaPacientesComponent,
    AgregarObraComponent,
    TablaObrasComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    DataTableModule,
    MdButtonModule,
    MdAutocompleteModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdCoreModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdNativeDateModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    BsDropdownModule.forRoot(),
    MomentModule,
    routing,
    SelectModule,
    Select2Module,
    SimpleNotificationsModule.forRoot(),
    MyDatePickerModule
  ],
  providers: [
    PacientesService,
    MedicosService,
    NavigationService,
    TurnoSocketService,
    SolicitudesSocketService,
    ObrasService,
    Feathers,
    AuthService,
    AuthGuard,
    AppComponent,
    AdministrativoGuard,
    MedicoGuard,
    MedicosCompartidosService,
    PacientesCompartidosService,
    ObrasCompartidasService,
    ConfiguracionMedicoService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
