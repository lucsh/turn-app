import { Component, OnInit } from '@angular/core';

import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';


import { TurnosService } from './turnos.service';
import { DoctoresService } from './doctores.service';

import * as moment from 'moment';


import { Doctor } from './doctor.tipo';
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

export class TurnosComponent implements OnInit {

	url: string;
	matricula: string;

	doctores: Doctor[];
	turnos: Turno[];

	 private subscription: Subscription;

	constructor(route: ActivatedRoute,private turnosService: TurnosService,private doctoresService: DoctoresService,
		private turnosSocketService : TurnoSocketService,
		private router: Router,
	   private ref: ChangeDetectorRef
	) {
		this.url = route.snapshot.params['doctor'];
		this.matricula = route.snapshot.params['matricula'];
		let yo = this;

		this.turnosSocketService.iniciar(this.matricula);

		router.events.forEach((event) => {
		    if(event instanceof NavigationStart) {
				//console.log('Entre en el IF');
				//console.log(event.url);

				let matriucla = event.url.split('/',4)[3];
				//console.log(matriucla);
        yo.metodoLimpieza(matriucla);
				yo.loadCalendar(matriucla);

		    }
		    // NavigationEnd
		    // NavigationCancel
		    // NavigationError
		    // RoutesRecognized
		  });

	//	this.turnosSocketService.setComponent(this);
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
			defaultView:'agendaWeek',
			weekends: false,
			allDaySlot:false,
			slotDuration:'00:15:00',//deberia ser dinamico, dependiendo del medico (doctor.turno) al menos para la vista de clientes
			minTime:'09:00:00',
			maxTime:'18:00:00',
			defaultDate: new Date(),
			navLinks: true, // can click day/week names to navigate views
			editable: true, //falso para la vista de clientes
			eventLimit: true, // allow "more" link when too many events
			events: this.turnos,
			dayClick: function(date, jsEvent, view) {
				console.log('Clicked on: ' + date.format());

				//tengo que pedir el nombre del paciente y verificar que exista
				var paciente = 'Nuevo Paciente';
				//El color depende del medico al que le estoy cargando el turno
				var color = '#f8ac59';

				yo.turnosSocketService.GILADA();

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
          console.log(event);
          console.log("#########");
  				console.log(event.start.format()); // Es la nueva hora de inicio del evento
  				console.log(event.end.format()); // Es la nueva hora de fin del evento

          yo.turnosSocketService.temporalActualizar(event);
        }
			},
			eventResize: function(event, delta, revertFunc) {
				//revertFunc();
				console.log(event);
        if (!confirm("¿Estas seguro que queres cambiar el turno?")) {
					//ToDO SweetAlert
					revertFunc();
				}else{

          yo.turnosSocketService.temporalActualizar(event);
        }

				//actualizar el turno en la db (tenemos el event.id)
				//???
			}
		});







	}

  metodoLimpieza(matricula){
    //Limpiamos el calendario
		// calendario.fullCalendar( 'destroy' );
    let calendario = $('#calendar');
		calendario.fullCalendar( 'removeEvents' );


		//Limpiamos el service
		this.turnosSocketService.cambiarMedico(matricula);
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

}
