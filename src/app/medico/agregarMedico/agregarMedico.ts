import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Medico } from '../medico.tipo';
import { MedicosService } from '../medicos.service';

import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';

import {default as swal} from 'sweetalert2';

@Component({
  selector: 'agregar-medico',
  templateUrl: './agregarMedico.html'
})
export class AgregarMedicoComponent implements OnInit, OnChanges {

  @Input() obras: Obra[];
  @Output() medicoAgregado = new EventEmitter();

  @ViewChild('closeFormAgregarMedico') closeFormAgregarMedico: ElementRef;

  private obrasSelected: Obra[] = null;

  // Para el selector de obras
  public obrasSelectorMedico: Array<any> = [];
  public options: Select2Options;
  public value: any[] = [];
  public current: string;
  public actualizado = false;

  constructor(
    private medicosService: MedicosService,
    private obrasService: ObrasService
  ) {

  }

  /*
  */
  ngOnInit() {
    this.actualizarSelector();
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
  }

  /*
  */
  public agregarMedico(nombreMedico, apellidoMedico, emailMedico, matriculaMedico,
    nacimientoMedico, duracionMedico) {

      const obrasAsignadas = this.asignarObras();

      const nuevoMedico = {
        matricula: matriculaMedico,
        email: emailMedico,
        nombre: nombreMedico,
        apellido: apellidoMedico,
        duracion: duracionMedico,
        obras: obrasAsignadas,
        fechaNacimiento: nacimientoMedico
      };

      this.medicosService.createMedico(nuevoMedico).then().catch(err => {
        console.log('Ha ocurrido un error en el componente AgregarMedico');
        console.log(err);
      });
  }


      /*

      */
  public cancelar() {
    // Limpiamos variables
    // this.value = {};

    // Cerramos el modal
    this.obrasSelected = null;
    this.actualizado = false;
    this.closeFormAgregarMedico.nativeElement.click();
  }

  // ****************************************************************************
  // Metodos del selector

  /** Este metodo es creado para quitar la obra Particular (que en realidad fue agregada a este arreglo para crear una sensacion visual,
   * y no es una obra real en el BACKEND) */
  private limpiarParticular(obras) {
    const resultado =  [];
    if (obras != null) {
      for (let index = 0; index < obras.length; index++) {
        const element = obras[index];
        if (element.nombre != 'Particular') {
          resultado.push(element);
        }

      }
    }
    return resultado;
  }

  public actualizarSelector() {
    if (this.obras != null) {
      this.obras = this.limpiarParticular(this.obras);

      const yo = this;
      this.obras.forEach(function(elem, index){
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
      this.iniciarSelectorObras();

      if (yo.obrasSelectorMedico.length > 0) {
        this.actualizado = true;
      }
    }
  }

  private iniciarSelectorObras() {

    this.options = {
      multiple: true
    };

    this.current = this.value.join(' | ');
  }

  public asignarObras() {

    const obrasAsignadas = [];
    const yo = this;

    if (this.obrasSelectorMedico.length > 0) {
      this.obrasSelectorMedico.forEach(function(elem, index){
        for (let i = 0; i < yo.value.length; i++) {

          if (elem.id.toString() === yo.value[i]) {
            obrasAsignadas.push(elem._id); // clonamos el elemento
          }
        }

      });
    }



    // Quitamos los atributos agregados para el selector del clone
    // delete pacienteAsignado['id'];
    // delete pacienteAsignado['text'];
    // ////console.log(pacienteAsignado);

    return obrasAsignadas;
  }

  // ---------------------------------------------------------------------------
  // Metodos originales del componente


  changedObraMedico(data: {value: string[]}) {
    this.current = data.value.join(' | ');
    this.value = data.value;
  }



}
