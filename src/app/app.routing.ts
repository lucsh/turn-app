import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';

import { AuthGuard } from './authentication/auth.guard';


import { LoginComponent }     from './authentication/login.component';
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
	path:'turnos/:doctor/:matricula',
	component: TurnosComponent,
        canActivate: [AuthGuard]
},
  { path: 'login', component: LoginComponent }
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
