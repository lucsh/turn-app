import { Injectable } from '@angular/core';

import * as feathers from 'feathers/client';
import * as feathersRx from 'feathers-reactive';
import * as io from 'socket.io-client';
import * as hooks from 'feathers-hooks';
import * as socketio from 'feathers-socketio/client';
import * as authentication from 'feathers-authentication-client';
import { environment } from '../../environments/environment';

// TS Lint will complain here. Unfortunately feathers-reactive needs the entire Rx object passed on creation.
import * as Rx from 'rxjs';

/**
 * Simple wrapper for feathers
 */
@Injectable()
export class Feathers {
  // There are no proper typings available for feathers, due to its plugin-heavy nature
  private _feathers: any;
  private _socket: any;

  constructor() {
    this._socket = io(environment.apiUrl);       // init socket.io

    this._feathers = feathers();                      // init Feathers
    this._feathers.configure(hooks());                // add hooks plugin
    this._feathers.configure(feathersRx(Rx));         // add feathers-reactive plugin
    this._feathers.configure(socketio(this._socket)); // add socket.io plugin
    this._feathers.configure(authentication({         // add authentication plugin
      storage: window.localStorage
    }));
  }

  // expose services
  public service(name: string) {
    return this._feathers.service(name);
  }

  public devolverFeathers() {
    return this._feathers;
  }

  // expose authentication
  public authenticate(credentials?): Promise<any> {
    return this._feathers.authenticate(credentials);
  }

  // expose logout
  public logout() {
    return this._feathers.logout();
  }
  public autenticarSocket(): Promise<any> {

    // console.log("ENTRE AL AUTHENTICAR");


    const token = localStorage.getItem('feathers-jwt');
    // console.log(token);
    // this._feathers.authenticate({
    //   strategy: "jwt",
    //   accessToken: token
    // }).then(respuesta => {
    //   console.log("LA RESPUESTA DESDE EL SERVER AUTH ES");
    //   console.log(respuesta);
    // }).catch(function(error){
    //   console.error('Error authenticating!', error);
    // });


    return this._feathers.authenticate({
      strategy: 'jwt',
      accessToken: token
    });
  }

}
