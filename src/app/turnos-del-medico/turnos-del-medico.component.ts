import { Component, OnInit } from '@angular/core';
import { TurnosDelMedicoService} from './turnos-del-medico.service';
import { Subscription } from 'rxjs/Subscription';
import {Turno} from '../turnos/turno.tipo';
import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications';
import { NativeNotificationService } from 'angular-notice/lib/native-notification.service';

@Component({
  selector: 'app-turnos-del-medico',
  providers:[TurnosDelMedicoService, NotificationsService],
  templateUrl: './turnos-del-medico.component.html',
  styleUrls: ['./turnos-del-medico.component.css']
})
export class TurnosDelMedicoComponent implements OnInit {

  private subscription: Subscription;
  public ordenados: boolean = false;
  estadosTurnos:any[] =  [
    {
      "id": 1,
      "nombre": "en espera",
      "clase": "warning"
    },
    {
      "id": 2,
      "nombre": "pendiente",
      "clase": "default"
    },
    {
      "id": 3,
      "nombre": "finalizado",
      "clase": "danger"
    },
    {
      "id": 4,
      "nombre": "activo",
      "clase": "success"
    },
    {
      "id": 5,
      "nombre": "otro",
      "clase": "info"
    },
    {
        "id": 6,
        "nombre": "en estudio",
        "clase": "info"
    }
  ];
  turnos: Turno[];
  private miMatricula: String;
  private medicoId: String;

  //Opciones de las notificiones
  public options = {
       position: ["top", "right"],
      //  timeOut: 5000,
       showProgressBar: false,
       animate: "fromRight",
       lastOnBottom: false,
   };
  constructor(private turnosDelMedicoService : TurnosDelMedicoService,private ref: ChangeDetectorRef,
    private notificacionesService: NotificationsService,
    private notificacionesNativasService: NativeNotificationService) { }


  /* Metodo para asignar la visual de los desplegables de la visual */
  claseEstadoTurno(status){
    var clase = "btn-default";
    for (var i in this.estadosTurnos) {
      if (status == this.estadosTurnos[i].nombre){
        clase = "btn-" + this.estadosTurnos[i].clase;
      }
    }

    return clase
  }

  /* Metodo para armar un objeto fechas. tiene las alternativas de ambos SO trabajados en el desarrollo */
  aDate(turno){

    //En Windows:
    //var momentDate = moment(turno);

    //En Linux: UTC
    var momentDate = moment(turno,'YYYY-MM-DDTHH:mm:ss');
    var fecha = momentDate.toDate();
    return fecha
  }


  updateTurno(turno,estado){
    turno.estado=estado;

    this.turnosDelMedicoService.updateTurno(turno,estado);

  }

  public llamarPaciente(turno){
    this.turnosDelMedicoService.updateTurno(turno,"activo");
  }

  public finalizarTurno(turno){
    this.turnosDelMedicoService.updateTurno(turno,"finalizado");
  }

  public ponerEnEstudio(turno){
    this.turnosDelMedicoService.updateTurno(turno,"en estudio");
  }

  public comprobarEstado(turno): Boolean{
    let bandera = false;
    if(turno.estado === 'en espera' || turno.estado === 'en estudio'){
      bandera = true;
    }
    return bandera;
  }

  ngOnInit() {

    var medico: any = JSON.parse(localStorage.getItem('user'));
    this.ordenados = false;
    if (medico.clase === "medico"){
      this.miMatricula = medico.matricula;
      this.medicoId = medico._idMedico;

      this.turnosDelMedicoService.asignarNotificaciones(this.notificacionesService);
      this.turnosDelMedicoService.asignarNotificacionesNativas(this.notificacionesNativasService);
      
      this.subscription = this.turnosDelMedicoService.turnos$.subscribe((turnos: Turno[]) => {
          this.turnos = turnos;
          this.ref.markForCheck();
          this.turnos.sort(function(a, b){

            let c = new Date(a.horaInicial);
            let d = new Date(b.horaInicial)
            let comparacion = c.getTime() - d.getTime();

            return (comparacion)

          });
          this.ordenados = true;
      }, (err) => {
          console.error(err);
      });

      this.turnosDelMedicoService.buscarTurnos(this.miMatricula, this.medicoId);
    }
  }

}
