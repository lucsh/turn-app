import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {VariablesGlobales} from '../variablesGlobales';
import {Tarea} from './tarea.tipo';

@Injectable()
export class TareasService {


  private headers = new Headers({'Content-Type': 'application/json'});
	private tareasURL = VariablesGlobales.BASE_API_URL+'/tareas';  // URL to web api

  constructor(private http: Http) {

  }


  getTodos(): Promise<Tarea[]>{
    return this.http.get(this.tareasURL)
		.toPromise()
		.then(response => {
			console.log(response.json());
			return response.json() as Tarea[];
		})
		.catch(this.handleError);

  }

	createTodo(descripcion : string) : Observable<any>{
		return this.http.post(this.tareasURL,
			{
			  descripcion: descripcion,
			  estado: false
			});
	}
	updateTodo(tareaId:string,descripcion:string,nuevoEstado:boolean) : Observable<any>{
		return this.http.put(this.tareasURL+"/"+ tareaId,
			{
			  descripcion: descripcion,
			  estado: nuevoEstado
			});
	}
	deleteTodo(tareaId:string) : Observable<any>{
		return this.http.delete(this.tareasURL+"/"+ tareaId);
	}


  private handleError(error: any): Promise<any> {
		console.error('Ocurrio un error en servicio de Tareas: ', error);
		alert(error.json().error);
		return Promise.reject(error.message || error);
	}
}
