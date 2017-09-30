import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { Subscription } from 'rxjs/Subscription';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';

import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'editar-paciente',
  templateUrl: './editarPaciente.html',
  styleUrls: ['./editarPaciente.css']
})
export class EditarPacienteComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() paciente: any;
  @Output() pacienteEditado = new EventEmitter();
  @Output() pacienteEliminado = new EventEmitter();

  @ViewChild('closeFormEditarPaciente') closeFormEditarPaciente: ElementRef;

  private obras: Obra[];
  public obraSelected: Obra = null;

  public modeloPaciente = null;

  public fechaNacimiento: any = null;

  constructor(
    private pacientesService: PacientesService,
    private obrasService: ObrasService
  ){
    this.modeloPaciente = new Paciente();
  }

  //Configuraciones del DatePicker
  public myDatePickerOptions: IMyDpOptions = {
      todayBtnTxt: 'Hoy',
      openSelectorOnInputClick: true,
      editableDateField: false,
      dateFormat: 'dd/mm/yyyy',
      dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
      monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' }
  };

  /*
  */
  ngOnInit() {
    //Seteo la fecha de necimiento al datepicker
    let fechaParcial = new Date(this.paciente.fechaNacimiento);
    this.fechaNacimiento = { date: { year: fechaParcial.getFullYear(), month: fechaParcial.getMonth()+ 1, day: fechaParcial.getDate() } };

    this.obrasService.getObras().then(
      obras =>{
        console.log('Tengo las obras!!');
        this.obras = obras;

        this.iniciarObraSeleccionada();
        this.modeloPaciente = null;
        this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente

        // console.log(this.paciente);
      }
    ).catch(error=>{console.log(error)})
  }

  private iniciarObraSeleccionada(){
    this.obraSelected = null;
    let yo = this;

    if(this.obras && yo.paciente!= null){
      this.obras.forEach(function(obra,index){
        if(obra._id == yo.paciente.obra._id){
          yo.obraSelected = obra;
        }
      });
    }


  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    this.iniciarObraSeleccionada();
    this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente
  }

  /*

  */
  public editarPaciente(){
    //  let obraId = this.obraSelected._id;

    //Actualizamos la obra seleccionada
    if(this.obraSelected){
      this.modeloPaciente.obra = this.obraSelected._id;
    }
    this.modeloPaciente.fechaNacimiento = this.fechaNacimiento.jsdate;

    this.modeloPaciente.email = this.modeloPaciente.email.toLowerCase();
    this.pacientesService.actualizarPaciente(this.modeloPaciente._id, this.modeloPaciente)
    .then(pacienteEdit => {
      // console.log("VUELTA DEL PACIENTE");
      // console.log(pacienteEdit);
      this.pacienteEditado.next(pacienteEdit);


      //Cerramos el modal y limpiamos variables
      //this.modeloPaciente = null;
      this.obraSelected = null;
      this.closeFormEditarPaciente.nativeElement.click();

    }).catch(err => {console.log(err);})






  }

  sancionar(paciente){

    let yo = this;
    swal({
      title: '¿Estas seguro que queres sancionar al paciente?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Sancionar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.sancionarPaciente(paciente._id).then(pac => {
        // ////console.log("Paciente sancionado");
        // ////console.log(pac);
        paciente.sancion = true;
      }).catch(err => console.error(err))
    }).catch(swal.noop);
  }

  habilitar(paciente){
    let yo = this;
    swal({
      title: '¿Estas seguro que queres habilitar al paciente?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Habilitar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.habilitarPaciente(paciente._id).then(pac => {
        // ////console.log("Paciente habilitado");
        // ////console.log(pac);
        paciente.sancion = false;
      }).catch(err => console.error(err))
    }).catch(swal.noop);



  }

  eliminar(paciente){
    let yo = this;
    swal({
      title: '¿Estas seguro que queres eliminar al paciente?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      console.log('paciente');
      console.log(paciente);
      yo.pacientesService.eliminarPaciente(paciente._id).then(pac => {
        // ////console.log("Paciente eliminado");
        // ////console.log(pac);
        yo.pacienteEliminado.next(pac);

        yo.obraSelected = null;
        yo.closeFormEditarPaciente.nativeElement.click();
      }).catch(err => console.error(err))
    }).catch(swal.noop);
  }


  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormEditarPaciente.nativeElement.click();
  }



}
