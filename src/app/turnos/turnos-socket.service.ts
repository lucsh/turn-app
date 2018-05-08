import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import * as io from "socket.io-client";
import * as moment from "moment";
import { environment } from "../../environments/environment";

declare var feathers: any;
declare var feathersClient: any;
import * as feathersRx from "feathers-reactive";
import * as hooks from "feathers-hooks";
import * as Rx from "rxjs";
import * as authentication from "feathers-authentication-client";

import { Turno } from "./turno.tipo";
import { Feathers } from "../authentication/feathers.service";
import { Obra } from "../shared/models/obra.tipo";

declare var $: any;

@Injectable()
export class TurnoSocketService {
  private urlServidor = environment.apiUrl;

  public turnos$: Observable<Turno[]>;
  private turnosObserver: Observer<Turno[]>;

  private turnosSocketService: any;

  private dataStore: {
    turnos: Turno[];
  };

  private idDoctor: string;
  private socket;

  private feathersApp;

  public desde = null;
  public hasta = null;

  private feathersService;

  constructor(private FeathersCambiarNombre: Feathers) {
    // Estamos usando el Service de Feathers, pues el que tiene la autenticacion del login
    this.feathersService = FeathersCambiarNombre.devolverFeathers();
    // Obtenemos el service que queremos
    this.turnosSocketService = this.feathersService.service("turnos");

    // Registramos eventos
    this.turnosSocketService.on("created", turno => this.onCreated(turno));
    this.turnosSocketService.on("updated", turno => this.onUpdated(turno));
    this.turnosSocketService.on("removed", turno => this.onRemoved(turno));
    this.turnosSocketService.on("patched", turno => this.onPatched(turno));

    this.turnos$ = new Observable(observer => {
      this.turnosObserver = observer;
    });
    this.dataStore = { turnos: [] };
  }

  public setMedico(id) {
    this.idDoctor = id;
  }

  // -------------------------------------------------------------------------

  public obtenerTurnosRango(desde, hasta) {
    this.find(desde, hasta);
  }

  public obtenerTurnosActivosPaciente(id): Promise<any> {
    const horaActual = moment(new Date())
      .subtract(3, "h")
      .toISOString();

    return this.turnosSocketService
      .find({
        query: {
          // matricula: m MOREMROE
          paciente: id,
          horaInicial: { $gte: horaActual }
        }
      })
      .then(turnos => {
        return turnos;
      })
      .catch(err => {
        console.error(err);
        console.log("ocurrio un error en el find de turnos");
      });
  }

  public cambiarMedico(id) {
    this.setMedico(id);
  }

  public cleanService() {
    this.socket.disconnect();
    this.turnosSocketService = null;
    this.turnos$ = null;
    this.dataStore = { turnos: [] };
  }

  /*
  Grafica el turno que llega por parametro.
  */

  private actualizarVisual(turno) {
    // let horaInicial = turno.horaInicial.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.
    const horaInicial = turno.horaInicial;
    // let horaFin = turno.horaFin.split('.')[0]; //Transformo la fecha sacandole LA ZONA HORARIA para que no explote el calendario.
    const horaFin = turno.horaFin;
    // Le agregue el ID al final del nuevo turno para asi poder saber a que objeto corresponde cada evento grafico

    let descripcion = "";

    if (turno.descripcion) {
      //Pregunto si tiene descripcion, si es asi, la atacho.
      descripcion = " | " + turno.descripcion;
    } else {
      //En el caso negativo, esto se da porque deberia ser un turno reserva (y con el formato viejo).
      if (turno.descripcionReserva) {
        //Igualmente, por las dudas pregunto si tiene descripcion reserva, ya que puede pasar que no tenga ninguna de las 2
        descripcion = turno.descripcionReserva;
      }
    }
    let obraTurno = " ";
    if (turno.obra) {
      obraTurno = " | " + turno.obra.nombre;
    }

    if (turno.esReserva) {
      // Es una reserva de horario SIN paciente

      const newTurno = {
        title: descripcion,
        allDay: false,
        start: horaInicial,
        end: horaFin,
        color: "#a1c0dd",
        _id: turno._id,
        id: turno._id
      };

      $("#calendar").fullCalendar("renderEvent", newTurno, true);
    } else {
      // TODO: Quitar. Obsoleto
      // Proteger pacientes sin obra
      // let obraIniciales = "";
      // if (turno.paciente.obra == null) {
      //   obraIniciales = "Particular";
      // } else {
      //   obraIniciales = turno.paciente.obra.iniciales;
      // }

      // Es una consulta medica
      const newTurno = {
        title:
          turno.paciente.apellido +
          " " +
          turno.paciente.nombre +
          obraTurno +
          " | " +
          turno.paciente.telefono +
          descripcion,
        allDay: false,
        start: horaInicial,
        end: horaFin,
        color: "#f8ac59",
        _id: turno._id,
        id: turno._id
      };

      $("#calendar").fullCalendar("renderEvent", newTurno, true);
    }
  }

