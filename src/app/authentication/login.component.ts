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
      .then((token) => {
        ////console.log("####################");
        ////console.log(token);

        var gilada = this.feathers.devolverFeathers().passport.verifyJWT(token.accessToken);
        gilada.then((payload)=>{
          ////console.log("QUE MIERDA ES PAYLOAD");
          ////console.log(payload);
          var gilada2 = this.feathers.service("users").get(payload.userId);

          gilada2.then((user)=>{
            ////console.log("USUARIO:");
            ////console.log(user);
            // localStorage.setItem('user',user);
            console.log("##########################");
            console.log(JSON.stringify(user));
            localStorage.setItem('user',JSON.stringify(user));

            if(user.clase === 'medico'){
              this.router.navigate(['/medico']);
            }
            else{
              this.router.navigate(['/']);
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
    this.feathers.service('users')
      .create({email, password})
      .take(1)
      .toPromise()
      .then(() => this.messages='User created.')
      .catch(err => this.messages='Could not create user!')
    ;
  }
}
