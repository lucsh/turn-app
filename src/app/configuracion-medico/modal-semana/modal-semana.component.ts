import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';
import {MedicosService} from '../../medico/medicos.service';



declare var $: any;

@Component({
  selector: 'app-modal-semana',
  templateUrl: './modal-semana.component.html',
  styleUrls: ['./modal-semana.component.css']
})
export class ModalSemanaComponent implements OnInit,OnChanges {

  @Output() pacienteAgregado = new EventEmitter();
  @Input() medico: any;
  @Input() obrasDispTotales: any[];

  @ViewChild('closeFormConfigSemana') closeFormConfigSemana: ElementRef;
  @ViewChild('selector') selector: ElementRef;

  private intervalos: any[] = [];
  private obras: Obra[];
  private obraSelected: Obra = null;

  private turnosPorObra: any[] = [];


  public obrasSelector: Array<any> = [];
  public actualizado: boolean = false;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  constructor(private obraService: ObrasService, private medicosService: MedicosService) { }

  ngOnInit() {
    if(this.medico != null){
      //this.obras = this.medico.obras;
      this.obras = this.obrasDispTotales;
      this.actualizarSelector();
      this.agregarIntervalo();
      this.agregarObra();
    }
  }

  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    ////console.log("CAMBIE DE MEDICOOOOOOOOOOOOOOOOOOO");
    if(this.medico != null){
      //this.obras = this.medico.obras;
      this.obras = this.obrasDispTotales;
      ////console.log("medicos obras");
      ////console.log(this.medico.obras);
      this.actualizarSelector();
    }
  }

  public actualizarSelector(){
    if(this.obras!=null){
      ////console.log("Entre al actualizar selector");



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
        ////console.log(this.selector);


        if(this.selector != undefined){
          ////console.log("###########################################");
          ////console.log((<any>(this.selector)).element);
          ////console.log((<any>(this.selector)).element.itemObjects);
          (<any>(this.selector)).element.itemObjects = yo.obrasSelector
        }

      }
    }
  }


  public agregarPaciente(){
      ////console.log('Entre a agregar Paciente');
      let obraId = this.obraSelected._id;
  }


  public agregarIntervalo(){
    let inter = {
      dias : [],
      horaInicial: "",
      horaFin: ""
    };

    this.intervalos.push(inter);
  }

  public agregarObra(){
    let obra = {
      obraSocial: "",
      cantDisponible: 0
    }
    this.turnosPorObra.push(obra);
  }



  public actualizarDiaIntervalo(intervalo,dia){
    let bandera = false;
    let index = -1;
    for (let i = 0; i < intervalo.dias.length; i++) {
        if(intervalo.dias[i] == dia){
          index = i;
          bandera = true;
        }
    }
    if(!bandera){
      intervalo.dias.push(dia);
    }
    else{
      intervalo.dias.splice(index,1);
    }
    intervalo.dias.sort(function(a, b){return a - b});
    ////console.log(intervalo);
  }


  public trackByIndex(index: number, item) {
     return index;
   }

   private parsearObras(){
     let result = [];
     for (let i = 0; i < this.turnosPorObra.length; i++) {
         this.turnosPorObra[i];
         result[i] = {obraSocial: this.turnosPorObra[i].obraSocial._id, cantDisponible:this.turnosPorObra[i].cantDisponible}
     }

     ////console.log(result);
     return result;
   }

  public guardarIntervalos(){

    ////console.log(this.selector);
    ////console.log(this.medico);
    let obras = this.parsearObras();

    let semana = {
      intervalos: this.intervalos,
      obrasDisponibles: obras
    }

    this.medicosService.actualizarSemana(this.medico._id,semana).then(resultado => {
      ////console.log("EL RESULTADO DE ACTUALIZAR SEMANA ES....");
      ////console.log(resultado);
    }).catch(error => {console.log(error)});



    /* Restableciendo variables */
    this.intervalos = [];
    this.turnosPorObra = [];
    this.closeFormConfigSemana.nativeElement.click();

  }
  public cancelar(){
    //Limpiamos variables
    //this.value = {};
    this.intervalos = [];
    this.turnosPorObra = [];



    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormConfigSemana.nativeElement.click();
    //$('#formConfigSemana').modal('hide');

    this.agregarIntervalo();
    this.agregarObra();
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
