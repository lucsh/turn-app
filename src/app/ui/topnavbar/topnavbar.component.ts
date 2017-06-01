import { Component } from '@angular/core';
import { smoothlyMenu } from '../../app.helpers';
import { BsDropdownModule } from 'ngx-bootstrap';
//import { BsDropdownMenu } from 'ngx-bootstrap';

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

}
