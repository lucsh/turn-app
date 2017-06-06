import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Doctor } from './doctor.tipo'

import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

@Injectable()
export class DoctoresService {

	private headers = new Headers({'Content-Type': 'application/json'});
    private doctoresURL = 'http://localhost:3000/doctores';  // URL to web api

	constructor(private http: Http) { 

	}

	/*
	getDoctores(): Observable<Doctor>{
		return this.http.get("http://localhost:3000/doctores")
		.map( (res: Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	}
	*/
	getDoctores(): Promise<Doctor[]>{
        return this.http.get(this.doctoresURL)
        .toPromise()
        .then(response => response.json() as Doctor[])
        .catch(this.handleError);
    }

	private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de Doctores: ', error);
        alert(error.json().error);
        return Promise.reject(error.message || error);
    }

}
