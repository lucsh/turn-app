import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Obra } from '../obra.tipo';
import { ObrasService } from '../obras.service';

import {default as swal} from 'sweetalert2';
import { NgForm } from '@angular/forms';

import {IMyDpOptions} from 'mydatepicker';

declare var $: any;

@Component({
  selector: 'agregar-obra',
  templateUrl: './agregarObra.html',
  styleUrls: ['./agregarObra.css']
})
export class AgregarObraComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  // @Input() pacientes: Array<any>;
  @Output() obraAgregada = new EventEmitter();

  @ViewChild('closeformCrearObra') closeformCrearObra: ElementRef;

  public obraNueva: Obra;

  constructor(
    private obrasService: ObrasService
  ){
    this.obraNueva = new Obra();
  }

  /*
  */
  ngOnInit() {

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
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.closeformCrearObra.nativeElement.click();
  }

  crearObra(iniciales,nombre){
    this.obrasService.crearObra(iniciales,nombre).then((obraCreada)=>{
    //   console.log("OBRA CREADAAAAAAAAAAAAAAAAAA");
    //   console.log(obraCreada);

    // Limpiamos variables
    this.obraNueva = new Obra();

    // Enviamos la eleccion al componente padre
    this.obraAgregada.next(obraCreada);
    this.closeformCrearObra.nativeElement.click();


    swal({
      title: 'Éxito!',
      text: 'Nueva obra registrada!',
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
    })
  }

  abrirFormularioCrear(){
    setTimeout(()=> {
      $('#formCrearObra').modal('show');
    },
    200);
  }

  cancelarModalCrear(){
    this.closeformCrearObra.nativeElement.click();
  }



}
