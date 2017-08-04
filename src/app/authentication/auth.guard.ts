import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

//TRUCO PARA QUE NO LIME
import { AppComponent } from '../app.component';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService,private app: AppComponent) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /* Try to auth with the server. If authed resolve to true, else resolve to false */
    return this.auth
      .logIn()
      .then(() => {
        ////console.log('TODO OK');
        this.app.logueado();
        return true;
      })
      .catch(() => {
        ////console.log('ERROR GO TO LOGIN');
        this.router.navigate(['login']);
        return false;
      });
  }
}
