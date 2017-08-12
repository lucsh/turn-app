import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Obra } from './obra.tipo';
import {VariablesGlobales} from '../variablesGlobales';

import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ObrasService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private obrasURL = VariablesGlobales.BASE_API_URL +'/obras';  // URL to web api


  constructor(private http: Http,private authService: AuthService) { }

  getObras(): Promise<Obra[]>{
    return this.http.get(this.obrasURL,this.authService.jwt())
    .toPromise()
    .then(response => {
      ////console.log(response.json());
      return response.json() as Obra[];
    })
    .catch(this.handleError);
  }



  //---------------------------------------------------------------------------
  private handleError(error: any): Promise<any> {
    console.error('Ocurrio un error en servicio de Pacientes: ', error);
    alert(error.json().error);
    return Promise.reject(error.message || error);
  }

}
