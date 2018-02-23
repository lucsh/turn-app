import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';
import { ObrasCompartidasService } from '../../routerService/obras.sistema';

import { default as swal } from 'sweetalert2';
import { NgForm } from '@angular/forms';

import { IMyDpOptions } from 'mydatepicker';
import { AlertService } from 'app/shared/services/alerts.service';

declare var $: any;

@Component({
  selector: 'agregar-obra',
  templateUrl: './agregarObra.html',
  styleUrls: ['./agregarObra.css']
})
export class AgregarObraComponent implements OnInit, OnChanges {

  // @Input() fechaNuevoTurno: any;
  // @Input() pacientes: Array<any>;
  @Output() obraAgregada = new EventEmitter();

  @ViewChild('closeformCrearObra') closeformCrearObra: ElementRef;

  public obraNueva: Obra;

  constructor(
    private obrasService: ObrasService,
    private obrasCompartidas: ObrasCompartidasService,
    private alertService: AlertService
  ) {
    this.obraNueva = new Obra();
  }


  ngOnInit() {}

  ngOnChanges(changes) {}
  
  /* Este metodo se encarga de reiniciar el formulario, asi evita errores en las validaciones que quedan guardads.*/
  public reiniciarFormulario(formulario: NgForm) {
    formulario.resetForm();
    //this.fechaPaciente.nativeElement.value = null; //Reinicio el input de fecha para evitar errores.
  }

  public cancelar() {
    // Limpiamos variables
    // this.value = {};

    // Cerramos el modal
    this.closeformCrearObra.nativeElement.click();
  }

  crearObra(iniciales, nombre) {

    this.obrasCompartidas.createObra(iniciales, nombre)
      .then(obraCreada => {
        // Limpiamos variables
        this.obraNueva = new Obra();

        // Enviamos la eleccion al componente padre
        this.obraAgregada.next(obraCreada);
        this.closeformCrearObra.nativeElement.click();

        this.alertService.success('Éxito!', 'Nueva obra registrada!', 2000);

      });

  }

  abrirFormularioCrear() {
    setTimeout(() => {
      $('#formCrearObra').modal('show');
    },
      200);
  }

  cancelarModalCrear() {
    this.closeformCrearObra.nativeElement.click();
  }



}
