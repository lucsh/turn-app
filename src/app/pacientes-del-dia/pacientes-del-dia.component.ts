import { Component, OnInit } from '@angular/core';
import { PacientesDelDiaService} from './pacientes-del-dia.service';
import { Subscription } from 'rxjs/Subscription';
import {Turno} from '../turnos/turno.tipo';
import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';


@Component({
  selector: 'app-pacientes-del-dia',
  providers:[PacientesDelDiaService],
  templateUrl: './pacientes-del-dia.component.html',
  styleUrls: ['./pacientes-del-dia.component.css']
})
export class PacientesDelDiaComponent implements OnInit {

  private subscription: Subscription;
  turnos: Turno[];
  constructor(private pacienteDelDiaService : PacientesDelDiaService,private ref: ChangeDetectorRef) { }

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
