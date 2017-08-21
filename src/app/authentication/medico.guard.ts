import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

//TRUCO PARA QUE NO LIME
import { AppComponent } from '../app.component';


@Injectable()
export class MedicoGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService,private app: AppComponent) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

                let token = JSON.parse(localStorage.getItem('user'));
                let clase = token.clase;
                console.log("la clase es... ",clase);
                if(clase === 'administrativo'){
                  console.log('Soy administrativo');
                  this.router.navigate(['']);
                  return false;
                }

                console.log("No soy administrativo");
                return true;
  }
}
