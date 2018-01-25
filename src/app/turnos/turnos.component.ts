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
  providers: [TurnoSocketService],
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

  private iniciado = false;
  private cambio = false;

  private subscription: Subscription;
  private pacientesSubscription: Subscription;

  public cargandoTurnos = true;

  fechaAntigua: any[] = [];

  private desdeRender: any = null;
  private hastaRender: any = null;

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

    const yo = this;
    yo.turnosSocketService.setMedico(yo.idDoctor);

    router.events
    .forEach((event) => {

      if (event instanceof NavigationEnd) {

        const tempUrl = event.url.split('/', 4)[1];

        if (tempUrl == 'turnos') {

          const idDoctor = event.url.split('/', 4)[3];
          if (yo.doctorSeleccionado){
            const anteriorMedicoId = yo.doctorSeleccionado._id.toString();

            if (idDoctor != anteriorMedicoId){

              yo.cambiarMedico(idDoctor).then(res => {
                yo.setDoctorSeleccionado(idDoctor);
                yo.cargandoTurnos = true;

                //Nuevo, cuando cambia el doc, no renderiza el calendar entonces tengo que llamar desde aca.
                // al metodo obtenerTUrnosRango con las variables globales
                yo.turnosSocketService.obtenerTurnosRango(yo.desdeRender, yo.hastaRender);
              });
            }
          }
        }
      }
    });
  }

  loadCalendar(idDoctor: string) {

    this.setDoctorSeleccionado(idDoctor);

    //VARIABLE PARA EL LOADING
    this.cargandoTurnos = true;

    const yo = this;
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
      slotDuration: '00:' + 10 + ':00', //deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
      minTime: '08:00:00',
      maxTime: '24:00:00',
      nowIndicator: true,
      navLinks: true, // can click day/week names to navigate views
      editable: true, //falso para la vista de clientes
      eventLimit: true, // allow "more" link when too many events
      events: this.turnos,
      viewRender: function(view, element) {
        const desde = new Date(view.start._d).toISOString();
        const hasta = new Date(view.end._d).toISOString();

        // Seteo variables globales para cuando cambia de doctor (no renderiza y no llama a este metodo)
        yo.desdeRender = desde;
        yo.hastaRender = hasta;
        yo.cargandoTurnos = true;

        // Obtenemos los turnos del rango esperado
        yo.turnosSocketService.obtenerTurnosRango(desde, hasta);

      },
      dayClick: function (date, jsEvent, view) { //date es un moment

        if (view.name == 'month') {
          // Si la vista acutal es la del mes...
          $('#calendar').fullCalendar('changeView', 'agendaDay'/* aca podemos cambiar a lo que queramos! ej:  'basicDay' */);
          $('#calendar').fullCalendar('gotoDate', date);
        }
        else {
          //Verificamos que la fecha sea mayor a la actual:
          if (view.name == 'agendaWeek' || view.name == 'agendaDay') {
          const today = moment();
          const date2 = moment(date).add(3, 'hours'); //Le sume 3 horas porque fullcalendar me devuelve 3 horas menos de donde hice click
          if (date2 < today) {
          // Previous Day. show message if you want otherwise do nothing.
          // So it will be unselectable
          swal(
          'Error',
          'No se puede crear un turno en una fecha pasada!',
          'error'
        ).catch(err => {
          console.log('error en swal', err);
        });

      }
      else {

        // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
        const duracionTurno = parseInt($('#calendar').fullCalendar('option', 'slotDuration').split(':')[1]); //CAMBIARRRRRRRR
        // CAMBIARRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR

        //Windows: descomentar la linea de abajo
        const temp = moment(date).utc(); //LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO
        yo.asignarPaciente(temp);
      }

    }
  }
},
eventDrop: function (event, delta, revertFunc) {
  const startUtcAux = moment(event.start).utc().add(3, 'h');
  const endUtcAux = moment(event.end).utc().add(3, 'h');
  const startUtc = moment(event.start).utc();
  const endUtc = moment(event.end).utc();
  const today = moment().utc();

  if (startUtcAux < today) {
    //TODO: hacer funcionalidad de copiar un turno para crear uno nuevo.
    revertFunc();
  }
  else {
    let duplicar = false;
    if (this.fechaAntigua < today){
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

      if (duplicar){
        yo.turnosSocketService.crearTurnoConFin(startUtc, endUtc, yo.obtenerTurno(event._id).paciente);
        // console.log("revert");
        revertFunc();
      }else{
        yo.turnosSocketService.actualizarTurno2(startUtc, endUtc, event._id);
      }


    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
      revertFunc();
    }
  });
}
},
eventDragStart: function (event) {},
eventDragStop: function (event) {this.fechaAntigua = moment(event.start).utc().add(3, 'h'); },
eventResize: function (event, delta, revertFunc) {

  const startUtcAux = moment(event.start).utc().add(3, 'h');
  const endUtcAux = moment(event.end).utc().add(3, 'h');
  const startUtc = moment(event.start).utc();
  const endUtc = moment(event.end).utc();
  const today = moment().utc();

  const today = moment();

  if (startUtcAux < today) {
    revertFunc();
  }
  else {
    swal({
      title: '¿Estas seguro que queres agrandar el turno?',
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

  const turno_seleccionado = yo.obtenerTurno(calEvent._id);

  if (turno_seleccionado.esReserva){
    swal({
      title: '¿Desea eliminar este evento?',
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
  });
}
else{
  yo.turnoSeleccionado = turno_seleccionado;
  $('#formVerTurno').modal('show');
}

},
eventMouseover: function(event, jsEvent, view){
  // Al hacer hover sobre el evento, mostramos el tittle que incluye la descripcion
  const startUtc = moment(event.start).utc();
  const endUtc = moment(event.end).utc();

  $(this).tooltip({title: startUtc.format('DD/MM [:] HH:mm')
  + ' - ' + endUtc.format('HH:mm [hs]') + '\n' + event.title});
}
});
}

