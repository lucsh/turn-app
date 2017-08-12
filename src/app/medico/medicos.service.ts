import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from './medico.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {VariablesGlobales} from '../variablesGlobales';

import { AuthService } from '../authentication/auth.service';

@Injectable()
export class MedicosService {

	private headers = new Headers({'Content-Type': 'application/json'});
    private medicosURL = VariablesGlobales.BASE_API_URL +'/medicos';  // URL to web api

	constructor(private http: Http, private authService: AuthService) {

	}//Al ser promise (y no Observable), no le quita reactividad?
	getDoctores(): Promise<Medico[]>{
        return this.http.get(this.medicosURL,this.authService.jwt())
        .toPromise()
        .then(response => {
			// ////console.log(response.json());
			return response.json() as Medico[];
		})
        .catch(this.handleError);
    }

	public actualizarSemana(id,semana): Promise<any[]>{
		return this.http.patch(this.medicosURL+'/'+id,{semanaEsquema:semana},this.authService.jwt()).toPromise().then(respuesta => {
			//console.log("Semana actualizada");
			//console.log(respuesta);
			return respuesta.json();
		})
	}

	private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de Medicos: ', error);
        alert(error.json().error);
        return Promise.reject(error.message || error);
  }


}
