import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import { MedicosService } from '../../medico/medicos.service';
import { Medico } from '../../medico/medico.tipo';

import 'jquery-slimscroll';


declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

  profile: string[];

  private medicos: Medico[];

  constructor(
      private router: Router,
      private navigationService: NavigationService,
      private medicosService: MedicosService
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

  public actualizarListaMedicos(){
    const yo = this;
    this.medicosService.getDoctores().then((docs)=>{
        yo.medicos = docs;
    });
  }

  public ngOnInit():any {

    this.getUsuario();

    this.actualizarListaMedicos();
  }

}