asignarPaciente(date) {
  this.fechaNuevoTurno = date;

  $('#formCrearTurno').modal('show');
}

onAsignacionPaciente(asignacion) {

  if (asignacion != null) {

    const yo = this;

    if ( asignacion.esReserva ){
      // Es decir, es una reserva de espacio SIN paciente
      const fechaString = this.fechaNuevoTurno.format('DD/MM [a las] HH:mm [hs]');

      swal({
        title: `Descrición Reserva para el dia ${fechaString}`,
        input: 'text',
        inputPlaceholder: 'Breve descripción',
        showCancelButton: true,
        inputValidator: function (value) {

          return new Promise<void>(function (resolve, reject) {
            if (value) {
              resolve();
            } else {
              reject('No puede estar vacía!');
            }
          });
        }
      }).then(function (descripcionReserva) {

        swal(
          'Reserva realizada!',
          'La reserva fue realizada correctamente',
          'success'
        );

        yo.reservarHorario(yo.fechaNuevoTurno, descripcionReserva);

      });

    }
    else{
      // Es decir, es una asignacion de un paciente
      const paciente = '' + asignacion.nombre + ' ' + asignacion.apellido;
      const fecha = this.fechaNuevoTurno.format('DD-MM-YYYY HH:mm');
      swal({
        title: 'Confirmacion de creacion de turno',
        text: '¿Está seguro de crear un turno para el dia ' + fecha + ' para el paciente ' + paciente + ' ?',
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
      );
    }
  });
}}}

crearTurno(date, pacienteAsignado) {

  const paciente = pacienteAsignado;

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

cambiarMedico(idDoctor) {

  const yo = this;

  this.setDoctorSeleccionado(idDoctor);

  return new Promise((resolve, reject) => {
    this.pacientesService.getPacientesActivos().then(pacientes => {
      yo.pacientes = pacientes;

      //Limpiamos el calendario
      const calendario = $('#calendar');
      calendario.fullCalendar('removeEvents');

      //Limpiamos el service
      if (this.turnosSocketService) {
      this.turnosSocketService.cambiarMedico(idDoctor);
      resolve(true);
    }
  }).catch(err => console.error(err));
});
}

obtenerTurno(id) {
  let turnoEncontrado = null;

  for (let i = 0; i < this.turnos.length; i++) {

    if (id === this.turnos[i]._id) {
      turnoEncontrado = this.turnos[i];
    }
  }
  return turnoEncontrado;
}

getAllDoctores(): void {
  this.doctoresService
  .getDoctores()
  .then(docs => {
    this.doctores = docs;
    this.getAllTurnos(this.url, this.idDoctor);
  });
}
getAllTurnos(url, idDoctor): void {
  this.loadCalendar(idDoctor);
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

  const yo = this;
  this.getAllDoctores();
  this.pacientesService.getPacientesActivos().then(pacientes => {
    yo.pacientes = pacientes;

  }).catch(err => console.error(err));

}

setDoctorSeleccionado(idDoctor) {
  //Seteo el doctor seleccionado
  if (this.doctores != undefined) {
  const thisLocal = this;
  this.doctores.forEach(function (elem, index) {
    if (elem._id == idDoctor) {
      thisLocal.doctorSeleccionado = elem;
    }
  });
}
}

ngOnDestroy() {

  this.router.dispose();
  this.turnosSocketService = null;
  // this.pacientesService = null;
}

}
