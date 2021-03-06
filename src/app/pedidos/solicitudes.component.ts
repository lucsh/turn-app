import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';

import * as moment from 'moment';

import { Subscription } from 'rxjs/Subscription';
import { SolicitudesSocketService } from './solicitudes-socket.service';

//Declaramos esta variable para hacer uso de Jquery con los modals de Boostrap
declare var $: any;

@Component({
    selector: 'app-solicitudes',
    providers: [ SolicitudesSocketService ],
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit, OnDestroy  {

    public solicitudes: any[] = [];
    private subscription: Subscription;

    public solicitudAbierta: any;

    public haySolicitudes = false;
    public cantidadSolicitudes = 0;

    @ViewChild('closeFormSolicitud') closeFormSolicitud: ElementRef;

    constructor(
        private solicitudesService : SolicitudesSocketService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscription = this.solicitudesService.solicitudes$.subscribe((pacientesEnSolicitud: any[]) => {
            this.solicitudes = pacientesEnSolicitud;
            if (this.solicitudes.length > 0){
              this.cantidadSolicitudes = this.solicitudes.length;
              this.haySolicitudes = true;
            }
            this.ref.markForCheck();
        }, (err) => {
            console.error(err);
        });
    }

    ngOnDestroy() {
      // console.log('###### FIN Solicitudes component');

        //this.subscription.unsubscribe();
        this.solicitudesService = null;
    }

    abrirSolicitud(pacienteEnSolicitud){
        //console.log('Abriendo la solicitud');
        this.solicitudAbierta = pacienteEnSolicitud;
        $('#formularioSolicitud').modal('show');
    }

    aprobarSolicitud(pacienteEnSolicitud){
        //console.log('Rechazar solicitud');
        //console.log(pacienteEnSolicitud);

        this.solicitudesService.aprobarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;
        this.cantidadSolicitudes = this.cantidadSolicitudes - 1;
        //Cerramos el modal
        this.closeFormSolicitud.nativeElement.click();
    }
    rechazarSolicitud(pacienteEnSolicitud){
        //console.log('Rechazar solicitud');
        //console.log(pacienteEnSolicitud);

        this.solicitudesService.rechazarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;
        this.cantidadSolicitudes = this.cantidadSolicitudes - 1;
        //Cerramos el modal
        this.closeFormSolicitud.nativeElement.click();
    }

    aDate(turno){
        const momentDate = moment(turno);
        const fecha = momentDate.toDate();
        return fecha;
    }

}
