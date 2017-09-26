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

import { PacientesCompartidosService } from '../routerService/pacientes.sistema';
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
  doctorSeleccionado: Medico;

  doctores: Medico[];
  turnos: Turno[];
  turnoSeleccionado: any;

  pacientes: any[] = [];

  fechaNuevoTurno: any = null;

  private iniciado: boolean = false;
  private cambio: boolean = false;

  private subscription: Subscription;
  private pacientesSubscription: Subscription;

  public cargandoTurnos: boolean = true;

  constructor(
    route: ActivatedRoute,
    private turnosService: TurnosService,
    private doctoresService: MedicosService,
    private pacientesService: PacientesService,
    private turnosSocketService : TurnoSocketService,
    private pacientesCompartidosService : PacientesCompartidosService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    this.url = route.snapshot.params['doctor'];
    this.idDoctor = route.snapshot.params['idDoctor'];
    let yo = this;

    this.iniciarServicio();
    ////console.log("ENTRE X VECES: ");

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
        ////console.log('Adentro');
        setTimeout(function(){}, 5000);
      }

      // ////console.log("En router events");
      ////console.log(event);

      if(event instanceof NavigationEnd){
        let tempUrl = event.url.split('/',4)[1];
        if (tempUrl == 'turnos'){
          let idDoctor = event.url.split('/',4)[3];
          ////console.log(matricula);

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

  observarPacientes(){
    /*
      Subscribimos a los pacientes, para que tengan una correspondencia
      con los pacientes del navigator
    */
    if(this.pacientesCompartidosService.pacientes$){
      this.pacientesSubscription = this.pacientesCompartidosService.pacientes$.subscribe((pacientes) => {

        this.pacientes = pacientes;
        // this.ref.markForCheck();
      }, (err) => {
        console.log('Error en observarPacientes de tablaPacientes');
        console.error(err);
      });

      // Obtenemos los pacientes compartidos
      this.pacientesCompartidosService.getPacientes();
    }
  }

  iniciarServicio(){
    ////console.log('*******************************************');
    ////console.log('Entre a INICIAR SERVICIO de TURNO COMPONENT');
    this.iniciado = this.turnosSocketService.iniciar(this.idDoctor);
  }

  loadCalendar(idDoctor: string){

    this.setDoctorSeleccionado(idDoctor);

    //VARIABLE PARA EL LOADING
    this.cargandoTurnos = true;

    var yo = this;
    $('#calendar')
    .fullCalendar({
      header: {
        locale: 'es',
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      // timezone:'UTC',
      defaultView:'agendaWeek',
      height: 'auto',
      //weekends: false, //COMENTADO SOLAMENTE COMO PRUEBA. PONER DE NUEVO PARA DEPLOY!
      allDaySlot:false,
      eventOverlap: false, //Previene que se sobrepongan 2 eventos!!!
      slotDuration:'00:15:00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
      minTime:'08:00:00',
      maxTime:'24:00:00',
      // businessHours: [
      //
      //   {
      //    dow: [0, 1, 2, 3, 4, 5, 6], // Maybe not 0,6? Sunday,Saturday
      //    start: '08:00',
      //    end: '11:00'
      //  },
      //  {
      //     dow: [1, 2], // Maybe not 0,6? Sunday,Saturday
      //     start: '11:30',
      //     end: '12:00'
      //   }, {
      //    dow: [0, 1, 2, 3, 4, 5, 6], // Maybe not 0,6? Sunday,Saturday
      //    start: '15:00',
      //    end: '18:00'
      //  }],
      //defaultDate: new Date(), // Esto esta de mas. Si no especificamos la fecha, por defecto es la acutal.
      navLinks: true, // can click day/week names to navigate views
      editable: true, //falso para la vista de clientes
      eventLimit: true, // allow "more" link when too many events
      events: this.turnos,
      dayClick: function(date, jsEvent, view) { //date es un moment
        ////console.log('Clicked on: ' + date.format());
        //PRUEBA DE CAMBIO DE VISUAL:
        if (view.name == "month") {
          // Si la vista acutal es la del mes...
          $('#calendar').fullCalendar('changeView', 'agendaDay'/* aca podemos cambiar a lo que queramos! ej:  'basicDay' */);
          $('#calendar').fullCalendar('gotoDate',date);
        }


        // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
        let duracionTurno = parseInt($('#calendar').fullCalendar('option','slotDuration').split(':')[1]); //CAMBIARRRRRRRR
        ////console.log($('#calendar').fullCalendar('option','slotDuration').split(':')[2]);
        ////console.log("duracion");
        ////console.log(duracionTurno);
        // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR


        //*************************************************

        //Windows: descomentar la linea de abajo
        var temp = moment(date).utc(); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO
        //*************************************************

        // console.log('temp');
        // console.log(temp);
        /*
        let temp2 = temp.add(duracionTurno, 'm');

        let arregloDeHoras = $('#calendar').fullCalendar('option', 'businessHours');
        //FIN DE LA PRUEBA.
        let horaClick = date.hour() + ':' + date.minutes();
        ////console.log(date);
        ////console.log(date.day());
        let horaClickFinal = temp2.hour() + ':' + temp2.minutes();
        ////console.log("HORA FINALLLLLLLLLLLLL");
        ////console.log(horaClickFinal);
        //comprobamos la validez de la hora ingresada!
        if(yo.comprobarValidezHora(arregloDeHoras,horaClick,horaClickFinal,date.day())){

            ////console.log("ENTRE CORRECTAMENTE AL RANGO HORARIO!");
            yo.asignarPaciente(temp);
        }
        */

        yo.asignarPaciente(temp);




        //creo el obj
        //el "end" deberia ser dinamico, dependiendo del medico? (doctor.turno)

        //	var newTurno = {"title":paciente,"allDay":false,"start":date.format(),"end":date.add(30, 'm').format(),"color":color};


        //lo pusheo al calendar

        //	$('#calendar').fullCalendar('renderEvent', newTurno, true)

        //lo guardo en la db
        // ???

      },
      eventDrop: function(event, delta, revertFunc) {


        var startUtc = moment(event.start).utc();
        var endUtc = moment(event.end).utc();

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
          // yo.turnosSocketService.actualizarTurno(event);
          yo.turnosSocketService.actualizarTurno2(startUtc, endUtc, event._id);
        }, function(dismiss) {
          // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
          if (dismiss === 'cancel') {
            revertFunc();
          }
        });
      },
      eventResize: function(event, delta, revertFunc) {

        var startUtc = moment(event.start).utc();
        var endUtc = moment(event.end).utc();

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
          // yo.turnosSocketService.actualizarTurno(event);
            yo.turnosSocketService.actualizarTurno2(startUtc, endUtc, event._id);
        }, function(dismiss) {
          // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
          if (dismiss === 'cancel') {
            revertFunc();
          }
        });


        //actualizar el turno en la db (tenemos el event.id)
        //???
      },
      eventClick: function(calEvent,delta,view){
        //ESTO CAMBIARLO! Porque no esta bueno que cuando haga click muera el evento!
        //La idea seria que cuando haga click le tire un popup o algo asi, para ver los detalles
        // del turno y poder eliminarlo, editarlo, etc.

        yo.turnoSeleccionado = calEvent;
        yo.turnoSeleccionado = yo.obtenerTurno(calEvent._id);
        $('#formVerTurno').modal('show');

        // swal({
        //   title: '¿Estas seguro que queres eliminar el turno?',
        //   //text: 'You will not be able to recover this imaginary file!',
        //   type: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Si, eliminar!',
        //   cancelButtonText: 'Cancelar'
        // }).then(function() {
        //   $('#calendar').fullCalendar('removeEvents', function (event) {
        //     return event == calEvent; //Esto remueve solamente el evento "clickeado" que entra por parametro del evento del calendario 'calEvent'
        //   });
        //
        //   yo.turnosSocketService.eliminarTurno(calEvent);
        // }).catch(swal.noop);



      }
    });
  }


  //TESTEAR ESTO! VERIFICAR SI ESTA BIEN LA LOGICA!
  comprobarValidezHora(arregloHorasValidas,horaInicialEvento, horaFinalEvento, numDia): Boolean{
    ////console.log("comprobando validez");
    ////console.log(arregloHorasValidas);



    let validez = false;
    let horaInicialE = parseInt(horaInicialEvento.split(':')[0]);
    let minInicialE = parseInt(horaInicialEvento.split(':')[1]);
    let horaFinalE = parseInt(horaFinalEvento.split(':')[0]);
    let minFinalE = parseInt(horaFinalEvento.split(':')[1]);


    for (let i = 0; i < arregloHorasValidas.length; i++) {

      let temp = arregloHorasValidas[i].start;
      if (arregloHorasValidas[i].start[0]==='0'){
        temp = arregloHorasValidas[i].start.substring(1,arregloHorasValidas[i].start.length);
        // ////console.log(temp);
        // ////console.log(horaInicialEvento>=temp);
      }
      let temp2 = arregloHorasValidas[i].end;
      if (arregloHorasValidas[i].end[0]==='0'){
        temp2 = arregloHorasValidas[i].end.substring(1,arregloHorasValidas[i].end.length);
        ////console.log(horaFinalEvento <= temp2);
      }
      for (let j = 0; j < arregloHorasValidas[i].dow.length; j++) {
        // ////console.log("----------");
        // ////console.log(arregloHorasValidas[i].dow[j]);
          if(arregloHorasValidas[i].dow[j] == numDia){
            // ////console.log("ENTRE Nº1");
            // ////console.log(temp);
            // ////console.log(horaInicialEvento);
            // ////console.log(temp <= horaInicialEvento);
            // ////console.log(temp2);
            // ////console.log(horaFinalEvento);
            // ////console.log("----------");

            let horaValidaInicio = parseInt(temp.split(':')[0]);
            let horaValidaFin = parseInt(temp2.split(':')[0]);
            let minValidaInicio = parseInt(temp.split(':')[1]);
            let minValidaFin = parseInt(temp2.split(':')[1]);


            if((horaInicialE > horaValidaInicio) && ((horaFinalE < horaValidaFin) || (horaFinalE == horaValidaFin && minFinalE <= minValidaFin))){
              validez = true;

              // ////console.log("IF");
              // ////console.log(minFinalE);
              // ////console.log(minValidaFin);
              // ////console.log(minFinalE <= minValidaFin);
            }
            else{
              // ////console.log("ELSE");
              // ////console.log(horaInicialE == horaValidaInicio);
              // ////console.log("-");
              // ////console.log(minInicialE >= minValidaInicio);
              // ////console.log("-");
              // ////console.log(horaFinalE < horaValidaFin);
              // ////console.log("-");
              // ////console.log(horaFinalE == horaValidaFin);
              // ////console.log("-");
              // ////console.log(minFinalE <= minValidaFin);
              // ////console.log("-");
              if((horaInicialE == horaValidaInicio) && (minInicialE >= minValidaInicio)){
                if((horaFinalE < horaValidaFin) || (horaFinalE == horaValidaFin && minFinalE <= minValidaFin)){
                  validez = true;
                }
              }
            }
          }
      }
    }
    return true;
    // return validez;
  }

  asignarPaciente(date){
    this.fechaNuevoTurno = date;

    $('#formCrearTurno').modal('show');
  }

  onAsignacionPaciente(asignacion){
    // ////console.log('On Asignacion de Paciente');
    // ////console.log(asignacion);

    if(asignacion != null){

      // console.log("Fecha");
      // console.log(this.fechaNuevoTurno);
      // console.log(asignacion);
      let yo = this;
      let paciente = ""+ asignacion.nombre + " " + asignacion.apellido;
      let fecha = this.fechaNuevoTurno.format("DD-MM-YYYY HH:mm")
      swal({
        title: 'Confirmacion de creacion de turno',
        text: "¿Estas seguro de crear un turno para el dia "+ fecha + " para el paciente " + paciente + " ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Crear!',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        // buttonsStyling: false
      }).then(function () {
        swal(
          'Turno creado!',
          'El turno fue creado correctamente',
          'success'
        ),
        yo.crearTurno(yo.fechaNuevoTurno, asignacion);
      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          swal(
            'Cancelado',
            'El turno fue descartado',
            'error'
          )
        }
      })

    }
  }

  crearTurno(date, pacienteAsignado){

    let paciente = pacienteAsignado;

    this.turnosSocketService.crearTurno(date.format(), paciente);

    //Restablecemos las variables
    this.fechaNuevoTurno = null;
  }

  metodoLimpieza(idDoctor){

    //   console.log('*****///****');
    //  console.log('Entre a metodo limpieza');
    //Limpiamos el calendario
    // calendario.fullCalendar( 'destroy' );
    let yo = this;

    this.setDoctorSeleccionado(idDoctor);


    this.pacientesService.getPacientesActivos().then(pacientes => {
      // console.log('Pacientes');
      yo.pacientes = pacientes;

      let calendario = $('#calendar');
      calendario.fullCalendar( 'removeEvents' );

      // console.log('Voy a limpiar el service');
      //Limpiamos el service
      if(this.turnosSocketService){

        this.turnosSocketService.cambiarMedico(idDoctor);
      }
    }).catch(err => console.error(err));


  }

  verificarUrl(){

    // ////console.log(this.url);
    // console.log (this.doctores.find(doctor => doctor.url == "this.url"));
    // //^^ no lo encuentra
    // ////console.log(this.doctores);

  }


  obtenerTurno(id){
    let turnoEncontrado = null;

    for (let i = 0; i < this.turnos.length; i++) {

        if(id === this.turnos[i]._id){
          turnoEncontrado = this.turnos[i];
          // console.log("Turno encontrado!");
        }

    }
    return turnoEncontrado;
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
    ////console.log(url)//parametro para la consulta
    this.loadCalendar(idDoctor)
  }


  ngOnInit() {
    this.cargandoTurnos = true;
    this.subscription = this.turnosSocketService.turnos$.subscribe((turnos: Turno[]) => {
      this.cargandoTurnos = false;
      this.turnos = turnos;
      this.ref.markForCheck();
    }, (err) => {
      console.error(err);
    });
    //this.turnosSocketService.find();

    let yo = this;

    // this.observarPacientes();
    this.getAllDoctores();

    this.pacientesService.getPacientesActivos().then(pacientes => {

      yo.pacientes = pacientes;

    }).catch(err =>  console.log(err))

  }

  setDoctorSeleccionado(idDoctor) {
    //Seteo el doctor seleccionado
    if(this.doctores != undefined){
      var thisLocal = this;
      this.doctores.forEach(function(elem,index){
        if(elem._id == idDoctor){
           thisLocal.doctorSeleccionado = elem;
           console.log(thisLocal.doctorSeleccionado);
        }
      });
    }
  }

  ngOnDestroy() {
    // ////console.log("ME DESTRUIIIIIII ####@#|@##~#@");
    // //this.subscription.unsubscribe();
    // ////console.log('####*****////########//////###');
    ////console.log('OBSERVERS');
    var observers = (<any>(this.router.events)).observers;
    ////console.log(observers);
    ////console.log(observers[observers.length-1].unsubscribe());
    ////console.log(observers);
    ////console.log('####*****////########//////###');
    ////console.log();

    ////console.log(this.router);
    this.router.dispose();
    this.turnosSocketService = null;
    this.pacientesService = null;
  }

}
