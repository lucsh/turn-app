import { Component, OnInit } from '@angular/core';

import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

import 'rxjs/add/operator/filter';
import { TurnosService } from './turnos.service';
import { MedicosService } from '../medico/medicos.service';

import * as moment from 'moment';



import { Medico } from '../medico/medico.tipo';
import { Turno } from './turno.tipo';
import { TurnoSocketService } from './turnos-socket.service';

import { Subscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
    selector: 'turnos',
    providers:[TurnoSocketService],
    templateUrl: './turnos.component.html',
    styleUrls: ['./turnos.component.css']
})

export class TurnosComponent implements OnInit, OnDestroy {

    url: string;
    matricula: string;

    doctores: Medico[];
    turnos: Turno[];

    private iniciado: boolean = false;
    private cambio: boolean = false;

    private subscription: Subscription;

    constructor(route: ActivatedRoute,private turnosService: TurnosService,private doctoresService: MedicosService,
        private turnosSocketService : TurnoSocketService,
        private router: Router,
        private ref: ChangeDetectorRef
    ) {
        this.url = route.snapshot.params['doctor'];
        this.matricula = route.snapshot.params['matricula'];
        let yo = this;

        this.iniciarServicio();
        console.log("ENTRE X VECES: ");

        // Eventos que se pueden capturar:
        // NavigationStart
        // NavigationEnd
        // NavigationCancel
        // NavigationError
        // RoutesRecognized

        router.events
        //.filter(event => event instanceof NavigationStart)
        .forEach((event) => {

            while(!yo.iniciado){
                console.log('Adentro');
                setTimeout(function(){}, 5000);
            }

            console.log("En router events");
            //console.log(event);

            if(event instanceof NavigationEnd){
                let tempUrl = event.url.split('/',4)[1];
                if (tempUrl == 'turnos'){
                    let matricula = event.url.split('/',4)[3];
                    //console.log(matricula);

                    if(yo.turnosSocketService ){
                        if(yo.cambio ){
                            yo.metodoLimpieza(matricula);
                            yo.loadCalendar(matricula);
                        }
                        else{
                            yo.loadCalendar(matricula);
                        }

                    }
                    // if(yo.turnosSocketService ){
                    //
                    //         yo.metodoLimpieza(matricula);
                    //         yo.loadCalendar(matricula);
                    //
                    //
                    // }

                    yo.cambio = true;

                }
            }
        });
    }

    iniciarServicio(){
        console.log('*******************************************');
        console.log('Entre a INICIAR SERVICIO de TURNO COMPONENT');
        this.iniciado = this.turnosSocketService.iniciar(this.matricula);
    }

