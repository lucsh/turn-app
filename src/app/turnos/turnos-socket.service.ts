import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';


declare var feathers:any;
declare var feathersClient:any;



import { Turno } from './turno.tipo';

import { PacientesService } from '../pacientes/pacientes.service';
import {VariablesGlobales} from '../variablesGlobales';


import { AuthService } from "../authentication/auth.service";

declare var $: any;

import * as feathersRx from 'feathers-reactive';

import * as hooks from 'feathers-hooks';
import * as Rx from 'rxjs';
import * as authentication from 'feathers-authentication-client';
import { Feathers } from '../authentication/feathers.service'


@Injectable()
export class TurnoSocketService {

    private urlServidor = VariablesGlobales.BASE_API_URL;

    public turnos$: Observable<Turno[]>;
    private turnosObserver: Observer<Turno[]>;

    private turnosSocketService: any;

    private dataStore: {
        turnos: Turno[]
    };

    private idDoctor: string;
    private socket;

    private feathersApp;
    constructor(private authService: AuthService) {

    }

    //-------------------------------------------------------------------------
    // Metodos particulares

    public iniciar(id : string){

        ////console.log('Entre en Iniciar del TURNO SOCKET SERVICE');

        this.idDoctor = id;

        this.socket = io(this.urlServidor);

        this.feathersApp = feathers().configure(feathers.socketio(this.socket));
        this.feathersApp.configure(hooks());
        this.feathersApp.configure(feathersRx(Rx));

        this.feathersApp.configure(authentication({         // add authentication plugin
          storage: window.localStorage
        }));

        //Obtenemos el service que queremos
        this.turnosSocketService = this.feathersApp.service('turnos');

        //Registramos eventos
        this.turnosSocketService.on('created', (turno) => this.onCreated(turno));
        this.turnosSocketService.on('updated', (turno) => this.onUpdated(turno));
        this.turnosSocketService.on('removed', (turno) => this.onRemoved(turno));
        this.turnosSocketService.on('patched', (turno) => this.onPatched(turno));


        this.turnos$ = new Observable((observer) => {
            this.turnosObserver = observer;
        });
        console.log("ANTES DE CARGAR");
        this.dataStore = { turnos: [] };
        var thisLocal = this;

        thisLocal.autenticar().then((param)=>{
          // console.log("PARAMS");
          // console.log(param);
          thisLocal.find();


        });

        //Quizas este no iria aca
        return true;

    }


    /*
      Metodo para autenticar ESTE socket
    */
    private autenticar(): Promise<any>{

        // console.log("ENTRE AL AUTHENTICAR");
        let token = localStorage.getItem('feathers-jwt');

        return this.feathersApp.authenticate({
          strategy: "jwt",
          accessToken: token
        });
    }

    public obtenerTurno(id){

    }

    public cambiarMedico(id){
        this.cleanService();
        // ////console.log("CAMBIO DE MEDICO");
        this.iniciar(id);
    }

    public cleanService(){
        //this.turnosSocketService = null;
        //Obtenemos el service que queremos
        ////console.log("ENTRE AL CLEAN SERVICE");
        this.socket.disconnect();
        this.turnosSocketService = null;



        this.turnos$ = null;

        this.dataStore = { turnos: [] };
    }

    /*
        Grafica el turno que llega por parametro.
    */

    private actualizarVisual(turno:Turno){

        //let horaInicial = turno.horaInicial.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.
        let horaInicial = turno.horaInicial
        //let horaFin = turno.horaFin.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.
        let horaFin = turno.horaFin;
        //Le agregue el ID al final del nuevo turno para asi poder saber a que objeto corresponde cada evento grafico

        let newTurno = {"title":turno.paciente.nombre+' '+turno.paciente.apellido,"allDay":false,"start":horaInicial,"end":horaFin,"color":"#f8ac59","_id":turno._id, "id":turno._id};


        $('#calendar').fullCalendar('renderEvent', newTurno, true)
    }


    //-------------------------------------------------------------------------
    // Metodos principales

