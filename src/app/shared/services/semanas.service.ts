import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../authentication/auth.service';

@Injectable()
export class SemanasService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private semanasURL = environment.apiUrl + '/semanas';  // URL to web api

  constructor(private http: Http, private authService: AuthService) { }

  // TODO: create Semana Model
  findByWeek(noWeek: Number, year: Number): Promise<any[]>{
    return this.http.get(this.semanasURL + '/?anio=' + year + '&numSemana=' + noWeek, this.authService.jwt())
    .toPromise()
    .then(response => {
      return response.json() as any[];
    })
    .catch(this.handleError);
  }

   // TODO: create Semana Model
   findByDoctor(doctorId: String, noWeek: Number, year: Number): Promise<any[]>{
    return this.http.get(this.semanasURL + '/?medico=' + doctorId + '&anio=' + year + '&numSemana=' + noWeek, this.authService.jwt())
    .toPromise()
    .then(response => {
      return response.json() as any[];
    })
    .catch(this.handleError);
  }

  // ---------------------------------------------------------------------------
  private handleError(error: any): Promise<any> {
    console.error('Ocurrio un error en servicio de Pacientes: ', error);
    // alert(error.json().error);
    return Promise.reject(error.message || error);
  }

}
