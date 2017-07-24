import { Injectable } from '@angular/core';
import { RestService, SocketService, FeathersService } from './feathers.service';

@Injectable()
export class AuthService {
  private app;
  
  constructor(private rest:RestService, private socket:SocketService, private feathers:FeathersService) {
    this.app = feathers.app;
    // this.feathers.app.authenticate().then( () => {
    // }, () => {
    // })
  }

  login(email, password) {
    this.app.authenticate({
      strategy: 'jwt', 
      endpoint: '/auth/local',
      'email': email,
      'password': password
    }).then(function(result){
      console.log('Authenticated!', result);
    }).catch(function(error){
      console.error('Error authenticating!', error);
    });
  }
  
  logout() {
    this.app.logout()
  }

  isLoggedIn() {
    // const token = this.app.passport.getJWT();
    // this.app.passport.verifyJWT(token)
    // const user = this.app.get('user'); 
    // console.log("user:", user);
  }
}
