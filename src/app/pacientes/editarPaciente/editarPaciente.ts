import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';

@Component({
  selector: 'editar-paciente',
  templateUrl: './editarPaciente.html',
  styleUrls: ['./editarPaciente.css']
})
export class EditarPacienteComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() paciente: any;
  @Output() pacienteEditado = new EventEmitter();

  @ViewChild('closeFormEditarPaciente') closeFormEditarPaciente: ElementRef;

  private obras: Obra[];
  public obraSelected: Obra = null;

  public modeloPaciente = null;

  constructor(
    private pacientesService: PacientesService,
    private obrasService: ObrasService
  ){
    this.modeloPaciente = new Paciente();
  }

  /*
  */
  ngOnInit() {
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
    ////console.log('Entre a agregar Paciente');
    //  let obraId = this.obraSelected._id;

    // console.log('this.modeloPaciente');
    // console.log(this.modeloPaciente);

    //Actualizamos la obra seleccionada
    if(this.obraSelected){
      this.modeloPaciente.obra = this.obraSelected._id;
    }

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
