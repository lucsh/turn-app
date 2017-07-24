import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';


import { LoginComponent }     from './authentication/login.component';
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
  { path: 'login', component: LoginComponent }
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
