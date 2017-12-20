import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import { ObrasCompartidasService } from '../../routerService/obras.sistema';
import { Subscription } from 'rxjs/Subscription';


import {default as swal} from 'sweetalert2';
import { NgForm } from '@angular/forms';

import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'agregar-paciente',
  templateUrl: './agregarPaciente.html',
  styleUrls: ['./agregarPaciente.css']
})
export class AgregarPacienteComponent implements OnInit, OnChanges{

  @Output() pacienteAgregado = new EventEmitter();

  @ViewChild('closeFormAgregarPaciente') closeFormAgregarPaciente: ElementRef;
  @ViewChild('fechaPaciente') fechaPaciente:ElementRef;
  @ViewChild('formulario') formulario:NgForm;

  public obras: Obra[];
  public obraSelected: Obra = null;
  public pacienteNuevo: Paciente;
  public pacienteCopia: Paciente;
  public fechaNacimiento: any = null;

  private obrasSubscription: Subscription;

  //Configuraciones del DatePicker
  public myDatePickerOptions: IMyDpOptions = {
      todayBtnTxt: 'Hoy',
      openSelectorOnInputClick: true,
      editableDateField: false,
      dateFormat: 'dd/mm/yyyy',
      dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
      monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' }
  };

  constructor(
    private pacientesService: PacientesService,
    private obrasCompartidasService: ObrasCompartidasService,
    private obrasService: ObrasService
  ){
    this.pacienteNuevo = new Paciente();
  }

  /*
  */
  ngOnInit() {
    this.observarObras();
  }

  observarObras(){
    /*
      Subscribimos a los obras, para que tengan una correspondencia
      con los obras del navigator
    */
    if(this.obrasCompartidasService.obras$){
      this.obrasSubscription = this.obrasCompartidasService.obras$.subscribe((obras) => {

        this.obras = obras;

        if(this.devolverParticular()==null){

          let particular = {
          	_id: 'Particular',
          	nombre: 'Particular',
          	iniciales: 'Particular'
          };
          this.obras.push(particular);
        }

        // this.ref.markForCheck();
      }, (err) => {
        console.log('Error en observarObras de agregarPaciente');
        console.error(err);
      });

      // Obtenemos los pacientes compartidos
      this.obrasCompartidasService.getObras();
    }
  }

  private devolverParticular(){
    let obraRes:Obra;
    if(this.obras){
      this.obras.forEach(function(obra,index){
        if(obra.nombre == 'Particular' ){
          obraRes = obra;
        }
      });
    }

    // console.log("El resultado de devolver particular es.. ", obraRes);

    return obraRes;
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

      this.pacienteCopia = new Paciente();
      this.pacienteCopia.nombre = nombrePaciente;
      this.pacienteCopia.apellido = apellidoPaciente;
      this.pacienteCopia.dni = dniPaciente;
      this.pacienteCopia.email = emailPaciente;
      this.pacienteCopia.telefono = telefonoPaciente;
      this.pacienteCopia.ocupacion = ocupacion;
      this.pacienteCopia.observaciones = observaciones;
      this.pacienteCopia.fechaNacimiento = this.fechaNacimiento.jsdate;

      let emailPacienteLower = emailPaciente.toLowerCase();
      let obraId = this.obraSelected._id;

      if(obraId === 'Particular'){
        obraId = null;
      }
      else{
        this.pacienteCopia.obra = obraId;
      }

      this.pacientesService.createPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
        emailPacienteLower, this.fechaNacimiento.jsdate, telefonoPaciente, obraId, ocupacion, observaciones)
        .then(pacienteNuevo => {

          //Enviamos la eleccion al componente padre
          this.pacienteAgregado.next(pacienteNuevo);

          //Cerramos el modal
          this.obraSelected = null;
          this.fechaNacimiento = null;
          this.pacienteCopia = null;
          this.closeFormAgregarPaciente.nativeElement.click();

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
          );
        }).catch(err =>{
          if(err.status === 500){
            let yo = this;
            swal({
              title: 'Error al crear paciente!',
              text: 'Ocurrio un error a la hora de crear el paciente, compruebe que el email ingresado no este siendo utilizado por otro paciente',
              type: 'error'
            }).then(
              function () {

                yo.pacienteNuevo = yo.pacienteCopia;

                //REVISAR EL TEMA DE FECHA NACIMIENTO Y OBRA ELEGIDA:
                yo.formulario.setValue({
                  nombrePaciente:yo.pacienteCopia.nombre,
                  apellidoPaciente: yo.pacienteCopia.apellido,
                  documentoPaciente: yo.pacienteCopia.dni,
                  emailPaciente: yo.pacienteCopia.email,
                  fechaPaciente: yo.pacienteCopia.fechaNacimiento,
                  telefonoPaciente: yo.pacienteCopia.telefono,
                  ocupacionPaciente: yo.pacienteCopia.ocupacion,
                  observacionesPaciente: yo.pacienteCopia.observaciones,
                  obraSelected: yo.obraSelected,
                });
                yo.pacienteCopia = null;
              },
              // handling the promise rejection
              function (dismiss) {
                if (dismiss === 'timer') {

                }
              }
            )
          }
        });
  }

  /*
    La fecha entrante tiene el formato 2017-08-23T03:00:00.000Z
  */
  datePickerChanged(nuevaFecha){
    this.fechaNacimiento = nuevaFecha;
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
