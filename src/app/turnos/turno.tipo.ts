export class Turno {
	// id:string;
    _id: string;
    title: string;
    allDay: boolean;
	// start:Date;
	// end:Date;
    horaInicial: Date;
    horaFin: Date;
    paciente: any; // dsps hay que hacer la referencia con el tipo Paciente
    medico: any; // dsps hay que hacer la referencia con el tipo Paciente
    color: string; // el color depende del medico, para poder hacer una vista de todos los turnos dados y para que sea facil identificar cada uno de los calendarios.
}
