import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
  //styleUrls: ['./login.component.css']
})
export class RegisterComponent {



    constructor(
      private authService: AuthService,
      private router: Router
    ) {}

    public registrar(nombre, apellido, email, password){
      console.log('Entre a registrar!');
      this.authService.signup(nombre, apellido, email, password).then(nuevo =>{
        // console.log('Me llego el nuevo usuario!');
        // console.log(nuevo);

        this.irLogin();

      });
    }

    public irLogin(){
      this.router.navigate(['login']);
    }

}
