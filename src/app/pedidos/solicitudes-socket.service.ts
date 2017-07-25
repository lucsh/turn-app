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
        aprobado: false,
        $populate: 'obra'
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


  aprobarSolicitud(pacienteEnSolicitud){
    console.log('Entre a aprobar solicutd');

    console.log(pacienteEnSolicitud);

    let indexPaciente = this.buscarSolicitud(pacienteEnSolicitud);

    if(indexPaciente > -1){
      let id = pacienteEnSolicitud._id;
      this.solicitudesSocketService.patch(id,{"aprobado":true}).then(
        pacienteAprobado => {
          console.log('Se aprobo el paciente que estaba en solicitud!!');
        }
      )
    }


  }

  rechazarSolicitud(){

  }


  //Recepcion de eventos

  private onCreated(pacienteAprobado){
    console.log('On created de Paciente (solicitud aprobada) de Angular con Socket de Feathers');
    console.log(pacienteAprobado);

    //Si el nuevo paciente NO esta aprobado => entro una nueva solicitud
    if(!pacienteAprobado.aprobado){
      this.dataStore.solicitudes.push(pacienteAprobado);
    }

    this.solicitudesObserver.next(this.dataStore.solicitudes);
  }

  private onRemoved(paciente){

  }

  private onPatched(pacienteAprobado){
    console.log('On patched de Paciente (solicitud aprobada) de Angular con Socket de Feathers');
    console.log(pacienteAprobado);

    if(pacienteAprobado.aprobado){
      let solicitudes = this.dataStore.solicitudes;
      console.log(solicitudes);

      let indexAprob = this.buscarSolicitud(pacienteAprobado);
      console.log("encontre el index del paciente aprobado: " + indexAprob);


      if(indexAprob > -1){
        solicitudes.splice(indexAprob, 1);

        console.log(solicitudes);
      }
    }
    else{
      console.log("El paciente NO fue aprobado");
    }

  }
  private onUpdated(paciente){

  }


  //Metodos auxiliares
  private buscarSolicitud(pacienteEnSolicitud): number{
    let indexSolicitud = -1;

    let solicitudes = this.dataStore.solicitudes;
    console.log(solicitudes);

    solicitudes.forEach(function(elem,index){
      if(elem._id.toString() == pacienteEnSolicitud._id.toString()){

        indexSolicitud = index;
      }
    });

    return indexSolicitud;
  }



}
