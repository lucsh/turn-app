import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

import {Paciente} from '../pacientes/paciente.tipo';

declare var feathers:any;

@Injectable()
export class SolicitudesSocketService {
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
    console.log('Entre en Iniciar del Solicitudes SOCKET SERVICE');

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

  // public find() {
  //     let m = this.matricula;
  //     this.solicitudesSocketService.find({
  //     }).then((turnos) => {
  //     }).catch(err => console.error(err));
  // }

  public findSolicitudes() {
      this.solicitudesSocketService.find({

        /**
          Se tiene en cuenta que cuando el administrativo RECHAZA una solicitud,
          el paciente con estado aprobado que tenia asociado esa solicitud, es eliminado.
        */
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


          console.log('****************************************');
          console.log(pacientesEnSolicitud);

          this.solicitudesObserver.next(this.dataStore.solicitudes);
      }).catch(err => console.error(err));
  }

  private onCreated(paciente){

  }

  private onRemoved(paciente){

  }

  private onPatched(paciente){

  }
  private onUpdated(paciente){

  }

}
