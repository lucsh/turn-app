import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

import {Paciente} from '../pacientes/paciente.tipo';
import { environment } from '../../environments/environment';
import { Feathers } from '../authentication/feathers.service'
import { PacientesCompartidosService } from '../routerService/pacientes.sistema';

import { Subscription } from 'rxjs/Subscription';

declare var feathers:any;

import {default as swal} from 'sweetalert2';

@Injectable()
export class SolicitudesSocketService implements OnDestroy  {
  private urlServidor = environment.apiUrl;

  public solicitudes$: Observable<any[]>;
  private solicitudesObserver: Observer<any[]>;

  private solicitudesSocketService: any;

  private pacientesSubscription: Subscription;
  private pacientesSistema: any[];

  private dataStore: {
    solicitudes: Paciente[]
  };

  private matricula: string;
  private socket;
  private feathersService;

  constructor(private FeathersCambiarNombre: Feathers, private pacientesCompartidos : PacientesCompartidosService,) {
    this.socket = io(this.urlServidor);
    //Estamos usando el Service de Feathers, pues el que tiene la autenticacion del login
    this.feathersService = FeathersCambiarNombre.devolverFeathers();
    //Obtenemos el service que queremos
    this.solicitudesSocketService = this.feathersService.service('pacientes');

    //Registramos eventos
    this.solicitudesSocketService.on('created', (paciente) => this.onCreated(paciente));
    this.solicitudesSocketService.on('updated', (paciente) => this.onUpdated(paciente));
    this.solicitudesSocketService.on('removed', (paciente) => this.onRemoved(paciente));
    this.solicitudesSocketService.on('patched', (paciente) => this.onPatched(paciente));

    this.solicitudes$ = new Observable((observer) => {
      this.solicitudesObserver = observer;
    });

    this.dataStore = { solicitudes: [] };
    //let token = localStorage.getItem('feathers-jwt');
    this.findSolicitudes();

  }

  ngOnDestroy(){

    this.socket.disconnect();
    this.solicitudesSocketService = null;
  }

  //---------------------------------------------------------------------------
  // Metodos del servicio

  public findSolicitudes() {
    /**
    Se tiene en cuenta que cuando el administrativo RECHAZA una solicitud,
    el paciente con estado aprobado que tenia asociado esa solicitud, es eliminado.
    */

    this.solicitudesSocketService.find({
      query: {
        aprobado: false
      }
    }).then((pacientesEnSolicitud) => {

      //******************************************************************
      /**
      IMPORTANTE:
      A veces es necesario hacer el .data. Es cuando, por ej, usas pagination
      */
      //******************************************************************

      this.dataStore.solicitudes = pacientesEnSolicitud;
      this.solicitudesObserver.next(this.dataStore.solicitudes);
    }).catch(err => console.error(err));
  }


  aprobarSolicitud(pacienteEnSolicitud){
    let indexPaciente = this.buscarSolicitud(pacienteEnSolicitud);

    if(indexPaciente > -1){
      let id = pacienteEnSolicitud._id;
      let idUsuario = pacienteEnSolicitud._idUsuario;
      this.solicitudesSocketService.patch(id,{"aprobado":true,"_idUsuario":idUsuario,"aprobando":true}).then(
        pacienteAprobado => {
          if(pacienteAprobado.aprobado){

            /*
            ACA PODREMOS MOSTRAR el numero de paciente generado, etc.
            */

            swal({
              title: 'Solicitud Aprobada!',
              text: 'Nuevo paciente registrado!',
              type: 'success',
              timer: 2000
            }).then(
              function () {},
              // handling the promise rejection
              function (dismiss) {
                if (dismiss === 'timer') {
                }
              }
            )

          }
        }
      )
    }


  }

  rechazarSolicitud(pacienteEnSolicitud){
    let indexPaciente = this.buscarSolicitud(pacienteEnSolicitud);

    if(indexPaciente > -1){
      let id = pacienteEnSolicitud._id;
      this.solicitudesSocketService.remove(id).then(
        pacienteRechazado => {
          swal({
            title: 'Solicitud Rechazada!',
            text: 'Se ha eliminado la solicitud correctamente!',
            type: 'success',
            timer: 2000
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {
              }
            }
          )
        }
      )
    }
  }

  observarPacientes(){
    /*
    Subscribimos a los pacientes, para que tengan una correspondencia
    con los pacientes del navigator
    */
    if(this.pacientesCompartidos.pacientes$){
      this.pacientesSubscription = this.pacientesCompartidos.pacientes$.subscribe((pacientes) => {

        this.pacientesSistema = pacientes;
        // this.ref.markForCheck();
      }, (err) => {
        console.log('Error en observarPacientes de tablaPacientes');
        console.error(err);
      });

      // Obtenemos los pacientes compartidos
      this.pacientesCompartidos.getPacientes();
    }
  }


  //Recepcion de eventos


  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'.
  Al crear un paciente en el server (rest o socket), se invoca este evento.
  */
  private onCreated(pacienteAprobado){
    console.log('## ENTRE EN EL ON CREATED');

    //Si el nuevo paciente NO esta aprobado => entro una nueva solicitud
    if(!pacienteAprobado.aprobado){
      this.dataStore.solicitudes.push(pacienteAprobado);
    }

    this.solicitudesObserver.next(this.dataStore.solicitudes);
  }


  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'.
  Al eliminar un paciente en el server (rest o socket), se invoca este evento.
  */
  private onRemoved(pacienteRechazado){

    //Actualizamos las variables

    //Nos aseguramos que el paciente haya sido rechazado correctamente
    if(!pacienteRechazado.aprobado){
      this.quitarSolicitud(pacienteRechazado);
    }

  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onPatched'.
  Al hacer un patch sobre un paciente existente en el server (rest o socket), se invoca este evento.
  */
  private onPatched(pacienteAprobado){

    // Nos aseguramos que el paciente haya sido aprobado correctamente
    if(pacienteAprobado.aprobado){
      let quitado = this.quitarSolicitud(pacienteAprobado);

      // Agregamos el paciente aprobado al sistema
      if(quitado){
        if(!this.pacientesCompartidos.existePaciente(pacienteAprobado)){
          this.pacientesCompartidos.addPaciente(pacienteAprobado);
        }
      }

    }

  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'.
  Al hacer un update sobre un paciente existente en el server (rest o socket), se invoca este evento.
  */
  private onUpdated(paciente){

  }


  //----------------------------------------------------------------------------
  //Metodos auxiliares

  private buscarSolicitud(pacienteEnSolicitud): number{
    let indexSolicitud = -1;

    let solicitudes = this.dataStore.solicitudes;

    solicitudes.forEach(function(elem,index){
      if(elem._id.toString() == pacienteEnSolicitud._id.toString()){

        indexSolicitud = index;
      }
    });

    return indexSolicitud;
  }

  private quitarSolicitud(pacienteQuitar): boolean{
    let borrado = false;

    let solicitudes = this.dataStore.solicitudes;

    let indexQuitar = this.buscarSolicitud(pacienteQuitar);

    if(indexQuitar > -1 && solicitudes[indexQuitar].aprobado == false){

      this.dataStore.solicitudes = solicitudes.splice(indexQuitar, 1);
      borrado = true;
    }

    return borrado;
  }



}
