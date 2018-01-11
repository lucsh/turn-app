import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as io from 'socket.io-client';
import * as moment from 'moment';
//import * as feathers from 'feathers-client';

declare var feathers:any;

import { NativeNotificationService } from 'angular-notice/lib/native-notification.service';

import { Turno } from '../turnos/turno.tipo';
import { environment } from '../../environments/environment';
import { Feathers } from '../authentication/feathers.service'



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

  private notificaciones:any;
  private notificacionesNativas:any;

  //private matricula: string;
  private feathersService;
  private socket;

  private miMatricula: String;
  constructor(private FeathersCambiarNombre: Feathers) {
    //this.socket = io(this.urlServidor);
    //const feathersApp = feathers().configure(feathers.socketio(this.socket));

    //Obtenemos el service que queremos
    this.feathersService = FeathersCambiarNombre.devolverFeathers();
    this.turnosService = this.feathersService.service('turnos');


    //Registramos eventos
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

    let fechaHoy = new Date();
    // let temp = moment(fechaHoy).subtract(1,'days').format('YYYY-MM-DD');
    let temp = moment(fechaHoy).format('YYYY-MM-DD');
    let temp2 = moment(temp, "YYYY-MM-DD").add(1, 'days');
    let temp3 = (moment(temp2).format('YYYY-MM-DD'));

    this.turnosService.find({
      query: {
        horaInicial: {
          $gt: temp,
          $lt: temp3
        },
        medico: idMedico,
        $populate: 'paciente medico' //'paciente medico'
      }
    }).then((turnos) => {

      // Protegemos que sean turnos y no turnos-reservas de los medicos
      let consultasMedicas = turnos.filter((t) => { return !t.esReserva });

      this.dataStore.turnos = consultasMedicas;
      this.turnosObserver.next(this.dataStore.turnos);
    }).catch(err => console.error(err));
  }


  public updateTurno(turno, nuevoEstado){
    var now = new Date();
    var nueva = moment(now).utc();

    this.turnosService.patch(turno._id,{"estado": nuevoEstado, "horaUltimoCambio": nueva }).then((turnoActualizado) => {

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
  private onCreated(turno: any) { //REMPLAZR EL ANY CON TURNO!

    if(this.miMatricula === turno.medico.matricula && !turno.esReserva){
      /*
      IMPORTANTE:
      Si hay algun problema, posiblemente haya que sumar +3horas a turnoDate O restar -3horas a diaHoy
      */

      let hoy = moment(new Date());
      let momentHoy = hoy.format('YYYY-MM-DD');
      let diaHoy = (momentHoy.split('-'))[2]; // DD

      let turnoDate = moment(new Date(turno.horaInicial));
      let momentTurno = turnoDate.format('YYYY-MM-DD');
      let diaTurno = (momentTurno.split('-'))[2]; // DD


      // NO BORRAR: if( turnoDate.valueOf() >= hoy.valueOf()){

      // No aseguramos que SI O SI pertenezca a hoy
      if(diaTurno == diaHoy && hoy.month() == turnoDate.month()) {
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

    if(index > -1){
      this.dataStore.turnos[index] = turno;

      this.turnosObserver.next(this.dataStore.turnos);
    }

  }


  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onRemoved'
  */
  private onRemoved(turno: Turno) {
    const index = this.getIndex(turno._id);

    if(index > -1){
      this.dataStore.turnos.splice(index, 1);

      this.turnosObserver.next(this.dataStore.turnos);
    }

  }

  /*
  Este metodo va a ser llamado cada vez que alguien (desde aca o desde el server) emita ese evento 'onUpdated'
  */

  private onPatched(turno){

    let indexTurno = this.buscarIndexTurno(turno);

    if(indexTurno > -1){

      let turnoAnterior:any = this.dataStore.turnos[indexTurno];

      //El medico esta llamando un nuevo paciente
      if(turnoAnterior.estado !='en espera' && turno.estado == 'en espera'){
        this.notificarPacienteEspera(turno.paciente);
      }
      this.dataStore.turnos[indexTurno] = turno;
    }



  }

  /*
  Al destruirse el servicio, se debe cerrar el socket y borrar el observable del mismo.
  */
  ngOnDestroy(){

    //this.socket.close();
    //this.socket.disconnect();
    //this.turnosObserver = null;
  }


  public asignarNotificaciones(notificaciones){
    this.notificaciones = notificaciones;
  }  
  public asignarNotificacionesNativas(notificacionesNativas){
    this.notificacionesNativas = notificacionesNativas;
  }


  notificarPacienteEspera(paciente) {
    this.notificaciones.info(
      'El paciente ' + paciente.nombre + ' ' + paciente.apellido + ' se encuentra en sala de espera'
    )
      const opcionesNN =  { 
                  title: 'Paciente en espera',
                  body : paciente.nombre + ' ' + paciente.apellido,
                  icon: '../assets/imagenes/notif.png',
                  tag: 'notice',
                  renotify:true,
                  requireInteraction :true,
                  vibrate: [200, 100, 200],
                  closeDelay: 10000
              };
  this.notificacionesNativas.notify(opcionesNN);
  }

  //Metodos auxiliares
  private buscarIndexTurno(turno): number{
    let indexTurno = -1;

    let turnos = this.dataStore.turnos;
    // ////console.log(turnos);

    turnos.forEach(function(elem,index){
      if(elem._id.toString() == turno._id.toString()){

        indexTurno = index;
      }
    });

    return indexTurno;
  }
}
