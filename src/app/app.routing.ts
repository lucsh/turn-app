
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';
import {PacientesComponent} from './pacientes/pacientes.component';
import {ObrasComponent} from './obras/obras.component';
import {TurnosDelMedicoComponent} from './turnos-del-medico/turnos-del-medico.component'

import { AuthGuard } from './authentication/auth.guard';


import { LoginComponent }     from './authentication/login.component';
import { RegisterComponent } from './authentication/register.component';

import { ConfiguracionMedicoComponent } from './configuracion-medico/configuracion-medico.component';

const appRoutes: Routes =  [
{
	path:'',
	component: DashboardComponent,
    canActivate: [AuthGuard]
},
{
	path:'turnos',
	component: TurnosComponent,
    canActivate: [AuthGuard]
},
{
	path:'turnos/:doctor/:idDoctor',
	component: TurnosComponent,
    canActivate: [AuthGuard]
},
{
	path:'pacientes',
	component: PacientesComponent,
    canActivate: [AuthGuard]
},
{
	path:'medico',
	component: TurnosDelMedicoComponent,
    canActivate: [AuthGuard]
},
{
	path:'configuracion',
	component: ConfiguracionMedicoComponent,
	canActivate: [AuthGuard]
},
{
	path:'obras',
	component: ObrasComponent,
	canActivate: [AuthGuard]
},
{
	path:'configuracion/:idDoctor',
	component: ConfiguracionMedicoComponent,
	canActivate: [AuthGuard]
},
  { path: 'login', component: LoginComponent },
	{ path: 'registro', component: RegisterComponent }
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
