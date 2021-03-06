import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from '../medico/medico.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ConfiguracionMedicoService {

	private headers = new Headers({'Content-Type': 'application/json'});
	private medicosURL = environment.apiUrl + '/medicos';  // URL to web api

	constructor(private http: Http, private authService: AuthService) {

	}
	// Al ser promise (y no Observable), no le quita reactividad?
	getMedicos(): Promise<any[]> {
		return this.http.get(this.medicosURL, this.authService.jwt())
		.toPromise()
		.then(response => {
			return response.json() as any[];
		})
		.catch(this.handleError);
	}


	private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de anys: ', error);
		// alert(error.json().error);
		return Promise.reject(error.message || error);
	}

	buscarMedico(id): Promise<any> {
		return this.http.get(this.medicosURL + '/' + id, this.authService.jwt())
		.toPromise()
		.then(response => {
			// console.log(response.json());
			return response.json() as any;
		})
		.catch(this.handleError);
	}

	actualizarMedico(id, nombre, apellido, emailMedico, duracion, obras, idUsuario): Promise<any> {

		if (obras != null) {
			obras = this.limpiarParticular(obras);
		}
		return this.http.patch(this.medicosURL + '/' + id, 
		{nombre: nombre, apellido: apellido, email: emailMedico, duracion: duracion, obras: obras, _idUsuario: idUsuario},
		this.authService.jwt()).toPromise()
		.then(response => {
			return response.json() as any;
		})
		.catch(this.handleError);
	}

	eliminarMedico(id): Promise<any[]> {
		return this.http.patch(this.medicosURL + '/' + id, {eliminado: true}, this.authService.jwt())
		.toPromise()
		.then(response => {
			// console.log("RESPUESTA DESDE EL PATCH");
			// console.log(response.json());
			return response.json() as any[];
		})
		.catch(this.handleError);
	}

  getSemanaModelo(medico): Promise<any[]> {
    const id = medico._id;

    const medicoService = environment.apiUrl + '/medicos';

		return this.http.get(medicoService + '?_id=' + id, this.authService.jwt())
		.toPromise()
		.then(res => {
			const medico = res.json();

			return medico.semanaEsquema;
		})
		.catch(this.handleError);
  }

	/** Este metodo es creado para quitar la obra Particular 
	 * (que en realidad fue agregada a este arreglo para crear una sensacion visual, y no es una obra real en el BACKEND) */
	private limpiarParticular(obras) {
		const resultado =  [];
		if (obras != null ){
			for (let index = 0; index < obras.length; index++) {
				const element = obras[index];
				if (element.nombre != 'Particular'){
					resultado.push(element);
				}
			}
		}
		return resultado;
	}
}
