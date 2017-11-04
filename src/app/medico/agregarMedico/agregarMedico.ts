import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Medico } from '../medico.tipo';
import { MedicosService } from '../medicos.service';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';

@Component({
  selector: 'agregar-medico',
  templateUrl: './agregarMedico.html'
})
export class AgregarMedicoComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  // @Input() pacientes: Array<any>;
  @Input() obras: Obra[];
  @Output() medicoAgregado = new EventEmitter();

  @ViewChild('closeFormAgregarMedico') closeFormAgregarMedico: ElementRef;

  // private obras: Obra[];
  private obrasSelected: Obra[] = null;

  //Para el selector de obras
  public obrasSelectorMedico: Array<any> = [];
  public options: Select2Options;
  public value: any[] = [];
  public current: string;
  public actualizado: boolean = false;

  constructor(
    private medicosService: MedicosService,
    private obrasService: ObrasService
  ){

  }

  /*
  */
  ngOnInit() {
    this.actualizarSelector();
    // this.obrasService.getObras().then(
    //   obras =>{
    //     this.obras = obras;
    //     this.actualizarSelector();
    //   }
    // ).catch(error=>{console.log(error)})
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

  }

  /*

  */
  public agregarMedico(nombreMedico,apellidoMedico, emailMedico, matriculaMedico,
    nacimientoMedico, duracionMedico){
      ////console.log('Entre a agregar Paciente');


      //let obraId = this.obraSelected._id;
      let obrasAsignadas = this.asignarObras();

      let nuevoMedico = {
        matricula: matriculaMedico,
        email: emailMedico,
        nombre: nombreMedico,
        apellido: apellidoMedico,
        duracion: duracionMedico,
        obras: obrasAsignadas,
        fechaNacimiento: nacimientoMedico
      }

      // console.log('Estoy enviando el siguiente medico ', nuevoMedico);

      this.medicosService.createMedico(nuevoMedico).then().catch(err => {
        console.log('Ha ocurrido un error en el componente AgregarMedico');
        console.log(err);
      })
      /*
      this.medicosService.createPaciente(nombrePaciente,apellidoPaciente, dniPaciente,
        emailPaciente, nacimientoPaciente, telefonoPaciente, obraId, ocupacion, observaciones)
        .then(pacienteNuevo => {

          ////console.log('Se creo el paciente con exito');
          ////console.log(paciente);

          //Enviamos la eleccion al componente padre
          this.medicoAgregado.next(pacienteNuevo);

          //Cerramos el modal
          this.obraSelected = null;
          this.actualizado = false;
          this.closeFormAgregarMedico.nativeElement.click();


        });
      */




  }


      /*

      */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.obrasSelected = null;
    this.actualizado = false;
    this.closeFormAgregarMedico.nativeElement.click();
  }

  //****************************************************************************
  //Metodos del selector

  /** Este metodo es creado para quitar la obra Particular (que en realidad fue agregada a este arreglo para crear una sensacion visual, y no es una obra real en el BACKEND) */
  private limpiarParticular(obras){
    let resultado =  [];
    if(obras != null ){
      for (var index = 0; index < obras.length; index++) {
        var element = obras[index];
        if(element.nombre !='Particular'){
          resultado.push(element);
        }
        
      }
    }
    return resultado;
  }

  public actualizarSelector(){
    if(this.obras!=null){
      ////console.log('Entre a Ng on Changes del modal configurar semana');
      this.obras = this.limpiarParticular(this.obras);

      let yo = this;
      this.obras.forEach(function(elem,index){
        /*
        Dado que estamos usando el componente ng2-select,
        debemos tener un arreglo en el que cada objeto TENGA:
        un atributo 'id'
        un atributo 'text'
        */
        yo.obrasSelectorMedico[index] = elem;
        yo.obrasSelectorMedico[index].id = elem._id;
        yo.obrasSelectorMedico[index].text = elem.nombre;
      });
      // console.log('Lo logre');
      // console.log(this.obrasSelectorMedico);
      this.iniciarSelectorObras();

      if(yo.obrasSelectorMedico.length > 0){
        ////console.log('TRUE');
        this.actualizado = true;
      }
    }
  }

  private iniciarSelectorObras(){




    this.options = {
      multiple: true
    }

    this.current = this.value.join(' | ');
  }

  public asignarObras(){

    let obrasAsignadas = [];
    let yo = this;

    // console.log('yo.value');
    // console.log(yo.value);

    if(this.obrasSelectorMedico.length > 0){
      this.obrasSelectorMedico.forEach(function(elem,index){
        for (let i = 0; i < yo.value.length; i++) {

          if(elem.id.toString() == yo.value[i]){
            // console.log('****************************************');
            // console.log('encontre!');
            obrasAsignadas.push(elem._id); //clonamos el elemento
          }
        }

      });
    }



    //Quitamos los atributos agregados para el selector del clone
    // delete pacienteAsignado['id'];
    // delete pacienteAsignado['text'];
    // ////console.log(pacienteAsignado);

    return obrasAsignadas;
  }

  //---------------------------------------------------------------------------
  //Metodos originales del componente


  changedObraMedico(data: {value: string[]}) {
    this.current = data.value.join(' | ');
    this.value = data.value;
    //console.log(this.current);
  }



}
