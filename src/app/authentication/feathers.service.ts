import { Injectable } from '@angular/core';
const superagent = require('superagent');
const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const io = require('socket.io-client');
const localstorage = require('feathers-localstorage');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest/client');
// const authentication = require('feathers-authentication/client');
const authentication = require('feathers-authentication-client');


// Your base server URL here
//const HOST = 'https://feathersjs-aurerua.c9users.io'
const HOST = 'localhost:3030'

@Injectable()
export class RestService {
  public app: any;
  debugString="Rest is ok for now!";
  
  constructor() {
    this.app = feathers() // Initialize feathers
      .configure(rest(HOST).superagent(superagent)) // Fire up rest
      .configure(hooks()) // Configure feathers-hooks
      .configure(authentication({path:'/auth/local'}));
  }
}

@Injectable()
export class SocketService {
  public socket: any;
  public app: any;
  debugString="Socket is ok for now!";

  constructor() {
    this.socket = io(HOST);
    this.app = feathers()
      .configure(socketio(this.socket))
      .configure(hooks())
      .configure(authentication({path:'/auth/local'}));
  }
}

// This service is used to abstract the choice between Rest and SocketIO
// throughout the app. RestService and SocketService can be used whenever
// it is necessary to specialise.
@Injectable()
export class FeathersService extends SocketService {}
