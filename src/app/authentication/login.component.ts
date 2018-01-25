import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Feathers } from './feathers.service';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  //styleUrls: ['./login.component.css']
})
export class LoginComponent {
  messages = '';

  constructor(
      private feathers: Feathers,
      private router: Router,
      private authService: AuthService) {}

  public ngOnInit(): any {
      const token = localStorage.getItem('user');
      if (token){
          this.router.navigateByUrl('/');
      }
  }

  login(email: string, password: string) {
    if (!email || !password) {
      this.messages = 'Falta usuario o contraseña!';
      return;
    }
    //localStorage.clear();

    email = email.toLowerCase();
    //FIX CAMBIO EL username por el email
    const username = email;
    // try to authenticate with feathers
    this.feathers.authenticate({
      strategy: 'local',
      username,
      password
    })
      // navigate to base URL on success
      .then((token) => {
        // console.log("#################### TOKEN");
        // console.log(token);

        const gilada = this.feathers.devolverFeathers().passport.verifyJWT(token.accessToken);
        gilada.then((payload) => {
          const gilada2 = this.feathers.service('users').get(payload.userId);

          gilada2.then((user) => {
            ////console.log("USUARIO:");
            // console.log(user);
            // localStorage.setItem('user',user);
            if (user.clase === 'medico'){
              localStorage.setItem('user', JSON.stringify(user));
              this.router.navigate(['/medico']);
            }
            else{
              if (user.clase === 'administrativo'){
                localStorage.setItem('user', JSON.stringify(user));
                this.router.navigate(['/']);
              }else{
                //console.log('LA CLASE');
                //console.log(user.clase );
                //localStorage.removeItem('feathers-jwt');
                localStorage.clear();
                this.messages = 'Error en el usuario o contraseña!';
                this.authService.logOut();
                // throw new Error("No existe esa cuenta en el sistema!");
              }

            }
          });
        });

      }).catch(err => {
        this.messages = 'Error en el usuario o contraseña!';
      });
  }

  public irRegistro(){
    this.router.navigate(['/registro']);
  }

  signup(email: string, password: string) {
    email = email.toLowerCase();
    this.feathers.service('users')
      .create({email, password})
      .take(1)
      .toPromise()
      .then(() => this.messages = 'User created.')
      .catch(err => this.messages = 'Could not create user!')
    ;
  }
}