  // -------------------------------------------------------------------------
  // Metodos principales

  public crearTurno(fecha: Date, pacienteAsignado, pagoConsulta, duracion) {
    const paciente = pacienteAsignado;

    // El color depende del medico al que le estoy cargando el turno
    const color = "#f8ac59";

    // Windows: descomentar la linea de abajo
    // var temp = moment(fecha).utc().add(15, 'm');
    // LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO

    // LINUX: descomentar la linea de abajo
    // LO QUE ESTOY HACIENDO ACA ES HACER TURNOS DE 15 MINUTOS! ESE 15 DEBE SER POR MEDICOOOOOOOO
    const temp = moment(fecha, "YYYY-MM-DDTHH:mm:ss Z").add(duracion, "m");

    // let nuevaFecha = temp.utc().format('YYYY-MM-DDTHH:mm:ss'); //Le saco a la fecha la zona horaria!
    const nuevaFecha = temp.format("YYYY-MM-DDTHH:mm:ss"); // Le saco a la fecha la zona horaria!

    const nuevoTurno = {
      horaInicial: fecha,
      horaFin: nuevaFecha,
      medico: this.idDoctor,
      estado: "pendiente",
      paciente: paciente._id,
      descripcion: paciente.descripcion,
      obra: pagoConsulta._id
    };

    return this.turnosSocketService.create(nuevoTurno);
  }

  public crearTurnoConFin(fechaIni, fechaFin, pacienteAsignado) {
    const paciente = pacienteAsignado;

    const color = "#f8ac59";
    fechaIni = moment(fechaIni)
      .utc()
      .subtract(3, "h"); // Lo que estoy haciendo aca es homogenizar a UTC y sacarle 3 horas
    fechaFin = moment(fechaFin)
      .utc()
      .subtract(3, "h"); // Lo que estoy haciendo aca es homogenizar a UTC y sacarle 3 horas

    const nuevaFechaIni = fechaIni.format("YYYY-MM-DDTHH:mm:ss"); // Le saco a la fecha la zona horaria!
    const nuevaFechaFin = fechaFin.format("YYYY-MM-DDTHH:mm:ss"); // Le saco a la fecha la zona horaria!
    const nuevoTurno = {
      horaInicial: nuevaFechaIni,
      horaFin: nuevaFechaFin,
      medico: this.idDoctor,
      estado: "pendiente",
      paciente: paciente._id
    };

    this.turnosSocketService.create(nuevoTurno).then(turnoNuevo => {});
  }

  public reservarHorario(fecha, descripcion) {
    const temp = moment(fecha, "YYYY-MM-DDTHH:mm:ss Z").add(10, "m");

    // let nuevaFecha = temp.utc().format('YYYY-MM-DDTHH:mm:ss'); //Le saco a la fecha la zona horaria!
    const nuevaFecha = temp.format("YYYY-MM-DDTHH:mm:ss"); // Le saco a la fecha la zona horaria!

    const reserva = {
      horaInicial: fecha,
      horaFin: nuevaFecha,
      medico: this.idDoctor,
      estado: "pendiente",
      esReserva: true,
      descripcion: descripcion
    };

    this.turnosSocketService.create(reserva).then(nuevaReserva => {});
  }

