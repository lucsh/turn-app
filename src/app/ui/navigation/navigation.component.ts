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

    let token = JSON.parse(localStorage.getItem('user'));

    if(token && token.clase == 'medico'){
      // Logueado como medico

      this.medicosService.buscarMedico(token._idMedico).then(medico =>{
        if(!medico.obras.length){
            let aux = Object.assign({}, medico.obras);
            medico.obras = [];
            medico.obras.push(aux);
        }

        let medicos = []; // necesitamos la lista para trabajar con medicosCompartidos
        medicos.push(medico);

        this.medicosSubscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {
          this.medicos = medicos;
          // this.ref.markForCheck();
        }, (err) => {
          console.error(err);
        });
        this.medicosCompartidos.iniciar(medicos);


      })
    }
    else{
      // Logueado como admin

      this.medicosService.getDoctores().then((docs)=>{
        this.medicosSubscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {
          this.medicos = medicos;
          // this.ref.markForCheck();
        }, (err) => {
          console.error(err);
        });
        this.medicosCompartidos.iniciar(docs);
      });
    }


  }

  obtenerSubscripcionPacientes(){
    this.pacientesService.getPacientesActivos().then((pacientes)=>{
      this.pacientesSubscription = this.pacientesCompartidos.pacientes$.subscribe((pacientes) => {
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
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });

    });
  }
  
  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }

  logOut(){
    this.authService.logOut();
  }


  getUsuario(){

    var usuario: any = JSON.parse(localStorage.getItem('user'));
    if(usuario!=undefined && usuario != null){

      this.profile = {};
      this.profile.nombre = usuario.nombre;
      this.profile.cargo = usuario.clase;
      this.actualizarListaMedicos();
      //Aca debeiramos preguntar el cargo para ver si es medico
      this.medico = usuario;
    }
  }

  public actualizarListaMedicos(){
    const yo = this;
    this.medicosService.getDoctores().then((docs)=>{
    });
  }

  mostrarTurnosMedicos(){
    return  !this.esMedico();
  }
  medicosCargados(){

    return this.medicos.length > 0;
  }

  public esMedico(){

    var usuario: any = JSON.parse(localStorage.getItem('user'));
    if(usuario!=undefined && usuario != null){

      var clase = usuario.clase;
      return clase === "medico";

    }
    return false;
  }

  public ngOnInit():any {
    this.getUsuario();
  }

}
