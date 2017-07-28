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
import { PacientesService } from '../pacientes/pacientes.service';

import { Subscription } from 'rxjs/Subscription';
import {default as swal} from 'sweetalert2';
//Declaramos esta variable para hacer uso de Jquery con los modals de Boostrap
declare var $: any;

@Component({
  selector: 'turnos',
  providers:[TurnoSocketService, PacientesService],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})

export class TurnosComponent implements OnInit, OnDestroy {

  url: string;
  idDoctor: string;

  doctores: Medico[];
  turnos: Turno[];

  pacientes: any[] = [];

  fechaNuevoTurno: any = null;

  private iniciado: boolean = false;
  private cambio: boolean = false;

  private subscription: Subscription;

  constructor(
    route: ActivatedRoute,
    private turnosService: TurnosService,
    private doctoresService: MedicosService,
    private pacientesService: PacientesService,
    private turnosSocketService : TurnoSocketService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    this.url = route.snapshot.params['doctor'];
    this.idDoctor = route.snapshot.params['idDoctor'];
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

      // console.log("En router events");
      //console.log(event);

      if(event instanceof NavigationEnd){
        let tempUrl = event.url.split('/',4)[1];
        if (tempUrl == 'turnos'){
          let idDoctor = event.url.split('/',4)[3];
          //console.log(matricula);

          if(yo.turnosSocketService ){
            if(yo.cambio ){
              yo.metodoLimpieza(idDoctor);
              yo.loadCalendar(idDoctor);
            }
            else{
              yo.loadCalendar(idDoctor);
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
    this.iniciado = this.turnosSocketService.iniciar(this.idDoctor);
  }

  loadCalendar(idDoctor: string){

    //console.log('LLEGUE A LOAD CALENDAR');
    //console.log(matricula);

    var yo = this;
    $('#calendar')
    .fullCalendar({
      header: {
        locale: 'es',
        left: '',
        center: 'title',
        right: ''
      },
      timezone:'UTC',
      defaultView:'agendaWeek',
      height: 'auto',
      //weekends: false, //COMENTADO SOLAMENTE COMO PRUEBA. PONER DE NUEVO PARA DEPLOY!
      allDaySlot:false,
      eventOverlap: false, //Previene que se sobrepongan 2 eventos!!!
      slotDuration:'00:15:00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
      minTime:'09:00:00',
      maxTime:'18:00:00',
      businessHours: [{
         dow: [0, 1, 2, 3, 4, 5, 6], // Maybe not 0,6? Sunday,Saturday
         start: '08:00',
         end: '12:00'
       }, {
         dow: [0, 1, 2, 3, 4, 5, 6], // Maybe not 0,6? Sunday,Saturday
         start: '13:00',
         end: '18:00'
       }],
      //defaultDate: new Date(), // Esto esta de mas. Si no especificamos la fecha, por defecto es la acutal.
      navLinks: true, // can click day/week names to navigate views
      editable: true, //falso para la vista de clientes
      eventLimit: true, // allow "more" link when too many events
      events: this.turnos,
      dayClick: function(date, jsEvent, view) { //date es un moment
        console.log('Clicked on: ' + date.format());
        //PRUEBA DE CAMBIO DE VISUAL:
        if (view.name == "month") {
          // Si la vista acutal es la del mes...
          $('#calendar').fullCalendar('changeView', 'agendaDay'/* aca podemos cambiar a lo que queramos! ej:  'basicDay' */);
          $('#calendar').fullCalendar('gotoDate',date);
        }

        let arregloDeHoras = $('#calendar').fullCalendar('option', 'businessHours');
        //FIN DE LA PRUEBA.
        let horaClick = date.hour() + ':' + date.minutes();


        //comprobamos la validez de la hora ingresada!
        if(yo.comprobarValidezHora(arregloDeHoras,horaClick,horaClick)){

            console.log("ENTRE CORRECTAMENTE AL RANGO HORARIO!");
            yo.asignarPaciente(date);
          }






        //creo el obj
        //el "end" deberia ser dinamico, dependiendo del medico? (doctor.turno)

        //	var newTurno = {"title":paciente,"allDay":false,"start":date.format(),"end":date.add(30, 'm').format(),"color":color};


        //lo pusheo al calendar

        //	$('#calendar').fullCalendar('renderEvent', newTurno, true)

        //lo guardo en la db
        // ???

      },
      eventDrop: function(event, delta, revertFunc) {


        let arregloDeHoras = $('#calendar').fullCalendar('option', 'businessHours');
        let horaInicial = event.start.hour() + ':' + event.start.minutes();
        let horaFinal = event.end.hour() + ':' + event.end.minutes();

        // console.log("Horas...");
        // console.log(horaInicial);
        // console.log(horaFinal);

        if(yo.comprobarValidezHora(arregloDeHoras,horaInicial,horaFinal)){

          swal({
            title: '¿Estas seguro que queres cambiar el turno?',
            //text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, modificar!',
            cancelButtonText: 'Cancelar'
          }).then(function() {
            yo.turnosSocketService.actualizarTurno(event);
          }, function(dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
              revertFunc();
            }
          });
        }
        else{
          revertFunc();
        }




      },
      eventResize: function(event, delta, revertFunc) {

        let arregloDeHoras = $('#calendar').fullCalendar('option', 'businessHours');
        let horaInicial = event.start.hour() + ':' + event.start.minutes();
        let horaFinal = event.end.hour() + ':' + event.end.minutes();

        if(yo.comprobarValidezHora(arregloDeHoras,horaInicial,horaFinal)){
          swal({
            title: '¿Estas seguro que queres agrandar el turno?',
            //text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, agrandar!',
            cancelButtonText: 'Cancelar'
          }).then(function() {
            yo.turnosSocketService.actualizarTurno(event);
          }, function(dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
              revertFunc();
            }
          });
        }
        else{
          revertFunc();
        }
        
        //actualizar el turno en la db (tenemos el event.id)
        //???
      },
      eventClick: function(calEvent,delta,view){
        //ESTO CAMBIARLO! Porque no esta bueno que cuando haga click muera el evento!
        //La idea seria que cuando haga click le tire un popup o algo asi, para ver los detalles
        // del turno y poder eliminarlo, editarlo, etc.

        swal({
          title: '¿Estas seguro que queres eliminar el turno?',
          //text: 'You will not be able to recover this imaginary file!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'Cancelar'
        }).then(function() {
          $('#calendar').fullCalendar('removeEvents', function (event) {
            return event == calEvent; //Esto remueve solamente el evento "clickeado" que entra por parametro del evento del calendario 'calEvent'
          });

          yo.turnosSocketService.eliminarTurno(calEvent);
        }).catch(swal.noop);
      }
    });
  }


  //TESTEAR ESTO! VERIFICAR SI ESTA BIEN LA LOGICA!
  comprobarValidezHora(arregloHorasValidas,horaInicialEvento, horaFinalEvento): Boolean{
    let validez = false;
    for (let i = 0; i < arregloHorasValidas.length; i++) {
        arregloHorasValidas[i];
        if((horaInicialEvento >= arregloHorasValidas[i].start) && (horaFinalEvento <= arregloHorasValidas[i].end)){
          //Esto nos indica que el evento se encuentra en al menos 1 intervalo valido de horario!..
          validez = true;
        }
    }
    return validez;
  }

  asignarPaciente(date){
    this.fechaNuevoTurno = date;

    $('#formCrearTurno').modal('show');
  }

  onAsignacionPaciente(asignacion){
    // console.log('On Asignacion de Paciente');
    // console.log(asignacion);

    if(asignacion != null){
      this.crearTurno(this.fechaNuevoTurno, asignacion);
    }
  }

  crearTurno(date, pacienteAsignado){

    let paciente = pacienteAsignado;

    this.turnosSocketService.crearTurno(date.format(), paciente);

    //Restablecemos las variables
    this.fechaNuevoTurno = null;
  }

  metodoLimpieza(idDoctor){

    // console.log('*****///****');
     console.log('Entre a metodo limpieza');
    //Limpiamos el calendario
    // calendario.fullCalendar( 'destroy' );
    let yo = this;

    this.pacientesService.getPacientes().then(pacientes => {

      yo.pacientes = pacientes;

      let calendario = $('#calendar');
      calendario.fullCalendar( 'removeEvents' );


      //Limpiamos el service
      if(this.turnosSocketService){

        this.turnosSocketService.cambiarMedico(idDoctor);
      }
    }).catch(err => console.log(err));


  }

  verificarUrl(){

    // console.log(this.url);
    // console.log (this.doctores.find(doctor => doctor.url == "this.url"));
    // //^^ no lo encuentra
    // console.log(this.doctores);

  }

  getAllDoctores(): void {
    this.doctoresService
    .getDoctores()
    .then(docs => {
      this.doctores = docs;
      this.verificarUrl();
      this.getAllTurnos(this.url, this.idDoctor)
    });
  }
  getAllTurnos(url, idDoctor): void {
    console.log(url)//parametro para la consulta
    this.turnosService
    .getTurnos()
    .then(docs => {
      this.turnos = docs;
      this.loadCalendar(idDoctor)
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

    let yo = this;

    this.pacientesService.getPacientes().then(pacientes => {

      yo.pacientes = pacientes;

      // console.log('pacientes');
      // console.log(pacientes);
      yo.getAllDoctores();


    }).catch(err => console.log(err))
    //alert(this.url);

  }

  ngOnDestroy() {
    // console.log("ME DESTRUIIIIIII ####@#|@##~#@");
    // //this.subscription.unsubscribe();
    // console.log('####*****////########//////###');
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
    this.pacientesService = null;
  }

}
