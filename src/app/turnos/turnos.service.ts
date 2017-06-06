import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Doctor } from './doctor'

import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

@Injectable()
export class TurnosService {

	private headers = new Headers({'Content-Type': 'application/json'});
    private contratosURL = 'http://localhost:3000/doctores';  // URL to web api

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
        return this.http.get(this.contratosURL)
        .toPromise()
        .then(response => response.json() as Doctor[])
        .catch(this.handleError);
    }


	getTodos(): Observable<any>{
		return this.http.get("http://localhost:3000/todos")
		.map( (res: Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	}
	createTodo(newTodo : string) : Observable<any>{
		return this.http.post("http://localhost:3000/todos", 
		{
			todo: newTodo, 
			completa: false
		});
	}
	updateTodo(todoId:string,todo:string,newStatus:boolean) : Observable<any>{
		return this.http.put("http://localhost:3000/todos/" + todoId, 
		{
			todo: todo,
			completa: newStatus
		});
	}
	deleteTodo(todoId:string) : Observable<any>{
		return this.http.delete("http://localhost:3000/todos/" + todoId);
	}

	private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de Turnos: ', error);
        alert(error.json().error);
        return Promise.reject(error.message || error);
    }

}
