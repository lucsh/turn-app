import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NavigationService {

  constructor(private http: Http) { 

  }
	getUsuario(): Observable<any>{
		return this.http.get("http://localhost:3000/profile")
		.map( (res: Response) => res.json() )
		.catch((error:any) => Observable.throw(error.json().error || ' Server Error '));
	}
}