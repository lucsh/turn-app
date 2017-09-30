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


    email = email.toLowerCase();

    // try to authenticate with feathers
    this.feathers.authenticate({
      strategy: 'local',
      email,
      password
    })
      // navigate to base URL on success
      .then((token) => {
        // console.log("#################### TOKEN");
        // console.log(token);

        let gilada = this.feathers.devolverFeathers().passport.verifyJWT(token.accessToken);
        gilada.then((payload)=>{
          let gilada2 = this.feathers.service("users").get(payload.userId);

          gilada2.then((user)=>{
            ////console.log("USUARIO:");
            // console.log(user);
            // localStorage.setItem('user',user);
            if(user.clase === 'medico'){
              localStorage.setItem('user',JSON.stringify(user));
              this.router.navigate(['/medico']);
            }
            else{
              if(user.clase === 'administrativo'){
                localStorage.setItem('user',JSON.stringify(user));
                this.router.navigate(['/']);
              }else{
                // console.log('LA CLASE');
                // console.log(user.clase );
                localStorage.removeItem('feathers-jwt');
                this.messages = 'Error en el usuario o contraseña!';
                // throw new Error("No existe esa cuenta en el sistema!");
              }

            }
          })
        })

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
      .then(() => this.messages='User created.')
      .catch(err => this.messages='Could not create user!')
    ;
  }
}
