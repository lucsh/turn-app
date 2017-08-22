import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import { MedicosService } from '../../medico/medicos.service';
import { Medico } from '../../medico/medico.tipo';

import 'jquery-slimscroll';

import { AuthService } from '../../authentication/auth.service';


import { NodeService } from '../../routerService/medicos.sistema';
import { Subscription } from 'rxjs/Subscription';


declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

  profile: any;

  private medicos: Medico[] = [];
  private medico: Medico;

  private subscription: Subscription;
  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private medicosService: MedicosService,
    private authService: AuthService,
    private medicosCompartidos: NodeService
  ) {

  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }

    this.medicosService.getDoctores().then((docs)=>{
      this.subscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {

        console.log('ENTRE A LA SUBSCRIPCION');
        this.medicos = medicos;
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });
      this.medicosCompartidos.iniciar(docs);

    });

  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }

  logOut(){
    this.authService.logOut();
  }


  getUsuario(){

    // console.log(localStorage);
    // var p = localStorage.getItem('user');
    // console.log(p);
    var usuario: any = JSON.parse(localStorage.getItem('user'));
    // console.log('usuario');
    // console.log(usuario);
    ////console.log('ENTRE A GET USUARIO');
    // ////console.log(usuario);
    if(usuario!=undefined && usuario != null){

      this.profile = {};
      this.profile.nombre = usuario.nombre;
      this.profile.cargo = usuario.clase;
      this.actualizarListaMedicos();
      //Aca debeiramos preguntar el cargo para ver si es medico
      this.medico = usuario;
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
      // console.log('ENTRE ACA!!!');
      // console.log(docs);
      // yo.medicos = docs;
    });
  }

  mostrarTurnosMedicos(){
    //  return this.medicosCargados() && !this.esMedico();
    return  !this.esMedico();
  }
  medicosCargados(){

    return this.medicos.length > 0;
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
    return false;
  }

  public ngOnInit():any {


    this.getUsuario();

    // setTimeout(()=>{
    //   console.log('Se cumplio el timeout')
    //   this.getUsuario();
    // },1000)


  }

}
