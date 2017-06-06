export class Turno{
	id:string;
	title:string;
	allDay:boolean;
	start:Date;
	end:Date;
	color:string; //el color depende del medico, para poder hacer una vista de todos los turnos dados y para que sea facil identificar cada uno de los calendarios.
}