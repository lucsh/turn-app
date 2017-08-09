import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TareasService {

  constructor(private http: Http) {

  }


  getTodos(): any[]{

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

}
