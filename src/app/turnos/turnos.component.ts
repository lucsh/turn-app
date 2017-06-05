import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TurnosService } from './turnos.service';


declare var $: any;

@Component({
	selector: 'turnos',
	templateUrl: './turnos.component.html',
	styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

	url: string;
	doctores: string[];
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
			defaultDate: '2017-05-12',
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: [
			{
				title: 'All Day Event',
				start: '2017-05-01'
			},
			{
				title: 'Long Event',
				start: '2017-05-07',
				end: '2017-05-10'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2017-05-09T16:00:00'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2017-05-16T16:00:00'
			},
			{
				title: 'Conference',
				start: '2017-05-11',
				end: '2017-05-13'
			},
			{
				title: 'Meeting',
				start: '2017-05-12T10:30:00',
				end: '2017-05-12T12:30:00'
			},
			{
				title: 'Lunch',
				start: '2017-05-12T12:00:00'
			},
			{
				title: 'Meeting',
				start: '2017-05-12T14:30:00'
			},
			{
				title: 'Happy Hour',
				start: '2017-05-12T17:30:00'
			},
			{
				title: 'Dinner',
				start: '2017-05-12T20:00:00'
			},
			{
				title: 'Birthday Party',
				start: '2017-05-13T07:00:00'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2017-05-28'
			}
			]
		});
	}

	constructor(route: ActivatedRoute,private turnosService: TurnosService) {
		this.url = route.snapshot.params['doctor'];
	}
	verificarUrl(){

		//console.log (this.doctores.find(doctor => doctor.url == "FRomero"));
		// ^^ Supongo que no funciona por el tipo.

		console.log(this.doctores)

	}

	getAllDoctores(){
		this.turnosService.getDoctores()
		.subscribe(
			data => this.doctores = data,
			error => console.log('Server Error'),
			() => this.verificarUrl() //GG promise
			);
	}

	ngOnInit() {
		this.getAllDoctores()
		this.loadCalendar()
	}

}
