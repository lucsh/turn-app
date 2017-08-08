import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';

@Component({
  selector: 'editar-paciente',
  templateUrl: './editarPaciente.html'
})
export class EditarPacienteComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() paciente: any;
  @Output() pacienteEditado = new EventEmitter();

  @ViewChild('closeFormAgregarPaciente') closeFormAgregarPaciente: ElementRef;

  private obras: Obra[];
  private obraSelected: Obra = null;

  public modeloPaciente = {};

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
        console.log('Tengo las obras!!');
        this.obras = obras;
        this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente

        console.log(this.paciente);
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
  public editarPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
    emailPaciente, nacimientoPaciente, telefonoPaciente){
      ////console.log('Entre a agregar Paciente');
      let obraId = this.obraSelected._id;
      this.pacientesService.createPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
        emailPaciente, nacimientoPaciente, telefonoPaciente, obraId)
        .then(pacienteEdit => {

          ////console.log('Se creo el paciente con exito');
          ////console.log(paciente);

          //Enviamos la eleccion al componente padre
          this.pacienteEditado.next(pacienteEdit);

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
