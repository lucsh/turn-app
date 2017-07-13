import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';


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
}
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
