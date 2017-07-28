import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {TurnosComponent} from './turnos/turnos.component';
import {PacientesComponent} from './pacientes/pacientes.component';
import {TurnosDelMedicoComponent} from './turnos-del-medico/turnos-del-medico.component'
import { ConfiguracionMedicoComponent } from './configuracion-medico/configuracion-medico.component';


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
	path:'turnos/:doctor/:idDoctor',
	component: TurnosComponent
},
{
	path:'pacientes',
	component: PacientesComponent
},
{
	path:'medico',
	component: TurnosDelMedicoComponent
},
{
	path:'configuracion',
	component: ConfiguracionMedicoComponent
}
];


export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
