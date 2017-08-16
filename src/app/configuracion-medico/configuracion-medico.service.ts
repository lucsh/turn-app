import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';



import { Medico } from '../medico/medico.tipo';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {VariablesGlobales} from '../variablesGlobales';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ConfiguracionMedicoService {

	private headers = new Headers({'Content-Type': 'application/json'});
	private medicosURL = VariablesGlobales.BASE_API_URL +'/medicos';  // URL to web api



	constructor(private http: Http,private authService: AuthService) {

	}//Al ser promise (y no Observable), no le quita reactividad?
	getMedicos(): Promise<any[]>{
		return this.http.get(this.medicosURL,this.authService.jwt())
		.toPromise()
		.then(response => {
			return response.json() as any[];
		})
		.catch(this.handleError);
	}


	private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de anys: ', error);
		alert(error.json().error);
		return Promise.reject(error.message || error);
	}

	buscarMedico(id): Promise<any>{
		return this.http.get(this.medicosURL+'/'+id,this.authService.jwt())
		.toPromise()
		.then(response => {
			//console.log(response.json());
			return response.json() as any;
		})
		.catch(this.handleError);
	}

	actualizarMedico(id,nombre,apellido,duracion,obras, idUsuario): Promise<any>{
		return this.http.patch(this.medicosURL+'/'+id,{nombre: nombre, apellido: apellido, duracion:duracion,obras:obras, _idUsuario:idUsuario},this.authService.jwt())
		.toPromise()
		.then(response => {
			return response.json() as any;
		})
		.catch(this.handleError);
	}

	eliminarMedico(id): Promise<any[]>{
		return this.http.patch(this.medicosURL+'/'+id,{eliminado:true},this.authService.jwt())
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

    let medicoService = VariablesGlobales.BASE_API_URL + '/medicos';

		return this.http.get(medicoService+'?_id='+id,this.authService.jwt())
		.toPromise()
		.then(res => {
			let medico = res.json();

			return medico.semanaEsquema;
		})
		.catch(this.handleError);


    // return this.http.get(urlSemanas+'?medico='+id)
		// .toPromise()
		// .then(response => {
		// 	console.log('ENTRE ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    //   //Filtramos....
    //    var arr = response.json();
		//
		// 	 //console.log(arr);
		//
    //    var result = [];
    //    for (var i = 0; i < arr.length; i++) {
		// 		 //console.log(arr[i]);
    //      if(arr[i].medico._id === id){
    //        result.push(arr[i]);
    //        ////console.log("LALALA");
    //      }
    //    }
		//
		// 	return result as any[];
		// })
		// .catch(this.handleError);




  }



}
