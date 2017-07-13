import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import { DoctoresService } from '../../turnos/doctores.service';
import { Doctor } from '../../turnos/doctor.tipo';

import 'jquery-slimscroll';


declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

  profile: string[];

  private doctores: Doctor[];

  constructor(
      private router: Router,
      private navigationService: NavigationService,
      private doctoresService: DoctoresService
  ) {}

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

    const yo = this;
    this.doctoresService.getDoctores().then((docs)=>{
        yo.doctores = docs;
    });
  }

}
