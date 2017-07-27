import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Obra } from './obra.tipo';

@Injectable()
export class ObrasService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private obrasURL = 'http://localhost:3030/obras';  // URL to web api


  constructor(private http: Http) { }

  getObras(): Promise<Obra[]>{
    return this.http.get(this.obrasURL)
    .toPromise()
    .then(response => {
      //console.log(response.json());
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
