import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Turno } from './turno.tipo'

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TurnosService {

	private headers = new Headers({'Content-Type': 'application/json'});
    private turnosURL = environment.apiUrl +'/turnos';  // URL to web api

	constructor(private http: Http) {

	}


}
