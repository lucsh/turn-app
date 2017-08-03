import { Injectable } from '@angular/core';
import { Feathers } from './feathers.service';
import { Router } from '@angular/router';


/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  constructor(private feathers: Feathers, private router: Router) {}

  public singIn(nombre, email, password){

  }

  public logIn(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials);
  }

  public logOut() {
    this.feathers.logout();
    this.router.navigate(['login']);
    console.log('logOut');
  };

  public signup(nombre, apellido, email: string, password: string): Promise<any> {
   return this.feathers.service('users')
      .create({nombre, apellido, email, password})
      .take(1)
      .toPromise()
      .then(res => {
        // console.log('Lo cree!!');
        // console.log(res);
        return res as Promise<any>;
      })
      .catch(err => console.log(err))
    ;
  }

}
