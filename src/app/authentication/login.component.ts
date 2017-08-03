import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Feathers } from './feathers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  //styleUrls: ['./login.component.css']
})
export class LoginComponent {
  messages: string = "";

  constructor(private feathers: Feathers, private router: Router) {}

  login(email: string, password: string) {
    if (!email || !password) {
      this.messages='Falta usuario o contraseña!';
      return;
    }

    // try to authenticate with feathers
    this.feathers.authenticate({
      strategy: 'local',
      email,
      password
    })
      // navigate to base URL on success
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.messages = 'Error en el usuario o contraseña!';
      });
  }

  public irRegistro(){
    this.router.navigate(['/registro']);
  }

  signup(email: string, password: string) {
    this.feathers.service('users')
      .create({email, password})
      .take(1)
      .toPromise()
      .then(() => this.messages='User created.')
      .catch(err => this.messages='Could not create user!')
    ;
  }
}