    public crearTurno(fecha: Date, pacienteAsignado){

        let paciente = pacienteAsignado;

        //El color depende del medico al que le estoy cargando el turno
        var color = '#f8ac59';


        //*************************************************

        /**
        IMPORTANTE: Momentaneamente, al usar en windows, comentar la linea de Linux y descomentar la de Windows.
        Para usar en Linux, hacer la vicebersa.
        */
        //*************************************************

        //Windows: descomentar la linea de abajo
         var temp = moment(fecha).utc().add(15, 'm'); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO

        //LINUX: descomentar la linea de abajo
        // var temp = moment(fecha,'YYYY-MM-DDTHH:mm:ss Z').add(15, 'm'); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO


        //*************************************************


        //let nuevaFecha = temp.utc().format('YYYY-MM-DDTHH:mm:ss'); //Le saco a la fecha la zona horaria!
        let nuevaFecha = temp.format('YYYY-MM-DDTHH:mm:ss'); //Le saco a la fecha la zona horaria!



        let nuevoTurno = {
          horaInicial: fecha,
          horaFin: nuevaFecha,
          medico:this.idDoctor,
          estado:'pendiente',
          paciente: paciente._id
        }

        this.turnosSocketService.create(nuevoTurno).then((turnoNuevo)=>{
          ////console.log('turnoNuevo');
          ////console.log(turnoNuevo);
          //******************************************************************
          /**
          IMPORTANTE:
          Todavia NO ACTUALIZAMOS, pues eso se va a hacer en el EVENTO 'onCreated'.
          */
          //******************************************************************
        });
    }

    public actualizarTurno(turno){

        let newHoraInicial = turno.start.format();
        let newHoraFin = turno.end.format();
        let id = turno._id;
        this.turnosSocketService.patch(id, {"horaInicial":newHoraInicial,"horaFin":newHoraFin}).then((turnoActualizado)=>{
        });
    }
    public actualizarTurno2(start, end, idTurno){

        let newHoraInicial = start.format();
        let newHoraFin = end.format();
        let id = idTurno;
        this.turnosSocketService.patch(id, {"horaInicial":newHoraInicial,"horaFin":newHoraFin}).then((turnoActualizado)=>{
        });
    }

    public eliminarTurno(idTurno){
        console.log("Entre al eliminar Turno con el id de : ", idTurno);
        let id = idTurno;
        this.turnosSocketService.remove(idTurno).then((turnoEliminado)=>{
            console.log("Turno eliminado!!");
        });
        console.log("despues del eliminar");
    }


    public find() {

        let idMedico = this.idDoctor.toString();
        // ////console.log(idMedico);
        this.turnosSocketService.find({
            query: {
                //matricula: m
                medico: idMedico
            }
        }).then((turnos) => {

            //******************************************************************
            /**
            IMPORTANTE:
            A veces es necesario hacer el .data. Es cuando, por ej, usas pagination
            */
            //******************************************************************
            // ////console.log("#### FIND ###");
            // ////console.log(turnos);
            this.dataStore.turnos = turnos;

            //Aca vamos a renderizar el calendario de nuevo despues de obtener todos los turnos de ese medico.
            for (let i = 0; i < turnos.length; i++) {
                this.actualizarVisual(turnos[i]);
            }

            this.turnosObserver.next(this.dataStore.turnos);
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


    //-------------------------------------------------------------------------
    // Metodos de recepcion de eventos de sockets

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
    */
    private onCreated(turno: any) { //REMPLAZR EL ANY CON TURNO!
        // ////console.log('On created de Angular con Socket de Feathers');
        // ////console.log(turno);

        this.dataStore.turnos.push(turno);
        //lo pusheo al calendar
        this.actualizarVisual(turno);
        this.turnosObserver.next(this.dataStore.turnos);
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */
    private onUpdated(turno: Turno) {
        const index = this.getIndex(turno._id);

        this.dataStore.turnos[index] = turno;

        this.turnosObserver.next(this.dataStore.turnos);
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
    */
    private onRemoved(turno: Turno) {
        const index = this.getIndex(turno._id);

        let eventosCalendario = $('#calendar').fullCalendar('clientEvents');

        this.dataStore.turnos.splice(index, 1);
        this.turnosObserver.next(this.dataStore.turnos);
        $('#calendar').fullCalendar('removeEvents',eventosCalendario[index].id); // Esto elimina el evento (grafico) con el id = turno._id
    }

    /*
        Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */

    private onPatched(turno){

        let id = turno._id;

        $('#calendar').fullCalendar('removeEvents',turno._id); // Esto elimina el evento (grafico) con el id = turno._id
        // this.actualizarVisual(turno); //
    }


    /*
        Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
    */
    ngOnDestroy(){

        //this.socket.close();
        this.socket.disconnect();
        //this.turnosObserver = null;
        ////console.log("SE TERMINO EL SERVICIOOOOOOOOOOOOOO");
    }
}
