import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Obra } from './obra.tipo';
import { environment } from '../../environments/environment';

import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ObrasService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private obrasURL = environment.apiUrl +'/obras';  // URL to web api


  constructor(private http: Http,private authService: AuthService) { }

  getObras(): Promise<Obra[]>{
    return this.http.get(this.obrasURL,this.authService.jwt())
    .toPromise()
    .then(response => {
      console.log("Me llegaron las siguientes obras!");
      console.log(response.json());
      return response.json() as Obra[];
    })
    .catch(this.handleError);
  }

  actualizarObra(id,datos): Promise<Obra[]>{
    return this.http.put(this.obrasURL+'/'+id,datos,this.authService.jwt())
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PUT");
			// ////console.log(response.json());
			return response.json() as Obra[];
		})
		.catch(this.handleError);
  }

  crearObra(iniciales,nombre): Promise<Obra>{
    return this.http.post(this.obrasURL,{iniciales: iniciales,nombre:nombre},this.authService.jwtContentType())
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PUT");
			// ////console.log(response.json());
			return response.json() as Obra;
		})
		.catch(this.handleError);
  }

  eliminarObra(_id):Promise<Obra[]>{
    return this.http.delete(this.obrasURL+'/'+_id,this.authService.jwt())
		.toPromise()
		.then(response => {
			//console.log("RESPUESTA DESDE EL PATCH");
			//console.log(response.json());
			return response.json() as Obra[];
		})
		.catch(this.handleError);

  }



  //---------------------------------------------------------------------------
  private handleError(error: any): Promise<any> {
    console.error('Ocurrio un error en servicio de Pacientes: ', error);
    // alert(error.json().error);
    return Promise.reject(error.message || error);
  }

}
