import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import 'jquery-slimscroll';


declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

  profile: string[];

  constructor(private router: Router, private navigationService: NavigationService) {}

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }


  getUsuario(){
    this.navigationService.getUsuario()
    .subscribe(
      data => this.profile = data,
      error => console.log('Server Error')
    );
  }

  public ngOnInit():any {
    this.getUsuario();
  }

}