import { Component } from '@angular/core';
import { smoothlyMenu } from '../../app.helpers';

import { AuthService } from '../../authentication/auth.service';

declare var jQuery:any; 

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopnavbarComponent {

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }
  constructor(private authService: AuthService) { }

  logout(){
    this.authService.logOut();
    ////console.log('logout');
     //.authService.isLoggedIn();
  }

}