  public cancelarReserva(reserva) {
    this.turnosSocketService.remove(reserva._id).then(reservaEliminada => {});
  }

  public actualizarTurno(turno) {
    const newHoraInicial = turno.start.format();
    const newHoraFin = turno.end.format();
    const id = turno._id;
    this.turnosSocketService
      .patch(id, { horaInicial: newHoraInicial, horaFin: newHoraFin })
      .then(turnoActualizado => {});
  }
  public actualizarTurno2(start, end, idTurno) {
    const newHoraInicial = start.format();
    const newHoraFin = end.format();
    const id = idTurno;
    this.turnosSocketService
      .patch(id, { horaInicial: newHoraInicial, horaFin: newHoraFin })
      .then(turnoActualizado => {});
  }

  public eliminarTurno(idTurno) {
    return this.turnosSocketService.remove(idTurno);
  }

  public find(desde, hasta) {
    const idMedico = this.idDoctor.toString();
    this.turnosSocketService
      .find({
        query: {
          // matricula: m
          medico: idMedico,
          horaInicial: { $gte: desde },
          horaFin: { $lte: hasta }
        }
      })
      .then(turnos => {
        this.dataStore.turnos = turnos;

        // Limpiamos los eventos para evitar repetidos
        const calendario = $("#calendar");
        calendario.fullCalendar("removeEvents");

        for (let i = 0; i < turnos.length; i++) {
          this.actualizarVisual(turnos[i]);
        }

        this.turnosObserver.next(this.dataStore.turnos);
      })
      .catch(err => {
        console.error(err);
        console.log("ocurrio un error en el find de turnos");
      });
  }

  private getIndex(id: string): number {
    let foundIndex = -1;

    for (let i = 0; i < this.dataStore.turnos.length; i++) {
      if (this.dataStore.turnos[i]._id === id) {
        foundIndex = i;
      }
    }

    return foundIndex;
    // return 0;
  }

  // -------------------------------------------------------------------------
  // Metodos de recepcion de eventos de sockets

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
  */
  private onCreated(turno: any) {
    // El nuevo turno es del DOCTOR actual
    if (turno.medico._id.toString() === this.idDoctor) {
      this.dataStore.turnos.push(turno);
      // lo pusheo al calendar
      this.actualizarVisual(turno);
      this.turnosObserver.next(this.dataStore.turnos);
    }
  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
  */
  private onUpdated(turno: Turno) {
    // El nuevo turno es del DOCTOR actual
    if (turno.medico._id.toString() === this.idDoctor) {
      const index = this.getIndex(turno._id);

      this.dataStore.turnos[index] = turno;

      this.turnosObserver.next(this.dataStore.turnos);
    }
  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
  */
  private onRemoved(turno: Turno) {
    // El nuevo turno es del DOCTOR actual
    if (turno.medico._id.toString() === this.idDoctor) {
      const index = this.getIndex(turno._id);

      const eventosCalendario = $("#calendar").fullCalendar("clientEvents");

      this.dataStore.turnos.splice(index, 1);
      this.turnosObserver.next(this.dataStore.turnos);
      $("#calendar").fullCalendar("removeEvents", turno._id); // Esto elimina el evento (grafico) con el id = turno._id
    }
  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
  */

  private onPatched(turno) {
    // El nuevo turno es del DOCTOR actual
    if (turno.medico._id.toString() === this.idDoctor) {
      const id = turno._id;

      $("#calendar").fullCalendar("removeEvents", turno._id); // Esto elimina el evento (grafico) con el id = turno._id
      this.actualizarVisual(turno); //
    }
  }

  /*
  Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
  */
  ngOnDestroy() {
    // Removemos todos los eventos asociados a 'turnos' de este socket. Esto se debe a que se crean varias instancias a lo largo del sistema
    this.turnosSocketService.removeAllListeners("created");
    this.turnosSocketService.removeAllListeners("updated");
    this.turnosSocketService.removeAllListeners("removed");
    this.turnosSocketService.removeAllListeners("patched");
  }
}
