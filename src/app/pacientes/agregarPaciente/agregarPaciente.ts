import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';

@Component({
  selector: 'agregar-paciente',
  templateUrl: './agregarPaciente.html'
})
export class AgregarPacienteComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  // @Input() pacientes: Array<any>;
  @Output() pacienteAgregado = new EventEmitter();

  @ViewChild('closeFormAgregarPaciente') closeFormAgregarPaciente: ElementRef;

  private obras: Obra[];
  private obraSelected: Obra = null;

  constructor(
    private pacientesService: PacientesService,
    private obrasService: ObrasService
  ){

  }

  /*
  */
  ngOnInit() {
    this.obrasService.getObras().then(
      obras =>{
        this.obras = obras;
      }
    ).catch(error=>{console.log(error)})
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

  }

  /*

  */
  public agregarPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
    emailPaciente, nacimientoPaciente, telefonoPaciente){
      ////console.log('Entre a agregar Paciente');
      let obraId = this.obraSelected._id;
      this.pacientesService.createPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
        emailPaciente, nacimientoPaciente, telefonoPaciente, obraId)
        .then(pacienteNuevo => {

          ////console.log('Se creo el paciente con exito');
          ////console.log(paciente);

          //Enviamos la eleccion al componente padre
          this.pacienteAgregado.next(pacienteNuevo);

          //Cerramos el modal
          this.obraSelected = null;
          this.closeFormAgregarPaciente.nativeElement.click();

          /*
            EL SWAL aparace debajo del modal anterior!! Solucionarlo!!!
          */

          // swal({
          //   title: 'Éxito!',
          //   text: 'Nuevo paciente registrado!',
          //   type: 'success',
          //   timer: 2000
          // }).then(
          //   function () {},
          //   // handling the promise rejection
          //   function (dismiss) {
          //     if (dismiss === 'timer') {
          //
          //     }
          //   }
          // )
        });



  }


      /*

      */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormAgregarPaciente.nativeElement.click();
  }



}
