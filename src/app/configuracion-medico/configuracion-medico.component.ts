import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import { ActivatedRoute } from '@angular/router';

import {ConfiguracionMedicoService} from './configuracion-medico.service';
import { Medico } from '../medico/medico.tipo';

import { Obra } from '../obras/obra.tipo';
import { ObrasService } from '../obras/obras.service';

import {default as swal} from 'sweetalert2';
declare var $: any;


import { Select2OptionData } from 'ng2-select2';



@Component({
  selector: 'app-configuracion-medico',
  providers:[ConfiguracionMedicoService],
  templateUrl: './configuracion-medico.component.html',
  styleUrls: ['./configuracion-medico.component.css']
})
export class ConfiguracionMedicoComponent implements OnInit {
  //@ViewChild('formDatosBasicos') formDatosBasicos: ElementRef;
  public formDatosBasicos;
  public medicos = [];
  public medicoSeleccionado = null;

  public modeloMedico = null;
  private esMedico: boolean = false;

  public obrasSelector2: Array<any> = [];
  public actualizado: boolean = false;
  //  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  private obras: Obra[];
  private obraSelected: Obra = null;

  // public modeloMedico = {};


  // public obrasSelector: Array<Select2OptionData>;
  public obrasSelector: Array<any> = [];
  public options: Select2Options;
  public value: any[] = [];
  public current: string;

  constructor(
    route: ActivatedRoute,
    private http: Http, private configuracionMedicoService: ConfiguracionMedicoService, private obraService: ObrasService) {
      this.modeloMedico = {
        nombre: '',
        apellido: '',
        duracion: 0
      }
      let idMedico = route.snapshot.params['idDoctor'];
      if(idMedico != null){
        this.esMedico = true;
        this.configuracionMedicoService.buscarMedico(idMedico).then(
          medico => {
            if(medico){
              //****************************************************************
              //FIX TEMPORAL para cuando viene 1 OBRA, por lo que (por algun motivo), no lo entiende como lista
              //feathers al volverlo, posiblemente con un populate
              //****************************************************************

              if(!medico.obras.length){
                  let aux = Object.assign({}, medico.obras);
                  medico.obras = [];
                  medico.obras.push(aux);
              }
              this.medicos.push(medico);
              console.log('El medico seleccionado es ');
              console.log(medico);
            }
          }
        )
      }
      this.formDatosBasicos = $('#formDatosBasicos');
    }

    submitForm(form){
      console.log('ESTE ES EL FORM');
      console.log(form);
    }
    ngOnInit() {
      if(this.esMedico){
        // console.log('Exito!!!!!');
      }
      else{
        this.getAllMedicos();
      }

      let yo = this;
      this.obraService.getObras().then(obras => {
        this.obras = obras;
        yo.actualizarSelector();


      }).catch(error => {console.log(error)})
    }