    loadCalendar(matricula: string){

        //console.log('LLEGUE A LOAD CALENDAR');
        //console.log(matricula);

        var yo = this;
        $('#calendar')
        .fullCalendar({
            header: {
                locale: 'es',
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            timezone:'UTC',
            defaultView:'agendaWeek',
            //weekends: false, //COMENTADO SOLAMENTE COMO PRUEBA. PONER DE NUEVO PARA DEPLOY!
            allDaySlot:false,
            slotDuration:'00:15:00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
            minTime:'09:00:00',
            maxTime:'18:00:00',
            //defaultDate: new Date(), // Esto esta de mas. Si no especificamos la fecha, por defecto es la acutal.
            navLinks: true, // can click day/week names to navigate views
            editable: true, //falso para la vista de clientes
            eventLimit: true, // allow "more" link when too many events
            events: this.turnos,
            dayClick: function(date, jsEvent, view) {

                //PRUEBA DE CAMBIO DE VISUAL:
                if (view.name == "month") {
                    // Si la vista acutal es la del mes...
                    $('#calendar').fullCalendar('changeView', 'agendaDay'/* aca podemos cambiar a lo que queramos! ej:  'basicDay' */);
                    $('#calendar').fullCalendar('gotoDate',date);
                }

                //FIN DE LA PRUEBA.




                console.log('Clicked on: ' + date.format());

                //tengo que pedir el nombre del paciente y verificar que exista
                var paciente = 'Nuevo Paciente';
                //El color depende del medico al que le estoy cargando el turno
                var color = '#f8ac59';

                yo.turnosSocketService.crearTurno(date.format());

                //creo el obj
                //el "end" deberia ser dinamico, dependiendo del medico? (doctor.turno)

                //	var newTurno = {"title":paciente,"allDay":false,"start":date.format(),"end":date.add(30, 'm').format(),"color":color};


                //lo pusheo al calendar

                //	$('#calendar').fullCalendar('renderEvent', newTurno, true)

                //lo guardo en la db
                // ???

            },
            eventDrop: function(event, delta, revertFunc) {
                if (!confirm("¿Estas seguro que queres cambiar el turno?")) {
                    //ToDO SweetAlert
                    revertFunc();
                }else{
                    // console.log(event);
                    // console.log("#########");
                    // console.log(event.start.format()); // Es la nueva hora de inicio del evento
                    // console.log(event.end.format()); // Es la nueva hora de fin del evento

                    yo.turnosSocketService.actualizarTurno(event);
                }
            },
            eventResize: function(event, delta, revertFunc) {
                //revertFunc();
                console.log(event);
                if (!confirm("¿Estas seguro que queres cambiar el turno?")) {
                    //ToDO SweetAlert
                    revertFunc();
                }else{

                    yo.turnosSocketService.actualizarTurno(event);
                }

                //actualizar el turno en la db (tenemos el event.id)
                //???
            },
            eventClick: function(calEvent,delta,view){
                //ESTO CAMBIARLO! Porque no esta bueno que cuando haga click muera el evento!
                //La idea seria que cuando haga click le tire un popup o algo asi, para ver los detalles
                // del turno y poder eliminarlo, editarlo, etc.

                if (confirm("¿Estas seguro que queres eliminar el turno?")) {
                    //ToDO SweetAlert
                    $('#calendar').fullCalendar('removeEvents', function (event) {
                        return event == calEvent; //Esto remueve solamente el evento "clickeado" que entra por parametro del evento del calendario 'calEvent'
                    });

                    yo.turnosSocketService.eliminarTurno(calEvent);

                }

            }




        });




    }

    metodoLimpieza(matricula){

        console.log('*****///****');
        console.log('Entre a metodo limpieza');
        //Limpiamos el calendario
        // calendario.fullCalendar( 'destroy' );
        let calendario = $('#calendar');
        calendario.fullCalendar( 'removeEvents' );


        //Limpiamos el service
        if(this.turnosSocketService){

            this.turnosSocketService.cambiarMedico(matricula);
        }
    }

    verificarUrl(){

        console.log(this.url);
        console.log (this.doctores.find(doctor => doctor.url == "this.url"));
        //^^ no lo encuentra
        console.log(this.doctores);

    }

    getAllDoctores(): void {
        this.doctoresService
        .getDoctores()
        .then(docs => {
            this.doctores = docs;
            this.verificarUrl();
            this.getAllTurnos(this.url, this.matricula)
        });
    }
    getAllTurnos(url, matricula): void {
        console.log(url)//parametro para la consulta
        this.turnosService
        .getTurnos()
        .then(docs => {
            this.turnos = docs;
            this.loadCalendar(matricula)
        });
    }


    ngOnInit() {
        this.subscription = this.turnosSocketService.turnos$.subscribe((turnos: Turno[]) => {
            this.turnos = turnos;
            this.ref.markForCheck();
        }, (err) => {
            console.error(err);
        });
        //this.turnosSocketService.find();

        this.getAllDoctores();
        //alert(this.url);

    }

    ngOnDestroy() {
        console.log("ME DESTRUIIIIIII ####@#|@##~#@");
        //this.subscription.unsubscribe();
        console.log('####*****////########//////###');
        console.log('OBSERVERS');
        var observers = (<any>(this.router.events)).observers;
        //console.log(observers);
        console.log(observers[observers.length-1].unsubscribe());
        //console.log(observers);
        console.log('####*****////########//////###');
        console.log();

        console.log(this.router);
        this.router.dispose();
        this.turnosSocketService = null;
    }

}
