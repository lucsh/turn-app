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
    templateUrl: './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

    public solicitudes: any[] = [];
    private subscription: Subscription;

    private solicitudAbierta: any;

    //@ViewChild('closeBtn') closeBtn: ElementRef;
    @ViewChild('closeBtnContrato') closeBtn: ElementRef;
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

    abrirSolicitud(pacienteEnSolicitud){
        console.log('Abriendo la solicitud');
        this.solicitudAbierta = pacienteEnSolicitud;
        $('#formularioSolicitud').modal('show');
    }

    aprobarSolicitud(pacienteEnSolicitud){
        console.log('Rechazar solicitud');
        console.log(pacienteEnSolicitud);

        this.solicitudesService.aprobarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;
    }
    rechazarSolicitud(pacienteEnSolicitud){
        console.log('Rechazar solicitud');
        console.log(pacienteEnSolicitud);

        //this.solicitudesService.aprobarSolicitud(pacienteEnSolicitud);
        this.solicitudAbierta = null;
    }

    aDate(turno){
        var momentDate = moment(turno);
        var fecha = momentDate.toDate();
        return fecha
    }

}
