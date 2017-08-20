import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

declare var feathers:any;


import { Turno } from '../turnos/turno.tipo';
import {VariablesGlobales} from '../variablesGlobales';
import { Feathers } from '../authentication/feathers.service'

declare var $: any;


@Injectable()
export class TurnosDelMedicoService {

    private urlServidor = VariablesGlobales.BASE_API_URL;

    public turnos$: Observable<Turno[]>;
    private turnosObserver: Observer<Turno[]>;

    private turnosService: any;

    private dataStore: {
        turnos: Turno[]
    };

    private notificaciones:any;


    //private matricula: string;
    private feathersService;
    private socket;

    private miMatricula: String;
    constructor(private FeathersCambiarNombre: Feathers) {
      //this.socket = io(this.urlServidor);
      //const feathersApp = feathers().configure(feathers.socketio(this.socket));

      //Obtenemos el service que queremos
      this.feathersService = FeathersCambiarNombre.devolverFeathers();
      this.turnosService = this.feathersService.service('turnos');


      //Registramos eventos
      this.turnosService.on('created', (turno) => this.onCreated(turno));
      this.turnosService.on('updated', (turno) => this.onUpdated(turno));
      this.turnosService.on('removed', (turno) => this.onRemoved(turno));
      this.turnosService.on('patched', (turno) => this.onPatched(turno));


      this.turnos$ = new Observable((observer) => {
          this.turnosObserver = observer;
      });

      this.dataStore = { turnos: [] };
    }



    public buscarTurnos(miMatricula: String, idMedico) {
        //let m = this.matricula;
        // console.log('ENTRE EN BUSCAR TURNOS');
        this.miMatricula = miMatricula;

        // console.log(idMedico);
        let fechaHoy = new Date();
        // let temp = moment(fechaHoy).subtract(1,'days').format('YYYY-MM-DD');
        let temp = moment(fechaHoy).format('YYYY-MM-DD');
        let temp2 = moment(temp, "YYYY-MM-DD").add(1, 'days');
        let temp3 = (moment(temp2).format('YYYY-MM-DD'));

        // console.log(temp);
        // console.log(temp2);
        // console.log(temp3);

        this.turnosService.find({
            query: {
                horaInicial: {
                  $gt: temp,
                  $lt: temp3
                },
                medico: idMedico,
                $populate: 'paciente medico' //'paciente medico'
            }
        }).then((turnos) => {

          // ////console.log("ENTRE AL BUSCAR TURNOS DEL PACIENTES DEL DIA");
          // ////console.log(turnos);

          ////console.log('ENTRE A PEDIR TURNOS');
          ////console.log(turnos);

          this.dataStore.turnos = turnos;
          this.turnosObserver.next(this.dataStore.turnos);
        }).catch(err => console.error(err));
    }


    public updateTurno(turno, nuevoEstado){
      var now = new Date();
      // console.log("################");
      // console.log(now);

      var nueva = moment(now).utc();
      // console.log(nueva);
      // var momentDate = moment(now).utc();
      // console.log("HORA...");
      // console.log(momentDate);
      this.turnosService.patch(turno._id,{"estado": nuevoEstado, "horaUltimoCambio": nueva }).then((turnoActualizado) => {
        // console.log("Turno actualizado correctamente");
        // console.log(turnoActualizado);
      }).catch(err => console.error(err));
    }

    private getIndex(id: string): number {
        let foundIndex = -1;

        for (let i = 0; i < this.dataStore.turnos.length; i++) {
            if (this.dataStore.turnos[i]._id === id) {
                foundIndex = i;
            }
        }

        return foundIndex;
        // return 0;
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
    */
    private onCreated(turno: any) { //REMPLAZR EL ANY CON TURNO!
        ////console.log('On created de Angular con Socket de Feathers');
        ////console.log(turno);

        if(this.miMatricula === turno.medico.matricula){
          this.dataStore.turnos.push(turno);
          //lo pusheo al calendar
          this.turnosObserver.next(this.dataStore.turnos);
        }

    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */
    private onUpdated(turno: Turno) {
        const index = this.getIndex(turno._id);

        if(index != -1){
          this.dataStore.turnos[index] = turno;

          this.turnosObserver.next(this.dataStore.turnos);
        }

    }



    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
    */
    private onRemoved(turno: Turno) {
        const index = this.getIndex(turno._id);

        if(index != -1){
          this.dataStore.turnos.splice(index, 1);

          this.turnosObserver.next(this.dataStore.turnos);
        }

    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */

    private onPatched(turno){

      let indexTurno = this.buscarIndexTurno(turno);

      if(indexTurno != -1){

        let turnoAnterior:any = this.dataStore.turnos[indexTurno];

        //El medico esta llamando un nuevo paciente
        if(turnoAnterior.estado !='en espera' && turno.estado == 'en espera'){
          // console.log('Estaba pendiente y ahora el paciente llego al consultorio.');
          this.notificarPacienteEspera(turno.paciente);
        }
        this.dataStore.turnos[indexTurno] = turno;
      }



    }



    /*
        Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
    */
    ngOnDestroy(){

        //this.socket.close();
        //this.socket.disconnect();
        //this.turnosObserver = null;
        // ////console.log("SE TERMINO EL SERVICIOOOOOOOOOOOOOO");
    }


    public asignarNotificaciones(notificaciones){
      this.notificaciones = notificaciones;
    }


    notificarPacienteEspera(paciente) {
      this.notificaciones.info(
        'El paciente ' + paciente.nombre + ' se encuentra en sala de espera'
      )
    }

    //Metodos auxiliares
  private buscarIndexTurno(turno): number{
    let indexTurno = -1;

    let turnos = this.dataStore.turnos;
    // ////console.log(turnos);

    turnos.forEach(function(elem,index){
      if(elem._id.toString() == turno._id.toString()){

        indexTurno = index;
      }
    });

    return indexTurno;
  }
}
