import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ConfiguracionMedicoService} from './configuracion-medico.service';
import { Medico } from '../medico/medico.tipo';



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
  public medicos;
  private medicoSeleccionado;
  constructor(private http: Http, private configuracionMedicoService: ConfiguracionMedicoService) {

    this.formDatosBasicos = $('#formDatosBasicos');
  }

  ngOnInit() {
    this.getAllMedicos();
  }


  getAllMedicos(): void{
    this.configuracionMedicoService.getMedicos().then(medics => {
        this.medicos = medics;
        //console.log(medics);
    });
  }

  actualizarDatos(nombre,apellido){
    let id = this.medicoSeleccionado._id;
    let yo = this;
    this.configuracionMedicoService.actualizarMedico(id,nombre,apellido).then(medicoNuevo =>{
      console.log("El medico nuevo es....");
      console.log(medicoNuevo);
      // let id = medicoNuevo._id;
      // let index = this.getIndex();

      yo.medicoSeleccionado.nombre = nombre;
      yo.medicoSeleccionado.apellido = apellido;


    });

    //Cerramos el modal
    $('#formDatosBasicos').modal('hide');
  }


  configurarSemana(medico){
    this.medicoSeleccionado = medico;
    let semanaGuardada;
    this.configuracionMedicoService.getSemanaModelo(medico).then(semana =>{
      //Abrimos el modal...
      semanaGuardada = semana;

      $('#formConfigSemana').modal('show');
      console.log("LA SEMANA Q LE LLEGA AL COMPONENT ES....");
      console.log(semana);
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

}
