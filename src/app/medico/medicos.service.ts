import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from './medico.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

import { AuthService } from '../authentication/auth.service';

@Injectable()
export class MedicosService {

	private headers = new Headers({ 'Content-Type': 'application/json' });
	private medicosURL = environment.apiUrl + '/medicos';  // URL to web api

	constructor(private http: Http, private authService: AuthService) {

	}// Al ser promise (y no Observable), no le quita reactividad?

	buscarMedico(id): Promise<any> {
		return this.http.get(this.medicosURL + '/' + id, this.authService.jwt())
			.toPromise()
			.then(response => {
				return response.json() as any;
			})
			.catch(this.handleError);
	}


	getDoctores(): Promise<Medico[]> {
		return this.http.get(this.medicosURL, this.authService.jwt())
			.toPromise()
			.then(response => {
				return response.json() as Medico[];
			})
			.catch(this.handleError);
	}

	public createMedico(nuevoMedico): Promise<any> {
		return this.http.post(this.medicosURL, nuevoMedico, this.authService.jwtContentType()).toPromise().
			then(res => {
				return res.json();
			})
			.catch(err => this.handleError);
	}

	public actualizarSemana(id, semana): Promise<any[]> {
		return this.http.patch(this.medicosURL + '/' + id, { semanaEsquema: semana }, this.authService.jwt()).toPromise().then(respuesta => {
			return respuesta.json();
		}).catch(err => this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de Medicos: ', error);
		return Promise.reject(error.message || error);
	}


}
