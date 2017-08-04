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
    providers: [SolicitudesSocketService],
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit, OnDestroy  {

    public solicitudes: any[] = [];
    private subscription: Subscription;

    private solicitudAbierta: any;

    //@ViewChild('closeBtn') closeBtn: ElementRef;
    @ViewChild('closeFormSolicitud') closeFormSolicitud: ElementRef;
    //@ViewChild('formularioSolicitud') formularioSolicitud: ElementRef;

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

    ngOnDestroy() {
        //this.subscription.unsubscribe();
        ////console.log('####*****////########//////###');

        this.solicitudesService = null;
    }

    abrirSolicitud(pacienteEnSolicitud){
        ////console.log('Abriendo la solicitud');
        this.solicitudAbierta = pacienteEnSolicitud;
        $('#formularioSolicitud').modal('show');
    }

    aprobarSolicitud(pacienteEnSolicitud){
        ////console.log('Rechazar solicitud');
        ////console.log(pacienteEnSolicitud);

        this.solicitudesService.aprobarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;

        //Cerramos el modal
        this.closeFormSolicitud.nativeElement.click();
    }
    rechazarSolicitud(pacienteEnSolicitud){
        ////console.log('Rechazar solicitud');
        ////console.log(pacienteEnSolicitud);

        this.solicitudesService.rechazarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;

        //Cerramos el modal
        this.closeFormSolicitud.nativeElement.click();
    }

    aDate(turno){
        var momentDate = moment(turno);
        var fecha = momentDate.toDate();
        return fecha
    }

}
