import { Component, OnInit } from '@angular/core';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';

import * as moment from 'moment';

import { Subscription } from 'rxjs/Subscription';
import { SolicitudesSocketService } from './solicitudes-socket.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  public solicitudes: any[] = [];
  private subscription: Subscription;

  constructor(
    private solicitudesService : SolicitudesSocketService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this.solicitudesService.solicitudes$.subscribe((pacientesEnSolicitud: any[]) => {
      this.solicitudes = pacientesEnSolicitud;
      this.ref.markForCheck();
    }, (err) => {
      console.error(err);
    });


  }

  abrirSolicitud(){
    console.log('Abriendo la solicitud');
  }

  aprobarSolicitud(pacienteEnSolicitud){
    this.solicitudesService.aprobarSolicitud(pacienteEnSolicitud);
  }

  aDate(turno){
    var momentDate = moment(turno);
    var fecha = momentDate.toDate();
    return fecha
  }

}
