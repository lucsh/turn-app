import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';
import {PacientesComponent} from './pacientes/pacientes.component';

import {SolicitudesComponent} from './pedidos/solicitudes.component';


const appRoutes: Routes =  [
{
	path:'',
	component: DashboardComponent
},
{
	path:'turnos',
	component: TurnosComponent
},
{
	path:'turnos/:doctor/:matricula',
	component: TurnosComponent
},
{
	path:'pacientes',
	component: PacientesComponent
},
{
	path:'algo',
	component: SolicitudesComponent
}
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
