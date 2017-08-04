import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';



import { Medico } from '../medico/medico.tipo';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ConfiguracionMedicoService {

	private headers = new Headers({'Content-Type': 'application/json'});
	private medicosURL = 'http://localhost:3030/medicos';  // URL to web api



	constructor(private http: Http) {

	}//Al ser promise (y no Observable), no le quita reactividad?
	getMedicos(): Promise<any[]>{
		return this.http.get(this.medicosURL)
		.toPromise()
		.then(response => {
			//console.log(response.json());
			return response.json() as any[];
		})
		.catch(this.handleError);
	}


	private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de anys: ', error);
		alert(error.json().error);
		return Promise.reject(error.message || error);
	}

	buscarMedico(id): Promise<any[]>{
		return this.http.get(this.medicosURL+'/'+id)
		.toPromise()
		.then(response => {
			//console.log(response.json());
			return response.json() as any[];
		})
		.catch(this.handleError);
	}

	actualizarMedico(id,nombre,apellido,duracion,obras): Promise<any[]>{
		return this.http.patch(this.medicosURL+'/'+id,{nombre: nombre, apellido: apellido, duracion:duracion,obras:obras})
		.toPromise()
		.then(response => {
			// ////console.log("RESPUESTA DESDE EL PUT");
			// ////console.log(response.json());
			return response.json() as any[];
		})
		.catch(this.handleError);
	}

	eliminarMedico(id): Promise<any[]>{
		return this.http.patch(this.medicosURL+'/'+id,{eliminado:true})
		.toPromise()
		.then(response => {
			//console.log("RESPUESTA DESDE EL PATCH");
			//console.log(response.json());
			return response.json() as any[];
		})
		.catch(this.handleError);
	}

  getSemanaModelo(medico): Promise<any[]> {
    let id = medico._id;

    let urlSemanas = 'http://localhost:3030/semanas';


    return this.http.get(urlSemanas)
		.toPromise()
		.then(response => {

      //Filtramos....
       var arr = response.json();
       var result = [];
       for (var i = 0; i < arr.length; i++) {
         if(arr[i].medico._id === id){
           result.push(arr[i]);
           ////console.log("LALALA");
         }
       }

			return result as any[];
		})
		.catch(this.handleError);
  }



}
