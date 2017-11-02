import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Paciente } from './paciente.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';


import { AuthService } from '../authentication/auth.service';

@Injectable()
export class PacientesService {

	private headers = new Headers({'Content-Type': 'application/json'});
	private pacientesURL = environment.apiUrl + '/pacientes';  // URL to web api

	constructor(private http: Http, private authService: AuthService) {

	}//Al ser promise (y no Observable), no le quita reactividad?
	getPacientes(): Promise<Paciente[]>{
		return this.http.get(this.pacientesURL,this.authService.jwt())
		.toPromise()
		.then(response => {
			////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}
	// GET /messages?status=read&user=10
	getPacientesActivos(): Promise<Paciente[]>{
		return this.http.get(this.pacientesURL+"?eliminado=false&aprobado=true",this.authService.jwt())
		.toPromise()
		.then(response => {
			////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

	createPaciente(nombrePaciente,apellidoPaciente, dniPaciente, emailPaciente, nacimientoPaciente, telefonoPaciente, obraPaciente, ocupacion, observaciones):Promise<Paciente>{

		return this.http
		.post(this.pacientesURL, JSON.stringify({nombre: nombrePaciente ,apellido: apellidoPaciente,
			 dni: dniPaciente, email: emailPaciente, nacimiento: nacimientoPaciente,
			 telefono: telefonoPaciente, obra: obraPaciente, ocupacion: ocupacion, observaciones:observaciones,
			 eliminado: false, aprobado: true, sancion: false
		 }), this.authService.jwtContentType())
		 .toPromise()
		.then(res => {
			return res.json() as Paciente;
		});
	}

	private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de Pacientes: ', error);
		// alert(error.json().error);
		return Promise.reject(error.message || error);
	}

	buscarPaciente(id): Promise<Paciente[]>{
		return this.http.get(this.pacientesURL+'/'+id,this.authService.jwt())
		.toPromise()
		.then(response => {
			////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

	actualizarPaciente(id,datos): Promise<Paciente[]>{
		return this.http.put(this.pacientesURL+'/'+id,datos,this.authService.jwt())
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PUT");
			// ////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

	sancionarPaciente(id): Promise<Paciente[]>{
		return this.http.patch(this.pacientesURL+'/'+id,{sancion:true},this.authService.jwt())
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PATCH");
			// ////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

	eliminarPaciente(id): Promise<Paciente[]>{
		return this.http.patch(this.pacientesURL+'/'+id,{eliminado:true},this.authService.jwt())
		.toPromise()
		.then(response => {
			//console.log("RESPUESTA DESDE EL PATCH");
			//console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

	habilitarPaciente(id): Promise<Paciente[]>{
		return this.http.patch(this.pacientesURL+'/'+id,{sancion:false},this.authService.jwt())
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PATCH");
			// ////console.log(response.json());
			return response.json() as Paciente[];
		})
		.catch(this.handleError);
	}

}
