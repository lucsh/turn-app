import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  template: `
  <main class="home container">
      <div class="row">
        <div class="col-12 col-8-tablet push-2-tablet text-center">
          <img class="logo center-item"
            src="http://feathersjs.com/img/feathers-logo-wide.png"
            alt="Feathers Logo">
          <h3 class="title">Chat</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-12 push-4-tablet col-4-tablet">
          <div class="row">
            <div class="col-12">
                <a routerLink="/login" class="button button-primary block login">Login</a>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <a  routerLink="/signup"  class="button button-primary block signup">
                Signup
              </a>
            </div>
          </div>
        </div>
      </div>

    </main>
  `
})
export class AuthenticationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
