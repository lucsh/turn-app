import { Component, OnInit } from '@angular/core';
import { PacientesDelDiaService} from './pacientes-del-dia.service';
import { Subscription } from 'rxjs/Subscription';
import {Turno} from '../turnos/turno.tipo';
import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-pacientes-del-dia',
  providers:[PacientesDelDiaService],
  templateUrl: './pacientes-del-dia.component.html',
  styleUrls: ['./pacientes-del-dia.component.css']
})
export class PacientesDelDiaComponent implements OnInit {

  private subscription: Subscription;
  private ordenados: boolean = false;
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
  constructor(private pacienteDelDiaService : PacientesDelDiaService,private ref: ChangeDetectorRef) { }

  claseEstadoTurno(status){
    // ////console.log("### ESTADO TURNO ###")
    // ////console.log(status);
    var clase = "btn-default";
    for (var i in this.estadosTurnos) {
      if (status == this.estadosTurnos[i].nombre){
        clase = "btn-" + this.estadosTurnos[i].clase;
      }
    }

    return clase
  }

  aDate(turno){
    ////console.log(turno);

    //En Windows:
    //var momentDate = moment(turno);

    //En Linux: UTC
    var momentDate = moment(turno,'YYYY-MM-DDTHH:mm:ss');
    var fecha = momentDate.toDate();
    return fecha
  }

  updateTurno(turno,estado){
    // ////console.log(turno);
    // ////console.log(estado);
    turno.estado=estado;

    this.pacienteDelDiaService.updateTurno(turno,estado);
    // this.dashboardService.updateCita(cita).subscribe(
    //   data => {
    //     this.getAllTodos();
    // });

  }

  ngOnInit() {

    this.subscription = this.pacienteDelDiaService.turnos$.subscribe((turnos: Turno[]) => {
        this.ordenados = false;
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

    this.pacienteDelDiaService.buscarTurnos();
  }

}
