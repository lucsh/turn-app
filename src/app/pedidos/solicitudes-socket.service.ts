import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

import {Paciente} from '../pacientes/paciente.tipo';

declare var feathers:any;

import {default as swal} from 'sweetalert2';

@Injectable()
export class SolicitudesSocketService implements OnDestroy  {
  private urlServidor = 'http://localhost:3030';

  public solicitudes$: Observable<Paciente[]>;
  private solicitudesObserver: Observer<Paciente[]>;

  private solicitudesSocketService: any;

  private dataStore: {
    solicitudes: Paciente[]
  };

  private matricula: string;
  private socket;
  constructor() {
    ////console.log('Entre en Iniciar del Solicitudes SOCKET SERVICE');

    this.socket = io(this.urlServidor);
    const feathersApp = feathers().configure(feathers.socketio(this.socket));

    //Obtenemos el service que queremos
    this.solicitudesSocketService = feathersApp.service('pacientes');

    //Registramos eventos
    this.solicitudesSocketService.on('created', (paciente) => this.onCreated(paciente));
    this.solicitudesSocketService.on('updated', (paciente) => this.onUpdated(paciente));
    this.solicitudesSocketService.on('removed', (paciente) => this.onRemoved(paciente));
    this.solicitudesSocketService.on('patched', (paciente) => this.onPatched(paciente));


    this.solicitudes$ = new Observable((observer) => {
      this.solicitudesObserver = observer;
    });

    this.dataStore = { solicitudes: [] };

    this.findSolicitudes();

  }

  ngOnDestroy(){

      //this.socket.close();
      // this.solicitudesSocketService = null;
      //
      //
      //
      // this.solicitudes$ = null;
      //
      // this.dataStore = { solicitudes: [] };

      this.socket.disconnect();
      //this.turnosObserver = null;
      ////console.log("SE TERMINO EL SERVICIOOOOOOOOOOOOOO");
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


      ////console.log('****************************************');
      ////console.log(pacientesEnSolicitud);

      this.solicitudesObserver.next(this.dataStore.solicitudes);
    }).catch(err => console.error(err));
  }


  aprobarSolicitud(pacienteEnSolicitud){
    ////console.log('Entre a aprobar solicutd en el Service');

    ////console.log(pacienteEnSolicitud);

    let indexPaciente = this.buscarSolicitud(pacienteEnSolicitud);

    if(indexPaciente > -1){
      let id = pacienteEnSolicitud._id;
      this.solicitudesSocketService.patch(id,{"aprobado":true}).then(
        pacienteAprobado => {
          ////console.log('Se aprobo el paciente que estaba en solicitud!!');
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
                  ////console.log('I was closed by the timer')
                }
              }
            )

          }
        }
      )
    }


  }

  rechazarSolicitud(pacienteEnSolicitud){
    ////console.log('Entre a rechazar solicutd en el Service');

      ////console.log(pacienteEnSolicitud);

      let indexPaciente = this.buscarSolicitud(pacienteEnSolicitud);

      if(indexPaciente > -1){
        let id = pacienteEnSolicitud._id;
        this.solicitudesSocketService.remove(id).then(
          pacienteRechazado => {
            ////console.log('Se elimino la solicitud del paciente!!');
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
                  ////console.log('I was closed by the timer')
                }
              }
            )
          }
        )
      }
  }


  //Recepcion de eventos


  /*
      Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'.
      Al crear un paciente en el server (rest o socket), se invoca este evento.
  */
  private onCreated(pacienteAprobado){
    ////console.log('On created de Paciente (solicitud aprobada) de Angular con Socket de Feathers');
    ////console.log(pacienteAprobado);

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
    ////console.log('On removed de Paciente (solicitud rechazada) de Angular con Socket de Feathers');
    ////console.log(pacienteRechazado);

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
    ////console.log('On patched de Paciente (solicitud aprobada) de Angular con Socket de Feathers');
    ////console.log(pacienteAprobado);

    //Nos aseguramos que el paciente haya sido aprobado correctamente
    if(pacienteAprobado.aprobado){
      this.quitarSolicitud(pacienteAprobado);
    }
    // else{
    //   ////console.log("El paciente NO fue aprobado");
    // }

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
    ////console.log(solicitudes);

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
    ////console.log(solicitudes);

    let indexQuitar = this.buscarSolicitud(pacienteQuitar);

    if(indexQuitar > -1){
      solicitudes.splice(indexQuitar, 1);

      ////console.log(solicitudes);

      borrado = true;
    }

    return borrado;
  }



}
