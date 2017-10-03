import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

import { PacientesService } from '../../pacientes/pacientes.service';
import { ObrasService } from '../../obras/obras.service';
import { MedicosService } from '../../medico/medicos.service';
import { Medico } from '../../medico/medico.tipo';

import 'jquery-slimscroll';

import { AuthService } from '../../authentication/auth.service';


import { MedicosCompartidosService } from '../../routerService/medicos.sistema';
import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { ObrasCompartidasService } from '../../routerService/obras.sistema';

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

  private medicosSubscription: Subscription;
  private obrasSubscription: Subscription;
  private pacientesSubscription: Subscription;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private medicosService: MedicosService,
    private obrasService: ObrasService,
    private pacientesService: PacientesService,
    private authService: AuthService,
    private medicosCompartidos: MedicosCompartidosService,
    private obrasCompartidas: ObrasCompartidasService,
    private pacientesCompartidos: PacientesCompartidosService
  ) {

  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }

    this.obtenerSubscripcionMedicos();
    this.obtenerSubscripcionObras();
    this.obtenerSubscripcionPacientes();

  }

  obtenerSubscripcionMedicos(){
    this.medicosService.getDoctores().then((docs)=>{
      this.medicosSubscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {

        // console.log('ENTRE A LA SUBSCRIPCION de medicos');
        this.medicos = medicos;
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });
      this.medicosCompartidos.iniciar(docs);
    });
  }

  obtenerSubscripcionPacientes(){
    this.pacientesService.getPacientesActivos().then((pacientes)=>{
      this.pacientesSubscription = this.pacientesCompartidos.pacientes$.subscribe((pacientes) => {
        // console.log(pacientes);
        // console.log('ENTRE A LA SUBSCRIPCION de pacientes');
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });
      this.pacientesCompartidos.iniciarPacientes(pacientes);
    });
  }

  obtenerSubscripcionObras(){
    this.obrasService.getObras().then((obras)=>{
      this.obrasSubscription = this.obrasCompartidas.obras$.subscribe((obras) => {
        // console.log(obras);
        // console.log('ENTRE A LA SUBSCRIPCION de obras');
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });

      let obrasSinParticular = this.removerObraParticularVista(obras);

      this.obrasCompartidas.iniciarObras(obrasSinParticular);
    });
  }

  /*
    Quitamos la obra 'Particular' de la lista de obras elegibles por los administrativos / medicos.
  */
  private removerObraParticularVista(obras){

    let obrasSinParticular = [];
    let indexParticular = -1;

    obras.forEach(function(elem, index){
      if(elem.nombre == 'Particular'){
        console.log('Lo encontre!!!');
        indexParticular = index;
      }
    });

    obrasSinParticular = obras;

    // Removemos la obra 'Particular'
    if(indexParticular > -1){
      obrasSinParticular.splice(indexParticular, 1);
    }

    return obrasSinParticular;

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
