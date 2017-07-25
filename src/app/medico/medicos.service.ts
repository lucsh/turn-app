import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from './medico.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MedicosService {

	private headers = new Headers({'Content-Type': 'application/json'});
    private medicosURL = 'http://localhost:3030/medicos';  // URL to web api

	constructor(private http: Http) {

	}//Al ser promise (y no Observable), no le quita reactividad?
	getDoctores(): Promise<Medico[]>{
        return this.http.get(this.medicosURL)
        .toPromise()
        .then(response => {
			// console.log(response.json());
			return response.json() as Medico[];
		})
        .catch(this.handleError);
    }

	private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de Medicos: ', error);
        alert(error.json().error);
        return Promise.reject(error.message || error);
    }

}
