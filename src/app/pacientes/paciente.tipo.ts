export class Paciente{
	_id: string;
	numeroPaciente: string;
	email: string;
	dni: string;
	nombre: string;
	apellido: string;
	fechaNacimiento: string;
	telefono: string;
	estado: string;
	obra: string; // Debemos agregar una referencia a Obra Social
	sancion: boolean;
	eliminado: boolean;
	aprobado: boolean;
}
