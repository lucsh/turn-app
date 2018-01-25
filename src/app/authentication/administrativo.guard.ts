import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

//TRUCO PARA QUE NO LIME
import { AppComponent } from '../app.component';


@Injectable()
export class AdministrativoGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private app: AppComponent) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

                const token = JSON.parse(localStorage.getItem('user'));
                if (token){
                  if (token.clase){
                    const clase = token.clase;
                    // console.log("la clase es... ",clase);
                    if (clase === 'medico'){
                      // console.log("Soy medico!");
                      const doctor = token.nombre;
                      const id = token._idMedico;
                      this.router.navigate(['turnos/' + doctor + '/' + id]);
                      return false;
                    }
                    // console.log("No soy medico!");
                    return true;
                  }
                }

  }
}
