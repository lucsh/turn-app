import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

declare var feathers:any;


import { Turno } from '../turnos/turno.tipo';

declare var $: any;


@Injectable()
export class PacientesDelDiaService {

    private urlServidor = 'http://localhost:3030'

    public turnos$: Observable<Turno[]>;
    private turnosObserver: Observer<Turno[]>;

    private pacientesDelDiaService: any;

    private dataStore: {
        turnos: Turno[]
    };

    //private matricula: string;
    private socket;
    constructor() {
      this.socket = io(this.urlServidor);
      const feathersApp = feathers().configure(feathers.socketio(this.socket));

      //Obtenemos el service que queremos
      this.pacientesDelDiaService = feathersApp.service('turnos');


      //Registramos eventos
      this.pacientesDelDiaService.on('created', (turno) => this.onCreated(turno));
      this.pacientesDelDiaService.on('updated', (turno) => this.onUpdated(turno));
      this.pacientesDelDiaService.on('removed', (turno) => this.onRemoved(turno));
      this.pacientesDelDiaService.on('patched', (turno) => this.onPatched(turno));


      this.turnos$ = new Observable((observer) => {
          this.turnosObserver = observer;
      });

      this.dataStore = { turnos: [] };
    }



    public buscarTurnos() {
        //let m = this.matricula;
        let fechaHoy = new Date();
        let temp = moment(fechaHoy).format('YYYY-MM-DD');
        // console.log("########################### FECHAS ####################");
        // console.log(temp);
        let temp2 = moment(temp, "YYYY-MM-DD").add(1, 'days');
        let temp3 = (moment(temp2).format('YYYY-MM-DD'));
        this.pacientesDelDiaService.find({
            query: {
                horaInicial: {
                  $gt: temp,
                  $lt: temp3
                }
                , $populate: 'paciente medico' //'paciente medico'
            }
        }).then((turnos) => {

          // console.log("ENTRE AL BUSCAR TURNOS DEL PACIENTES DEL DIA");
          // console.log(turnos);

          console.log('ENTRE ACA');
          console.log(turnos);

          this.dataStore.turnos = turnos;
          this.turnosObserver.next(this.dataStore.turnos);
        }).catch(err => console.error(err));
    }



    public updateTurno(turno, nuevoEstado){
      this.pacientesDelDiaService.patch(turno._id,{"estado": nuevoEstado}).then((turnoActualizado) => {
        console.log("Turno actualizado correctamente");
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
        console.log('On created de Angular con Socket de Feathers');
        console.log(turno);

        this.dataStore.turnos.push(turno);
        //lo pusheo al calendar
        this.turnosObserver.next(this.dataStore.turnos);
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */
    private onUpdated(turno: Turno) {
        // const index = this.getIndex(turno._id);
        //
        // this.dataStore.turnos[index] = turno;
        //
        // this.turnosObserver.next(this.dataStore.turnos);
    }



    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
    */
    private onRemoved(turno: Turno) {
        const index = this.getIndex(turno._id);

        this.dataStore.turnos.splice(index, 1);

        this.turnosObserver.next(this.dataStore.turnos);
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */

    private onPatched(turno){

      let indexTurno = this.buscarIndexTurno(turno);

      this.dataStore.turnos[indexTurno] = turno;


    }




    /*
        Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
    */
    ngOnDestroy(){

        //this.socket.close();
        this.socket.disconnect();
        //this.turnosObserver = null;
        // console.log("SE TERMINO EL SERVICIOOOOOOOOOOOOOO");
    }





    //Metodos auxiliares
  private buscarIndexTurno(turno): number{
    let indexTurno = -1;

    let turnos = this.dataStore.turnos;
    // console.log(turnos);

    turnos.forEach(function(elem,index){
      if(elem._id.toString() == turno._id.toString()){

        indexTurno = index;
      }
    });

    return indexTurno;
  }
}
