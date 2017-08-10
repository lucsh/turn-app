import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import { ActivatedRoute } from '@angular/router';

import {ConfiguracionMedicoService} from './configuracion-medico.service';
import { Medico } from '../medico/medico.tipo';

import { Obra } from '../obras/obra.tipo';
import { ObrasService } from '../obras/obras.service';

import {default as swal} from 'sweetalert2';
declare var $: any;



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
  private medicoSeleccionado = null;

  private esMedico: boolean = false;

  public obrasSelector: Array<any> = [];
  public actualizado: boolean = false;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  private obras: Obra[];
  private obraSelected: Obra = null;
  constructor(
    route: ActivatedRoute,
    private http: Http, private configuracionMedicoService: ConfiguracionMedicoService, private obraService: ObrasService) {
      let idMedico = route.snapshot.params['idDoctor'];
      if(idMedico != null){
        this.esMedico = true;
        this.configuracionMedicoService.buscarMedico(idMedico).then(
          medico => {
            if(medico){
              console.log('El medico seleccionado es ');
              this.medicos.push(medico);
              //console.log(this.medicoSeleccionado);
            }
          }
        )
      }
      this.formDatosBasicos = $('#formDatosBasicos');
    }

    ngOnInit() {
      if(this.esMedico){
        console.log('Exito!!!!!');
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
          yo.obrasSelector[index].id = elem.nombre;
          yo.obrasSelector[index].text = elem.nombre;
        });
        if(yo.obrasSelector.length > 0){
          ////console.log('TRUE');
          this.actualizado = true;
        }
      }
    }



    getAllMedicos(): void{
      this.configuracionMedicoService.getMedicos().then(medics => {
        this.medicos = medics;
        ////console.log(medics);
      });
    }

    actualizarDatos(nombre,apellido,duracionTurno){
      let id = this.medicoSeleccionado._id;
      let yo = this;

      let obrasAsignadas = this.asignarObras();

      ////console.log(obrasAsignadas);
      this.configuracionMedicoService.actualizarMedico(id,nombre,apellido,duracionTurno,obrasAsignadas).then(medicoNuevo =>{
        ////console.log("El medico nuevo es....");
        ////console.log(medicoNuevo);
        // let id = medicoNuevo._id;
        // let index = this.getIndex();

        yo.medicoSeleccionado.nombre = nombre;
        yo.medicoSeleccionado.apellido = apellido;


      });

      //Cerramos el modal
      $('#formDatosBasicos').modal('hide');
    }


    public asignarObras(){

      let obrasAsignadas = [];
      let yo = this;

      this.obrasSelector.forEach(function(elem,index){
        for (let i = 0; i < yo.value.length; i++) {
          if(elem.id == yo.value[i].id){
            ////console.log('encontre!');
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
      $('#formDatosBasicos').modal('show');
    }
    public cancelar(){
      //Cerramos el modal
      $('#formDatosBasicos').modal('hide');


      this.medicoSeleccionado = null;
    }

    //---------------------------------------------------------------------------
    //Metodos originales del componente

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
