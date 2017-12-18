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
import { default as swal } from 'sweetalert2';
//Declaramos esta variable para hacer uso de Jquery con los modals de Boostrap
declare var $: any;

@Component({
  selector: 'turnos',
  providers: [TurnoSocketService, PacientesService],
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

  fechaAntigua: any[] = [];



  constructor(
    route: ActivatedRoute,
    private turnosService: TurnosService,
    private doctoresService: MedicosService,
    private pacientesService: PacientesService,
    private turnosSocketService: TurnoSocketService,
    private pacientesCompartidosService: PacientesCompartidosService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    this.url = route.snapshot.params['doctor'];
    this.idDoctor = route.snapshot.params['idDoctor'];
    let yo = this;

    this.iniciarServicio();
    ////console.log("ENTRE X VECES: ");

    // Eventos que se pueden capturar:
    // NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized

    router.events
    //.filter(event => event instanceof NavigationStart) // Ejemplo de filtrar por evento
    .forEach((event) => {

      while (!yo.iniciado) {
        setTimeout(function () { }, 5000);
      }

      if (event instanceof NavigationEnd) {

        let tempUrl = event.url.split('/', 4)[1];

        if (tempUrl == 'turnos') {

          let idDoctor = event.url.split('/', 4)[3];

          if (yo.turnosSocketService) {
            if (yo.cambio) {
              yo.metodoLimpieza(idDoctor);
              yo.loadCalendar(idDoctor);
            }
            else {
              yo.loadCalendar(idDoctor);
            }

          }
          yo.cambio = true;

        }
      }
    });
  }

  observarPacientes() {
    /*
    Subscribimos a los pacientes, para que tengan una correspondencia
    con los pacientes del navigator
    */
    if (this.pacientesCompartidosService.pacientes$) {
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

  iniciarServicio() {
    this.iniciado = this.turnosSocketService.iniciar(this.idDoctor);
  }

  loadCalendar(idDoctor: string) {

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
      defaultView: 'agendaWeek',
      height: 'auto',
      eventTextColor: 'black',
      weekends: true, //COMENTADO SOLAMENTE COMO PRUEBA. PONER DE NUEVO PARA DEPLOY!
      hiddenDays: [ 0 ], // Ocultamos el domingo
      allDaySlot: false,
      eventOverlap: true, //Previene que se sobrepongan 2 eventos!!!
      //slotDuration: '00:15:00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
      slotDuration: '00:'+10+':00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
      minTime: '08:00:00',
      maxTime: '24:00:00',
      nowIndicator: true,
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
      dayClick: function (date, jsEvent, view) { //date es un moment
        //PRUEBA DE CAMBIO DE VISUAL:
        if (view.name == "month") {
          // Si la vista acutal es la del mes...
          $('#calendar').fullCalendar('changeView', 'agendaDay'/* aca podemos cambiar a lo que queramos! ej:  'basicDay' */);
          $('#calendar').fullCalendar('gotoDate', date);
        }
        else {
          //Verificamos que la fecha sea mayor a la actual:
          // var check = $.fullCalendar.formatDate(date, 'yyyy-MM-dd');
          // var today = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd');

          if (view.name == "agendaWeek" || view.name == "agendaDay") {
            var today = moment();
            var date2 = moment(date).add(3,'hours'); //Le sume 3 horas porque fullcalendar me devuelve 3 horas menos de donde hice click
            if (date2 < today) {
              // Previous Day. show message if you want otherwise do nothing.
              // So it will be unselectable
              swal(
                'Error',
                'No se puede crear un turno en una fecha pasada!',
                'error'
              ).catch(err => {
                console.log("error en swal", err);
              })

            }
            else {

              // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
              let duracionTurno = parseInt($('#calendar').fullCalendar('option', 'slotDuration').split(':')[1]); //CAMBIARRRRRRRR
              // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR


              //*************************************************

              //Windows: descomentar la linea de abajo
              var temp = moment(date).utc(); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO
              //*************************************************
              yo.asignarPaciente(temp);
            }

          }
        }





      },
      eventDrop: function (event, delta, revertFunc) {
        var startUtcAux = moment(event.start).utc().add(3,'h');
        var endUtcAux = moment(event.end).utc().add(3,'h');
        var startUtc = moment(event.start).utc();
        var endUtc = moment(event.end).utc();
        var today = moment().utc();

        if (startUtcAux < today) {
          // console.log(event);
          //TODO: hacer funcionalidad de copiar un turno para crear uno nuevo.
          revertFunc();
        }
        else {
          var duplicar = false;
          if(this.fechaAntigua < today){
            duplicar = true;
          }
          swal({
            title: '¿Estas seguro que queres cambiar el turno?',
            //text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, modificar!',
            cancelButtonText: 'Cancelar'
          }).then(function () {

            if(duplicar){
              yo.turnosSocketService.crearTurnoConFin(startUtc, endUtc, yo.obtenerTurno(event._id).paciente);
              // console.log("revert");
              revertFunc();
            }else{
              yo.turnosSocketService.actualizarTurno2(startUtc, endUtc, event._id);
            }


          }, function (dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
              // console.log("revert");
              revertFunc();
            }
          });
        }


      },
      eventDragStart: function (event) {
      },
      eventDragStop: function (event) {
        this.fechaAntigua = moment(event.start).utc().add(3,'h');
      },


      eventResize: function (event, delta, revertFunc) {

        var startUtcAux = moment(event.start).utc().add(3,'h');
        var endUtcAux = moment(event.end).utc().add(3,'h');
        var startUtc = moment(event.start).utc();
        var endUtc = moment(event.end).utc();
        var today = moment().utc();

        var today = moment();

        if (startUtcAux < today) {
          revertFunc();
        }
        else {
          swal({
            title: '¿Estas seguro que queres agrandar el turno?',
            //text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, agrandar!',
            cancelButtonText: 'Cancelar'
          }).then(function () {
            yo.turnosSocketService.actualizarTurno2(startUtc, endUtc, event._id);
          }, function (dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
              revertFunc();
            }
          });
        }
        //actualizar el turno en la db (tenemos el event.id)
        //???
      },
      eventClick: function (calEvent, delta, view) {

        let turno_seleccionado = yo.obtenerTurno(calEvent._id);

        if(turno_seleccionado.esReserva){
          swal({
            title: '¿Desea eliminar este evento?',
            //text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
          })
          .then(function () {
            swal(
              'Evento eliminado!',
              'El evento fue eliminado correctamente',
              'success'
            );
            yo.cancelarReserva(turno_seleccionado);

          }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            if (dismiss === 'cancel') {
            }
          })
        }
        else{
          yo.turnoSeleccionado = turno_seleccionado;
          $('#formVerTurno').modal('show');
        }

      },
      eventMouseover: function(event, jsEvent, view){
        // Al hacer hover sobre el evento, mostramos el tittle que incluye la descripcion
        let startUtc = moment(event.start).utc();
        let endUtc = moment(event.end).utc();

        $(this).tooltip({title: startUtc.format("DD/MM [:] HH:mm")
        +' - '+ endUtc.format("HH:mm [hs]")+ "\n" + event.title});
      }
    });
  }


  //TESTEAR ESTO! VERIFICAR SI ESTA BIEN LA LOGICA!
  comprobarValidezHora(arregloHorasValidas, horaInicialEvento, horaFinalEvento, numDia): Boolean {

    let validez = false;
    let horaInicialE = parseInt(horaInicialEvento.split(':')[0]);
    let minInicialE = parseInt(horaInicialEvento.split(':')[1]);
    let horaFinalE = parseInt(horaFinalEvento.split(':')[0]);
    let minFinalE = parseInt(horaFinalEvento.split(':')[1]);


    for (let i = 0; i < arregloHorasValidas.length; i++) {

      let temp = arregloHorasValidas[i].start;
      if (arregloHorasValidas[i].start[0] === '0') {
        temp = arregloHorasValidas[i].start.substring(1, arregloHorasValidas[i].start.length);
        // ////console.log(temp);
        // ////console.log(horaInicialEvento>=temp);
      }
      let temp2 = arregloHorasValidas[i].end;
      if (arregloHorasValidas[i].end[0] === '0') {
        temp2 = arregloHorasValidas[i].end.substring(1, arregloHorasValidas[i].end.length);
        ////console.log(horaFinalEvento <= temp2);
      }
      for (let j = 0; j < arregloHorasValidas[i].dow.length; j++) {
        // ////console.log("----------");
        // ////console.log(arregloHorasValidas[i].dow[j]);
        if (arregloHorasValidas[i].dow[j] == numDia) {

          let horaValidaInicio = parseInt(temp.split(':')[0]);
          let horaValidaFin = parseInt(temp2.split(':')[0]);
          let minValidaInicio = parseInt(temp.split(':')[1]);
          let minValidaFin = parseInt(temp2.split(':')[1]);


          if ((horaInicialE > horaValidaInicio) && ((horaFinalE < horaValidaFin) || (horaFinalE == horaValidaFin && minFinalE <= minValidaFin))) {
            validez = true;
          }
          else {
            if ((horaInicialE == horaValidaInicio) && (minInicialE >= minValidaInicio)) {
              if ((horaFinalE < horaValidaFin) || (horaFinalE == horaValidaFin && minFinalE <= minValidaFin)) {
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

  asignarPaciente(date) {
    this.fechaNuevoTurno = date;

    $('#formCrearTurno').modal('show');
  }

  onAsignacionPaciente(asignacion) {

    if (asignacion != null) {

      let yo = this;

      if( asignacion.esReserva ){
        // Es decir, es una reserva de espacio SIN paciente
        let fechaString = this.fechaNuevoTurno.format("DD/MM [a las] HH:mm [hs]");

        swal({
          title: `Descrición Reserva para el dia ${fechaString}`,
          input: 'text',
          inputPlaceholder: 'Breve descripción',
          showCancelButton: true,
          inputValidator: function (value) {

            return new Promise<void>(function (resolve, reject) {
              if (value) {
                resolve()
              } else {
                reject('No puede estar vacía!')
              }
            })
          }
        }).then(function (descripcionReserva) {

          swal(
              'Reserva realizada!',
              'La reserva fue realizada correctamente',
              'success'
            );

          yo.reservarHorario(yo.fechaNuevoTurno, descripcionReserva);

        })

    }
    else{
      // Es decir, es una asignacion de un paciente
      let paciente = "" + asignacion.nombre + " " + asignacion.apellido;
      let fecha = this.fechaNuevoTurno.format("DD-MM-YYYY HH:mm")
      swal({
        title: 'Confirmacion de creacion de turno',
        text: "¿Está seguro de crear un turno para el dia " + fecha + " para el paciente " + paciente + " ?",
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
}

crearTurno(date, pacienteAsignado) {

  let paciente = pacienteAsignado;

  this.turnosSocketService.crearTurno(date.format(), paciente);

  //Restablecemos las variables
  this.fechaNuevoTurno = null;
}

reservarHorario(fecha, descripcion){
  console.log('## Reservar horario de turnos.component');

  this.turnosSocketService.reservarHorario(fecha.format(), descripcion);

  //Restablecemos las variables
  this.fechaNuevoTurno = null;

}

cancelarReserva(reserva){
  this.turnosSocketService.cancelarReserva(reserva);
}

metodoLimpieza(idDoctor) {

  //Limpiamos el calendario
  // calendario.fullCalendar( 'destroy' );
  let yo = this;

  this.setDoctorSeleccionado(idDoctor);


  this.pacientesService.getPacientesActivos().then(pacientes => {
    // console.log('Pacientes');
    yo.pacientes = pacientes;

    let calendario = $('#calendar');
    calendario.fullCalendar('removeEvents');

    //Limpiamos el service
    if (this.turnosSocketService) {

      this.turnosSocketService.cambiarMedico(idDoctor);
    }
  }).catch(err => console.error(err));


}

obtenerTurno(id) {
  let turnoEncontrado = null;

  for (let i = 0; i < this.turnos.length; i++) {

    if (id === this.turnos[i]._id) {
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
    this.getAllTurnos(this.url, this.idDoctor)
  });
}
getAllTurnos(url, idDoctor): void {
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

  }).catch(err => console.log(err))

}

setDoctorSeleccionado(idDoctor) {
  //Seteo el doctor seleccionado
  if (this.doctores != undefined) {
    var thisLocal = this;
    this.doctores.forEach(function (elem, index) {
      if (elem._id == idDoctor) {
        thisLocal.doctorSeleccionado = elem;
        //  console.log(thisLocal.doctorSeleccionado);
      }
    });
  }
}

ngOnDestroy() {
  //this.subscription.unsubscribe();
  var observers = (<any>(this.router.events)).observers;
  //console.log(observers);
  //console.log(observers[observers.length-1].unsubscribe());
  //console.log(observers);

  this.router.dispose();
  this.turnosSocketService = null;
  this.pacientesService = null;
}

}
