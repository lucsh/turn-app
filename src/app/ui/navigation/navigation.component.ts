import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import { MedicosService } from '../../medico/medicos.service';
import { Medico } from '../../medico/medico.tipo';

import 'jquery-slimscroll';

import { AuthService } from '../../authentication/auth.service'


declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

  profile: any;

  private medicos: Medico[];

  constructor(
      private router: Router,
      private navigationService: NavigationService,
      private medicosService: MedicosService,
      private authService: AuthService
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

  logOut(){
    this.authService.logOut();
  }


  getUsuario(){

    var usuario: any = JSON.parse(localStorage.getItem('user'));

    ////console.log('ENTRE A GET USUARIO');
    // ////console.log(usuario);
    if(usuario!=undefined && usuario != null){

      this.profile = {};
      this.profile.nombre = usuario.nombre;
      this.profile.cargo = usuario.clase;
    }

    // this.navigationService.getUsuario()
    // .subscribe(
    //   data => this.profile = data,
    //   error => ////console.log('Server Error')
    // );
  }

  public actualizarListaMedicos(){
    const yo = this;
    this.medicosService.getDoctores().then((docs)=>{
        yo.medicos = docs;
    });
  }

  public esMedico(){

    var usuario: any = JSON.parse(localStorage.getItem('user'));
    // ////console.log(usuario);
    if(usuario!=undefined && usuario != null){

      //this.getUsuario();
      var clase = usuario.clase;
      // ////console.log("CLASEEEEEEEEEEE");
      // ////console.log(usuario.toString());
      return clase === "medico";

    }


    return true ;
  }

  public ngOnInit():any {

    this.getUsuario();

    this.actualizarListaMedicos();


  }

}
