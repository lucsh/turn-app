import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
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

    constructor() {
    }

    public iniciar(matricula : string){

        this.matricula = matricula;

        const socket = io(this.urlServidor);
        const feathersApp = feathers().configure(feathers.socketio(socket));

        //Obtenemos el service que queremos
        this.turnosSocketService = feathersApp.service('turnos');

        //Registramos eventos
        this.turnosSocketService.on('created', (turno) => this.onCreated(turno));
        this.turnosSocketService.on('updated', (turno) => this.onUpdated(turno));
        this.turnosSocketService.on('removed', (turno) => this.onRemoved(turno));


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

    public GILADA(){

        console.log('Entre en gilada');
        //tengo que pedir el nombre del paciente y verificar que exista
        var paciente = 'Nuevo Paciente';
        //El color depende del medico al que le estoy cargando el turno
        var color = '#f8ac59';

        //creo el obj
        //el "end" deberia ser dinamico, dependiendo del medico? (doctor.turno)
        //var newTurno = {"title":paciente,"allDay":false,"start":new Date(),"end":new Date(),"color":color};

        var newTurno = {"title":"Matias Perez","allDay":false,"start":"2017-07-12T12:00:00","end":"2017-07-12T12:30:00","color":"#f8ac59"};

        //DSPS HAY QUE PASAR ESTO al metodo create del servicio

        this.turnosSocketService.create({
            horaInicial: newTurno.start,
            horaFin: newTurno.end,
            matricula:'75233'

            }).then((clienteNuevo)=>{
                console.log('Desde el cliente Angular se creo un nuevo cliente');
                // IMPORTANTE:
                //      Todavia NO ACTUALIZAMOS, pues eso se va a hacer en el EVENTO 'onCreated'.

            });

        //lo pusheo al calendar
        $('#calendar').fullCalendar('renderEvent', newTurno, true)
    }

    public cambiarMedico(matricula){
        this.cleanService();
        this.iniciar(matricula);
    }

    public cleanService(){
        //this.turnosSocketService = null;
        //Obtenemos el service que queremos
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

            console.log('####');
            console.log(turnos);
            console.log('####');

            // console.log('Entre al find de socket de feathers en Angular!!');
            //
            // //IMPORTANTE:
            // // A veces es necesario hacer el .data. Es cuando, por ej, usas pagination
            // //console.log(clientes.data);
            //

            console.log(this.turnosObserver);

            this.dataStore.turnos = turnos;
            this.turnosObserver.next(this.dataStore.turnos);
        }).catch(err => console.error(err));
    }

    private getIndex(id: string): number {
        // let foundIndex = -1;
        //
        // for (let i = 0; i < this.dataStore.clientes.length; i++) {
        //     if (this.dataStore.clientes[i]._id === id) {
        //         foundIndex = i;
        //     }
        // }

        // return foundIndex;
        return 0;
    }

    /*
    Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
    */
    private onCreated(turno: Turno) {
        console.log('On created de Angular con Socket de Feathers');
        console.log(turno);

        this.dataStore.turnos.push(turno);

        this.turnosObserver.next(this.dataStore.turnos);
    }

    /*
    Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
    */
    private onUpdated(cliente: Turno) {
        // const index = this.getIndex(cliente._id);
        //
        // this.dataStore.clientes[index] = cliente;
        //
        // this.clientesObserver.next(this.dataStore.clientes);
    }

    /*
    Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
    */
    private onRemoved(cliente) {
        // const index = this.getIndex(cliente._id);
        //
        // this.dataStore.clientes.splice(index, 1);
        //
        // this.clientesObserver.next(this.dataStore.clientes);
    }
}
