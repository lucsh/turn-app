import { Component } from '@angular/core';
import { FooterComponent } from './ui/footer.component';
import { detectBody } from './app.helpers';


import { AuthService } from './authentication/auth.service';

declare var jQuery:any;


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private auth: AuthService) {}

	private logueadoCache: any = false;

	public ngOnInit():any {
		detectBody();
		this.logueado();
	}

	public onResize(){
		detectBody();
	}

	estaLogueado(){
		//console.log(localStorage);
		let token = localStorage.getItem('feathers-jwt');
		return token;
		// return this.logueadoCache;
	}

	public logueado(){
		console.log("logueado method");

		this.auth
		.logIn()
		.then(() => {
			console.log('TODO OK');
			this.logueadoCache = true;
		})
		.catch(() => {
			console.log('No logueado');

			this.logueadoCache = false;
		});
	}
}
