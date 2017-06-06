import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnosService } from './turnos.service';
import { DoctoresService } from './doctores.service';

import * as moment from 'moment';


import { Doctor } from './doctor.tipo';
import { Turno } from './turno.tipo';

declare var $: any;

@Component({
	selector: 'turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})

export class TurnosComponent implements OnInit {

	url: string;

	doctores: Doctor[];
	turnos: Turno[];

	loadCalendar(){
		$('#calendar')
		//.addClass("done");
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
			slotDuration:'00:15:00',//deberia ser dinamico, dependiendo del medico al menos para la vista de clientes
			minTime:'09:00:00',
			maxTime:'18:00:00',
			defaultDate: '2017-06-06',
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: this.turnos,
			dayClick: function(date, jsEvent, view) {
				console.log('Clicked on: ' + date.format());

				//tengo que pedir el nombre del paciente y verificar que exista
				var paciente = 'Nuevo Paciente';
				//El color depende del medico al que le estoy cargando el turno
				var color = '#f8ac59';

				//creo el obj
				var newTurno = {"title":paciente,"allDay":false,"start":date.format(),"end":date.add(30, 'm').format(),"color":color};
				//lo pusheo al calendar
				$('#calendar').fullCalendar('renderEvent', newTurno, true)
				//lo guardo en la db
				// ???

			},
			eventDrop: function(event, delta, revertFunc) {
				if (!confirm("¿Estas seguro que queres cambiar el turno?")) {
					revertFunc();
				}
			},
			eventResize: function(event, delta, revertFunc) {
				//revertFunc();
				console.log(event)
				//actualizar el turno en la db (tenemos el event.id)
				//???
			}
		});
	}

	constructor(route: ActivatedRoute,private turnosService: TurnosService,private doctoresService: DoctoresService) {
		this.url = route.snapshot.params['doctor'];
	}
	verificarUrl(){

		console.log(this.url);
		console.log (this.doctores.find(doctor => doctor.url == "this.url"));
		console.log(this.doctores);

	}
	/*
	getAllDoctores(){
		this.turnosService.getDoctores()
		.subscribe(
			data => this.doctores = data,
			error => console.log('Server Error'),
			() => this.verificarUrl() //GG promise
			);
	}
	*/

	getAllDoctores(): void {
		this.doctoresService
		.getDoctores()
		.then(docs => {
			this.doctores = docs;
			this.verificarUrl();
			this.getAllTurnos(this.url)
		});
	}
	getAllTurnos(url): void {
		console.log(url)//parametro para la consulta
		this.turnosService
		.getTurnos()
		.then(docs => {
			this.turnos = docs;
			this.loadCalendar()
		});
	}


	ngOnInit() {
		this.getAllDoctores()
	}

}
