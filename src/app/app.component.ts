import { Component } from '@angular/core';
import { FooterComponent } from './ui/footer.component';
import { detectBody } from './app.helpers';


import { AuthService } from './authentication/auth.service';

declare var jQuery: any;
declare var $: any;

import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	private isLogged: Boolean = false;

	constructor(private auth: AuthService, private router: Router) {
		router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
	}

	// Shows and hides the loading spinner during RouterEvent changes
navigationInterceptor(event: RouterEvent): void {
	if (event instanceof NavigationStart) {

			this.loading = true;

	}
	if (event instanceof NavigationEnd) {
		this.loading = false;
	}

	// Set loading state to false in both of the below events to hide the spinner in case a request fails
	if (event instanceof NavigationCancel) {
		this.loading = false;
	}
	if (event instanceof NavigationError) {
		this.loading = false;
	}
}

	private logueadoCache: any = false;

	// Sets initial value to true to show loading spinner on first load
 loading = true;

	public ngOnInit(): any {
		detectBody();
		this.isLogged = false;
		//this.logueado();
	}

	public onResize(){
		detectBody();
	}

	estaLogueado(){
		if(this.isLogged){
			return true;
		}else{
			this.auth.isLogged()
			.then((ret)=>{
				console.log(ret);
				this.isLogged = true;
				return ret;
			})
			.catch(err => console.log(err));
		}
		
		//console.log('localStorage');
		//console.log(localStorage);
		//console.log('estaLogueado');
		//const token = localStorage.getItem('user');
		//return token;
		//var ret = this.auth.isLogged();
		//console.log(ret);
		//return ret;
		// return this.logueadoCache;
	}

	public logueado(){
		//console.log("#################################################");
		//console.log("logueado method");

		this.auth
		.logIn()
		.then(() => {
			//console.log('TODO OK');
			//this.router.navigateByUrl('/');
			this.logueadoCache = true;
		})
		.catch(() => {
			//console.log('No logueado');
            localStorage.clear();
			this.logueadoCache = false;
		});
	}
}
