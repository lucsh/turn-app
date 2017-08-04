import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DashboardService {

  constructor(private http: Http) {

  }
	// getEstadosCitas(): Observable<any>{
	// 	return this.http.get("http://localhost:3000/estados-citas")
	// 	.map( (res: Response) => [
  //     {
  //       "id": 1,
  //       "nombre": "En espera",
  //       "clase": "warning"
  //     },
  //     {
  //       "id": 2,
  //       "nombre": "Cancelada",
  //       "clase": "danger"
  //     },
  //     {
  //       "id": 3,
  //       "nombre": "Pendiente",
  //       "clase": "default"
  //     },
  //     {
  //       "id": 4,
  //       "nombre": "Otro Estado",
  //       "clase": "default"
  //     }
  //   ] )
	// 	.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	// }

	// getCitas(): Observable<any>{
	// 	return this.http.get("http://localhost:3000/citas")
	// 	.map( (res: Response) => res.json() )
	// 	.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	// }

  	getTodos(): any[]{
		return [{
        "todo": "Enviar email de recordatorio a Juan Perez",
        "completa": false,
        "id": 1
      },
      {
        "id": 2,
        "todo": "Consultar horarios disponibles",
        "completa": false
      },
      {
        "todo": "Pagar factura de internet",
        "completa": false,
        "id": 3
      },
      {
        "id": 4,
        "todo": "Enviar documentacion a la Dra. Manzano",
        "completa": true
      },
      {
        "id": 5,
        "todo": "Llamar al electricista",
        "completa": false
      },
      {
        "id": 6,
        "todo": "Encargar almuerzo",
        "completa": true
      },
      {
        "todo": "Llamar a Codetry",
        "completa": false,
        "id": 7
      }
    ];
  }


  // 	getMensajes(): Observable<any>{
	// 	return this.http.get("http://localhost:3000/mensajes")
	// 	.map( (res: Response) => res.json() )
	// 	.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	// }

	// createCita(newHora : string, newPaciente : string, newDoctor : string) : Observable<any>{
	// 	//sobreturnos desde escritorio
	// 	return this.http.post("http://localhost:3000/citas",
	// 		{
	// 		  dia:'01-06-2017',//hoy
	// 		  hora:newHora,
	// 		  paciente:newPaciente,
	// 		  doctor:newDoctor,
	// 		  status: 'En espera'
	// 		});
	// }

	// updateCita(cita) : Observable<any>{
	// 	return this.http.put("http://localhost:3000/citas/" + cita.id,
	// 		cita);
	// }

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
