import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

declare var feathers: any;


import { Turno } from '../turnos/turno.tipo';
import { environment } from '../../environments/environment';
import { Feathers } from '../authentication/feathers.service';

import Notificacion from '../notificaciones-nativas/notificaciones';

declare var $: any;


@Injectable()
export class TurnosDelMedicoService {

  private urlServidor = environment.apiUrl;

  public turnos$: Observable<Turno[]>;
  private turnosObserver: Observer<Turno[]>;

  private turnosService: any;

  private dataStore: {
    turnos: Turno[]
  };

  private notificaciones: any;


  private feathersService;
  private socket;

  private miMatricula: String;
  constructor(private FeathersCambiarNombre: Feathers) {

    // Obtenemos el service que queremos
    this.feathersService = FeathersCambiarNombre.devolverFeathers();
    this.turnosService = this.feathersService.service('turnos');


    // Registramos eventos
    this.turnosService.on('created', (turno) => this.onCreated(turno));
    this.turnosService.on('updated', (turno) => this.onUpdated(turno));
    this.turnosService.on('removed', (turno) => this.onRemoved(turno));
    this.turnosService.on('patched', (turno) => this.onPatched(turno));


    this.turnos$ = new Observable((observer) => {
      this.turnosObserver = observer;
    });

    this.dataStore = { turnos: [] };
  }



  public buscarTurnos(miMatricula: String, idMedico) {
    this.miMatricula = miMatricula;

    const fechaHoy = new Date();
    // let temp = moment(fechaHoy).subtract(1,'days').format('YYYY-MM-DD');
    const temp = moment(fechaHoy).format('YYYY-MM-DD');
    const temp2 = moment(temp, 'YYYY-MM-DD').add(1, 'days');
    const temp3 = (moment(temp2).format('YYYY-MM-DD'));

    this.turnosService.find({
      query: {
        horaInicial: {
          $gt: temp,
          $lt: temp3
        },
        medico: idMedico,
        $populate: 'paciente medico'
      }
    }).then((turnos) => {

      this.dataStore.turnos = turnos;

      this.turnosObserver.next(this.dataStore.turnos);
    }).catch(err => console.error(err));
  }


  public updateTurno(turno, nuevoEstado) {
    const now = new Date();
    const nueva = moment(now).utc();

    this.turnosService.patch(turno._id, { 'estado': nuevoEstado, 'horaUltimoCambio': nueva }).then((turnoActualizado) => {

    }).catch(err => console.error(err));
  }

  private getIndex(id: string): number {
    let foundIndex = -1;

    for (let i = 0; i < this.dataStore.turnos.length; i++) {
      if (this.dataStore.turnos[i]._id === id) {
        foundIndex = i;
      }
    }

    return foundIndex;
  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onCreated'
  */
  private onCreated(turno: any) {

    if (this.miMatricula === turno.medico.matricula) {
      /*
      IMPORTANTE:
      Si hay algun problema, posiblemente haya que sumar +3horas a turnoDate O restar -3horas a diaHoy
      */

      const hoy = moment(new Date());
      const momentHoy = hoy.format('YYYY-MM-DD');
      const diaHoy = (momentHoy.split('-'))[2]; // DD

      const turnoDate = moment(new Date(turno.horaInicial));
      const momentTurno = turnoDate.format('YYYY-MM-DD');
      const diaTurno = (momentTurno.split('-'))[2]; // DD


      // NO BORRAR: if( turnoDate.valueOf() >= hoy.valueOf()){

      // No aseguramos que SI O SI pertenezca a hoy
      if (diaTurno == diaHoy && hoy.month() == turnoDate.month()) {
        // console.log('Esto es lo que queriamos!');

        this.dataStore.turnos.push(turno);
        // Lo pusheo al componente
        this.turnosObserver.next(this.dataStore.turnos);
      }
      // }


    }

  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
  */
  private onUpdated(turno: Turno) {
    const index = this.getIndex(turno._id);

    if (index > -1) {
      this.dataStore.turnos[index] = turno;

      this.turnosObserver.next(this.dataStore.turnos);
    }

  }


  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
  */
  private onRemoved(turno: Turno) {
    const index = this.getIndex(turno._id);

    if (index > -1) {
      this.dataStore.turnos.splice(index, 1);

      this.turnosObserver.next(this.dataStore.turnos);
    }

  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
  */

  private onPatched(turno) {

    const indexTurno = this.buscarIndexTurno(turno);

    if (indexTurno > -1) {

      const turnoAnterior: any = this.dataStore.turnos[indexTurno];

      //El medico esta llamando un nuevo paciente
      if (turnoAnterior.estado != 'en espera' && turno.estado == 'en espera') {
        this.notificarPacienteEspera(turno.paciente);
      }
      this.dataStore.turnos[indexTurno] = turno;
    }



  }

  /*
  Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
  */
  ngOnDestroy() {

    //this.socket.close();
    //this.socket.disconnect();
    //this.turnosObserver = null;
  }


  public asignarNotificaciones(notificaciones) {
    this.notificaciones = notificaciones;
  }

  notificarPacienteEspera(paciente) {
    this.notificaciones.info(
      'El paciente ' + paciente.nombre + ' ' + paciente.apellido + ' se encuentra en sala de espera'
    );
    const notificar = new Notificacion();
    notificar.send(paciente.nombre + ' ' + paciente.apellido, 'se encuentra en sala de espera');
  }

  //Metodos auxiliares
  private buscarIndexTurno(turno): number {
    let indexTurno = -1;

    const turnos = this.dataStore.turnos;
    // ////console.log(turnos);

    turnos.forEach(function (elem, index) {
      if (elem._id.toString() == turno._id.toString()) {

        indexTurno = index;
      }
    });

    return indexTurno;
  }
}