    public actualizarSelector(){
      if(this.obras!=null){
        ////console.log('Entre a Ng on Changes del modal configurar semana');


        let yo = this;
        this.obras.forEach(function(elem,index){
          /*
          Dado que estamos usando el componente ng2-select,
          debemos tener un arreglo en el que cada objeto TENGA:
          un atributo 'id'
          un atributo 'text'
          */
          yo.obrasSelector[index] = elem;
          yo.obrasSelector[index].id = elem._id;
          yo.obrasSelector[index].text = elem.nombre;
        });
        this.iniciarSelectorObras();

        if(yo.obrasSelector.length > 0){
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



    getAllMedicos(): void{
      this.configuracionMedicoService.getMedicos().then(medics => {
        this.medicos = medics;
        ////console.log(medics);
      });
    }

    actualizarDatos(nombre,apellido,duracionTurno){
      let id = this.medicoSeleccionado._id;
      let idUsuario = this.medicoSeleccionado._idUsuario;


      let yo = this;

      let obrasAsignadas = this.asignarObras();

      // console.log('#############342423423');
      // console.log(obrasAsignadas);
      this.configuracionMedicoService.actualizarMedico(id,nombre,apellido,duracionTurno,obrasAsignadas, idUsuario).then(medicoNuevo =>{
        // console.log("El medico nuevo es....");
        // console.log(medicoNuevo);
        // let id = medicoNuevo._id;
        // let index = this.getIndex();

        yo.medicoSeleccionado.nombre = nombre;
        yo.medicoSeleccionado.apellido = apellido;
        yo.medicoSeleccionado.duracion = medicoNuevo.duracion;
        // console.log(medicoNuevo.obras);
        yo.medicoSeleccionado.obras = medicoNuevo.obras;


      });

      //Cerramos el modal
      $('#formDatosBasicos').modal('hide');
    }


    public asignarObras(){

      let obrasAsignadas = [];
      let yo = this;

      // console.log('yo.value');
      // console.log(yo.value);

      this.obrasSelector.forEach(function(elem,index){
        for (let i = 0; i < yo.value.length; i++) {

          if(elem.id.toString() == yo.value[i]){
            // console.log('****************************************');
            // console.log('encontre!');
            obrasAsignadas.push(elem._id); //clonamos el elemento
          }
        }

      });

      //Quitamos los atributos agregados para el selector del clone
      // delete pacienteAsignado['id'];
      // delete pacienteAsignado['text'];
      // ////console.log(pacienteAsignado);

      return obrasAsignadas;
    }


    configurarSemana(medico){
      this.medicoSeleccionado = medico;
      let semanaGuardada;
      this.configuracionMedicoService.getSemanaModelo(medico).then(semana =>{
        //Abrimos el modal...
        semanaGuardada = semana;

        $('#formConfigSemana').modal('show');
        ////console.log("LA SEMANA Q LE LLEGA AL COMPONENT ES....");
        ////console.log(semana);
      });
    }

    public abrirModal(medico){
      this.medicoSeleccionado = medico;

      let yo = this;
      let listaAux = [];

      // Si el emdico tiene obras, entonces se las asignamos al editar
      if(this.medicoSeleccionado.obras){
        // console.log('ESTOY ACA');
        // console.log(this.medicoSeleccionado);
        this.modeloMedico = Object.assign({}, medico);
        // console.log(this.medicoSeleccionado.obras);
        this.medicoSeleccionado.obras.forEach(function(elem,index){
          listaAux.push(elem._id);
        });
        this.value = listaAux;
      }


      // this.value = [this.obrasSelector[2].id, this.obrasSelector[1].id];




      $('#formDatosBasicos').modal('show');
    }
    public cancelar(){
      //Cerramos el modal
      $('#formDatosBasicos').modal('hide');


      this.medicoSeleccionado = null;
    }

    onIntervalosGuardados(medicoCambiado){
      // console.log('on intervalos guardados');
      //
      //
      // console.log(medicoCambiado);

      /*
        OBS: el medico viene SIN los datos de usuario.
        Es decir, no tenemos el nombre, apellido, etc.
        Solo debemos actualizar los datos de la semanaEsquema del medico
      */


      //Actualizamos el medico modificado
      let i = -1;
      this.medicos.forEach(function(med,index){
        if(med._id.toString() == medicoCambiado._id){
          i = index;
        }
      });
      if(i > -1){
        this.medicos[i].semanaEsquema = medicoCambiado.semanaEsquema;
      }

      //Sacamos la seleccion del medico, para que dsps no haya inconsistencias
      this.medicoSeleccionado = {};



    }

    public formAgregarMedico(){
      $('#formAgregarMedico').modal('show');
    }

    //---------------------------------------------------------------------------
    //Metodos originales del componente


    changed(data: {value: string[]}) {
      this.current = data.value.join(' | ');
      this.value = data.value;
      //console.log(this.current);
    }


    private get disabledV():string {
      return this._disabledV;
    }

    private set disabledV(value:string) {
      this._disabledV = value;
      this.disabled = this._disabledV === '1';
    }
    public selected(value:any):void {
      ////console.log('Selected value is: ', value);
    }

    public removed(value:any):void {
      ////console.log('Removed value is: ', value);
    }

    public typed(value:any):void {
      ////console.log('New search input: ', value);
    }

    public refreshValue(value:any):void {
      this.value = value;
    }

  }
