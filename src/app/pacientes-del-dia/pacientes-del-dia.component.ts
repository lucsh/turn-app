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
  estadosTurnos:any[] =  [
    {
      "id": 1,
      "nombre": "en espera",
      "clase": "warning"
    },
    {
      "id": 2,
      "nombre": "cancelado",
      "clase": "danger"
    },
    {
      "id": 3,
      "nombre": "pendiente",
      "clase": "default"
    },
    {
      "id": 4,
      "nombre": "finalizado",
      "clase": "success"
    },
    {
      "id": 5,
      "nombre": "otro",
      "clase": "info"
    }
  ];
  turnos: Turno[];
  constructor(private pacienteDelDiaService : PacientesDelDiaService,private ref: ChangeDetectorRef) { }

  claseEstadoTurno(status){
    // console.log("### ESTADO TURNO ###")
    // console.log(status);
    var clase = "btn-default";
    for (var i in this.estadosTurnos) {
      if (status == this.estadosTurnos[i].nombre){
        clase = "btn-" + this.estadosTurnos[i].clase;
      }
    }

    return clase
  }

  aDate(turno){
    var momentDate = moment(turno);
    var fecha = momentDate.toDate();
    return fecha
  }

  updateTurno(turno,estado){
    // console.log(turno);
    // console.log(estado);
    turno.estado=estado;

    this.pacienteDelDiaService.updateTurno(turno,estado);
    // this.dashboardService.updateCita(cita).subscribe(
    //   data => {
    //     this.getAllTodos();
    // });

  }

  ngOnInit() {

    this.subscription = this.pacienteDelDiaService.turnos$.subscribe((turnos: Turno[]) => {
        this.turnos = turnos;
        this.ref.markForCheck();
    }, (err) => {
        console.error(err);
    });

    this.pacienteDelDiaService.buscarTurnos();
  }

}