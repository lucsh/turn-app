import { Injectable } from '@angular/core';
import { Feathers } from './feathers.service';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {
  public isLoggedIn: Boolean = false;
  public isLoggedInCheck: Boolean = false;

  constructor(private feathers: Feathers, private router: Router) {}

  public singIn(nombre, email, password){

  }

  public logIn(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials)
    .then((ret) => {
      //console.log('asd');
      //console.log(ret);
      this.isLoggedIn = true;
    })
    .catch((err) => {
      //console.log('err');
      //console.log(err);
      throw new Error(err);
    });
  }

  public isLogged(){
    return this.isLoggedIn;
    /*if(this.isLoggedInCheck == true){

      return this.isLoggedIn;
    }else{
      console.log('voy a chequear');
      return this.feathers.isLoggedIn()
      .then((ret)=>{
        console.log('then auth');
        this.isLoggedInCheck = true;
        this.isLoggedIn = true;
        return true;
      })
      .catch((err) => {
        console.log('catch auth');
        this.isLoggedInCheck = true;
        this.isLoggedIn = false;
        return false;
      });
    }*/
  }
  public logOut() {
    this.feathers.logout();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    ////console.log('logOut');
  };

  public signup(nombre, apellido, email: string, password: string): Promise<any> {
   return this.feathers.service('users')
      .create({nombre, apellido, email, password})
      .take(1)
      .toPromise()
      .then(res => {
        // ////console.log('Lo cree!!');
        // ////console.log(res);
        return res as Promise<any>;
      })
      .catch(err =>  console.log(err))
    ;
  }


  public jwt(): RequestOptions {

    const currentUsuario = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('feathers-jwt');

    if (currentUsuario && token) {
      const headers2 = new Headers({ 'Authorization': token });
      return new RequestOptions({ headers: headers2 });
    }
  }

  public jwtContentType(){
		const jwt = this.jwt();
		jwt.headers.append('Content-Type', 'application/json');
    return jwt;
	}

  public autenticarSocket(): Promise<any>{
    return this.feathers.autenticarSocket();
  }



}
