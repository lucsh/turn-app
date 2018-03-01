
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';
import {PacientesComponent} from './pacientes/pacientes.component';
import {ObrasComponent} from './obras/obras-main/obras.component';
import {TurnosDelMedicoComponent} from './turnos-del-medico/turnos-del-medico.component';

import { AuthGuard } from './authentication/auth.guard';
import { AdministrativoGuard } from './authentication/administrativo.guard';
import { MedicoGuard } from './authentication/medico.guard';


import { LoginComponent }     from './authentication/login.component';
import { RegisterComponent } from './authentication/register.component';

import { ConfiguracionMedicoComponent } from './configuracion-medico/configuracion-medico.component';

const appRoutes: Routes =  [
{
	path: '',
	component: DashboardComponent,
    canActivate: [AuthGuard, AdministrativoGuard]
},
// {
// 	path:'turnos',
// 	component: TurnosComponent,
//     canActivate: [AuthGuard]
// },
{
	path: 'turnos/:doctor/:idDoctor',
	component: TurnosComponent,
    canActivate: [AuthGuard]
},
{
	path: 'pacientes',
	component: PacientesComponent,
//    canActivate: [AuthGuard]
},
{
	path: 'medico',
	component: TurnosDelMedicoComponent,
    canActivate: [AuthGuard, MedicoGuard]
},
{
	path: 'configuracion',
	component: ConfiguracionMedicoComponent,
	canActivate: [AuthGuard, AdministrativoGuard]
},
{
	path: 'obras',
	component: ObrasComponent,
	canActivate: [AuthGuard, AdministrativoGuard]
},
{
	path: 'configuracion/:idDoctor',
	component: ConfiguracionMedicoComponent,
	canActivate: [AuthGuard]
},
  { path: 'login', component: LoginComponent },
	// { path: 'registro', component: RegisterComponent }
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
