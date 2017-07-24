import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
  <main class="login container">
      <div class="row">
        <div class="col-12 col-6-tablet push-3-tablet text-center">
          <h1 class="font-100">Welcome Back</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form class="form" method="post" action="/auth/local">
            <fieldset>
              <input #email class="block" type="email" name="email" placeholder="email">
            </fieldset>

            <fieldset>
              <input #password class="block" type="password" name="password" placeholder="password">
            </fieldset>

            <button (click)="login(email.value,password.value)" class="button button-primary block login">
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  `
})
export class LoginComponent implements OnInit {
  
  login(email:string, password:string){
    this.authService.login(email,password);
    // this.user.isLoggedIn();
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {}

}
