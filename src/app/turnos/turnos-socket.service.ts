import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

declare var feathers:any;


import { Turno } from './turno.tipo';



declare var $: any;


@Injectable()
export class TurnoSocketService {

    private urlServidor = 'http://localhost:3030'

    public turnos$: Observable<Turno[]>;
    private turnosObserver: Observer<Turno[]>;

    private turnosSocketService: any;

    private dataStore: {
        turnos: Turno[]
    };

    private matricula: string;
    private socket;
    constructor() {
    }

    public iniciar(matricula : string){

        this.matricula = matricula;

        this.socket = io(this.urlServidor);
        const feathersApp = feathers().configure(feathers.socketio(this.socket));

        //Obtenemos el service que queremos
        this.turnosSocketService = feathersApp.service('turnos');

        //Registramos eventos
        this.turnosSocketService.on('created', (turno) => this.onCreated(turno));
        this.turnosSocketService.on('updated', (turno) => this.onUpdated(turno));
        this.turnosSocketService.on('removed', (turno) => this.onRemoved(turno));
        this.turnosSocketService.on('patched', (turno) => this.onPatched(turno));


        this.turnos$ = new Observable((observer) => {
                this.turnosObserver = observer;
        });

        this.dataStore = { turnos: [] };


        //BORRRRRAR
        this.find();
        //BORRRRRAR
    }

    // public setComponent(algo){
    //     console.log('@@@@@@@@@@@@@@@@@@@@@');
    //     console.log(algo);
    // }

    public GILADA(fecha: Date){

        console.log('Entre en gilada');
        //tengo que pedir el nombre del paciente y verificar que exista
        var paciente = 'Nuevo Paciente';
        //El color depende del medico al que le estoy cargando el turno
        var color = '#f8ac59';

        //creo el obj
        //el "end" deberia ser dinamico, dependiendo del medico? (doctor.turno)
        //var newTurno = {"title":paciente,"allDay":false,"start":new Date(),"end":new Date(),"color":color};

        //LEER LEER LEER LEER LEER
        var temp = moment(fecha).add(15, 'm'); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO
        //LEER LEER LEER

        let nuevaFecha = temp.format('YYYY-MM-DDTHH:mm:ss'); //Le saco a la fecha la zona horaria!


        var newTurno = {"title":"Matias Perez","allDay":false,"start":fecha,"end":nuevaFecha,"color":"#f8ac59"};

        //DSPS HAY QUE PASAR ESTO al metodo create del servicio
        this.turnosSocketService.create({

            horaInicial: newTurno.start,
            horaFin: newTurno.end,
            matricula:this.matricula

            }).then((clienteNuevo)=>{
                console.log('Desde el cliente Angular se creo un nuevo cliente');
                // IMPORTANTE:
                //      Todavia NO ACTUALIZAMOS, pues eso se va a hacer en el EVENTO 'onCreated'.

            });

        //lo pusheo al calendar
        //$('#calendar').fullCalendar('renderEvent', newTurno, true)
    }

    public temporalActualizar(turno){

      let newHoraInicial = turno.start.format();
      let newHoraFin = turno.end.format();
      let id = turno._id;
      this.turnosSocketService.patch(id, {"horaInicial":newHoraInicial,"horaFin":newHoraFin}).then((turnoActualizado)=>{
        // console.log("Se actualizo correctamente el turno");
        // console.log(turnoActualizado);
      });
    }

    public temporalEliminar(turno){

      let id = turno._id;
      this.turnosSocketService.remove(id).then((turnoEliminado)=>{
        console.log("Turno eliminado!!");
      })
    }

    public cambiarMedico(matricula){
        this.cleanService();
        console.log("CAMBIO DE MEDICO");
        this.iniciar(matricula);
    }

    public cleanService(){
        //this.turnosSocketService = null;
        //Obtenemos el service que queremos
        this.socket.disconnect();
        this.turnosSocketService = null;

        this.turnos$ = null;

        this.dataStore = { turnos: [] };
    }

    public createTurno(): any{

        this.turnosSocketService.create({

            }).then((clienteNuevo)=>{
                console.log('Desde el cliente Angular se creo un nuevo cliente');
                // IMPORTANTE:
                //      Todavia NO ACTUALIZAMOS, pues eso se va a hacer en el EVENTO 'onCreated'.

            });
    }

    public find() {
        let m = this.matricula;
        this.turnosSocketService.find({
            query: {
              matricula: m
            }
        }).then((turnos) => {
            //console.log("Entre al then del find!!!!!!!!!!!!!-.-23142189479rsdfygsd");
            // console.log('####');
            // console.log(turnos);
            // console.log('####');

            // console.log('Entre al find de socket de feathers en Angular!!');
            //
            // //IMPORTANTE:
            // // A veces es necesario hacer el .data. Es cuando, por ej, usas pagination
            // //console.log(clientes.data);
            //

            // console.log(this.turnosObserver);

            this.dataStore.turnos = turnos;

            //Aca vamos a renderizar el calendario de nuevo despues de obtener todos los turnos de ese medico.
            for (let i = 0; i < turnos.length; i++) {
                this.actualizarVisual(turnos[i]);
            }

            this.turnosObserver.next(this.dataStore.turnos);
        }).catch(err => console.error(err));
    }

    private getIndex(id: string): number {
        // let foundIndex = -1;
        //
        // for (let i = 0; i < this.dataStore.turnos.length; i++) {
        //     if (this.dataStore.turnos[i]._id === id) {
        //         foundIndex = i;
        //     }
        // }

        // return foundIndex;
        return 0;
    }

    /*
    Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
    */
    private onCreated(turno: any) { //REMPLAZR EL ANY CON TURNO!
        console.log('On created de Angular con Socket de Feathers');
        console.log(turno);

        this.dataStore.turnos.push(turno);
        //lo pusheo al calendar
        this.actualizarVisual(turno);
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
    private onRemoved(turno) {
        // const index = this.getIndex(turno._id);
        //
        // this.dataStore.turnos.splice(index, 1);
        //
        // this.turnosObserver.next(this.dataStore.turnos);
    }

    private onPatched(turno){

      let id = turno._id;

      $('#calendar').fullCalendar('removeEvents',turno._id); // Esto elimina el evento (grafico) con el id = turno._id
      this.actualizarVisual(turno); //
    }

    /*
      Este metodo se encarga de graficar nuevamente el turno que llega por parametro.
      Utilizar este metodo cuando se necesite graficar un nuevo turno.
    */

    private actualizarVisual(turno){


      let horaInicial = turno.horaInicial.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.
      let horaFin = turno.horaFin.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.

      //Le agregue el ID al final del nuevo turno para asi poder saber a que objeto corresponde cada evento grafico
      let newTurno = {"title":"SIN NOMBRE","allDay":false,"start":horaInicial,"end":horaFin,"color":"#f8ac59","_id":turno._id};
      $('#calendar').fullCalendar('renderEvent', newTurno, true)
    }
}
