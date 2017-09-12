import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';
import { NgForm } from '@angular/forms';

import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'agregar-paciente',
  templateUrl: './agregarPaciente.html',
  styleUrls: ['./agregarPaciente.css']
})
export class AgregarPacienteComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  // @Input() pacientes: Array<any>;
  @Output() pacienteAgregado = new EventEmitter();

  @ViewChild('closeFormAgregarPaciente') closeFormAgregarPaciente: ElementRef;
  @ViewChild('fechaPaciente') fechaPaciente:ElementRef;

  public obras: Obra[];
  public obraSelected: Obra = null;
  public pacienteNuevo: Paciente;
  public fechaNacimiento: any = null;

  //Configuraciones del DatePicker
  private myDatePickerOptions: IMyDpOptions = {
      todayBtnTxt: 'Hoy',
      openSelectorOnInputClick: true,
      editableDateField: false,
      dateFormat: 'dd/mm/yyyy',
      dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
      monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' }
  };

  constructor(
    private pacientesService: PacientesService,
    private obrasService: ObrasService
  ){
    this.pacienteNuevo = new Paciente();
  }

  /*
  */
  ngOnInit() {
    this.obrasService.getObras().then(
      obras =>{
        this.obras = obras;
        // this.pacienteNuevo = new Paciente();
      }
    ).catch(error=>{console.log(error)})
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

  }
/* Este metodo se encarga de reiniciar el formulario, asi evita errores en las validaciones que quedan guardads.*/
  public reiniciarFormulario(formulario:NgForm){
    formulario.resetForm();
    //this.fechaPaciente.nativeElement.value = null; //Reinicio el input de fecha para evitar errores.
  }

  /*

  */
  public agregarPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
    emailPaciente, telefonoPaciente, ocupacion, observaciones){
      ////console.log('Entre a agregar Paciente');
      let obraId = this.obraSelected._id;
      this.pacientesService.createPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
        emailPaciente, this.fechaNacimiento.jsdate, telefonoPaciente, obraId, ocupacion, observaciones)
        .then(pacienteNuevo => {

          ////console.log('Se creo el paciente con exito');
          ////console.log(paciente);

          //Enviamos la eleccion al componente padre
          this.pacienteAgregado.next(pacienteNuevo);

          //Cerramos el modal
          this.obraSelected = null;
          this.fechaNacimiento = null;
          this.closeFormAgregarPaciente.nativeElement.click();

          
            //EL SWAL aparace debajo del modal anterior!! Solucionarlo!!!
          

          swal({
            title: 'Éxito!',
            text: 'Nuevo paciente registrado!',
            type: 'success',
            timer: 2000
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {

              }
            }
          )
        });

         

  }

  /*
    La fecha entrante tiene el formato 2017-08-23T03:00:00.000Z
  */
  datePickerChanged(nuevaFecha){

    this.fechaNacimiento = nuevaFecha;


    // console.log(nuevaFecha);
    // console.log('ENTRO');
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
