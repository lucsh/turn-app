import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { ViewChildren, QueryList } from '@angular/core';

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

  @Output() semenaCambiada = new EventEmitter();
  @Input() medico: any;
  @Input() obrasDispTotales: any[];

  @ViewChild('closeFormConfigSemana') closeFormConfigSemana: ElementRef;
  @ViewChild('selector') selector: ElementRef;

  @ViewChildren('diaLunes') diasLunes: QueryList<ElementRef>;
  @ViewChildren('diaMartes') diasMartes: QueryList<ElementRef>;
  @ViewChildren('diaMiercoles') diasMiercoles: QueryList<ElementRef>;
  @ViewChildren('diaJueves') diasJueves: QueryList<ElementRef>;
  @ViewChildren('diaViernes') diasViernes: QueryList<ElementRef>;
  @ViewChildren('diaSabado') diasSabado: QueryList<ElementRef>;

  private intervalos: any[] = [];
  private obras: Obra[];
  private obraSelected: Obra = null;

  private turnosPorObra: any[] = [];


  public obrasSelector: Array<any> = [];
  public actualizado: boolean = false;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  private primeraVez: boolean = true;

  constructor(private obraService: ObrasService, private medicosService: MedicosService) { }

  ngOnInit() {
    if(this.medico != null){
      //this.obras = this.medico.obras;
      this.reiniciarConfiguracion();

      // this.intervalos = this.medico.semanaEsquema.intervalos;
      // if(this.intervalos == undefined || this.intervalos == null){
      //   this.agregarIntervalo();
      // }
      this.iniciarTurnosPorObras();
      this.iniciarIntervalos();
      this.obras = this.obrasDispTotales;
      this.actualizarSelector();
    }
  }

  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    ////console.log("CAMBIE DE MEDICOOOOOOOOOOOOOOOOOOO");
    this.reiniciarConfiguracion();

    // console.log("EL MEDICO DEL MODAL ES:");
    // console.log(this.medico);

    if(!this.primeraVez){
      this.obrasSelector = [];
      this.turnosPorObra = [];
      this.resetearCheckBoxs();

    }

    if(this.medico != null){
      //this.obras = this.medico.obras;
      this.iniciarTurnosPorObras();
      this.iniciarIntervalos();
      this.obras = this.obrasDispTotales;
      ////console.log("medicos obras");
      ////console.log(this.medico.obras);
      this.actualizarSelector();

    }
  }

  ngAfterViewInit() {
    //  console.log("AFTER VIEW");
     this.primeraVez = false;
    // this.actualizarCheckBoxs();
  }
  ngAfterViewChecked(){
    // console.log('HOLA');
    this.actualizarCheckBoxs();
    // if(!this.primeraVez){
    //    this.actualizarCheckBoxs();
    // }
  }

  public reiniciarConfiguracion(){
    this.intervalos = [];
    // this.obras=[];
    this.obraSelected = null;
    this.turnosPorObra =[];

  }

  public iniciarTurnosPorObras(){
    if(this.medico.semanaEsquema){

      // console.log("Turnos por obra");
      // console.log(this.medico.semanaEsquema.obrasDisponibles);
      if(this.medico.semanaEsquema && this.medico.semanaEsquema.obrasDisponibles){

        this.turnosPorObra = this.medico.semanaEsquema.obrasDisponibles;
      }else{

        this.turnosPorObra = [];
      }
    }
    // console.log("INTERVALOS");
    // console.log(this.intervalos);
    if(this.turnosPorObra == undefined || this.turnosPorObra == null){
      this.agregarObra();
    }
    else{

    }
    // this.actualizarCheckBoxs();
  }

  public actualizarCheckBoxs(){

    let diaAux = -1;
    let diasArray = [];
    if(this.intervalos != null && this.intervalos != undefined){
      for (let i = 0; i < this.intervalos.length; i++) {
        for (let j = 0; j < this.intervalos[i].dias.length; j++) {

          let diaAux = this.intervalos[i].dias[j];

          if(diaAux == 1){
            diasArray = this.diasLunes.toArray();
            diasArray[i].nativeElement.checked = true;
          }
          if(diaAux == 2){
            // console.log(this.diasMartes[i]);
            diasArray = this.diasMartes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMartes.nativeElement.checked = true;
          }
          if(diaAux == 3){
            // console.log(this.diasMiercoles[i]);
            diasArray = this.diasMiercoles.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMiercoles.nativeElement.checked = true;
          }
          if(diaAux == 4){
            // console.log(this.diasJueves[i]);
            diasArray = this.diasJueves.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaJueves.nativeElement.checked = true;
          }
          if(diaAux == 5){
            // console.log(this.diasViernes[i]);
            diasArray = this.diasViernes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaViernes.nativeElement.checked = true;
          }
          if(diaAux == 6){
            // console.log(this.diasSabado[i]);
            diasArray = this.diasSabado.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaSabado.nativeElement.checked = true;
          }
        }
      }
    }
    this.primeraVez = false;
  }

  public resetearCheckBoxs(){


      let diasArray = this.diasLunes.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
      diasArray = this.diasMartes.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
       diasArray = this.diasMiercoles.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
       diasArray = this.diasJueves.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
       diasArray = this.diasViernes.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
       diasArray = this.diasSabado.toArray();
      diasArray.forEach(function(elem,index){
          elem.nativeElement.checked=false;
      });
  }

  public iniciarIntervalos(){
    if(this.medico.semanaEsquema){

      if(this.medico.semanaEsquema && this.medico.semanaEsquema.intervalos){

        this.intervalos = this.medico.semanaEsquema.intervalos;
      }else{
        this.intervalos = [];
      }
    }
    // console.log("INTERVALOS");
    // console.log(this.intervalos);
    if(this.intervalos == undefined || this.intervalos == null){

      let inter = {
        dias : [],
        horaInicial: "",
        horaFin: ""
      };
      this.intervalos.push(inter);
    }
    else{
      // console.log("dias");
      // console.log(this.diaLunes.nativeElement.value);
    }
    // this.actualizarCheckBoxs();
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
        yo.obrasSelector[index].id = elem._id;
        yo.obrasSelector[index].text = elem.nombre;
        yo.obrasSelector[index]._id = elem._id;
      });
      if(yo.obrasSelector.length > 0){
        ////console.log('TRUE');
        this.actualizado = true;
        ////console.log(this.selector);



        if(this.selector != undefined){

          /*
            IMPORTANTE: Workaround para que se actualice segun obrasSelector
            Sacado de:
            https://github.com/valor-software/ng2-select/issues/635#issuecomment-281094377
          */

          //this.turnosPorObra[0].obraSocial = this.obrasSelector[0].id;
          (<any>this.selector).open();
        }

      }
    }
  }


  public agregarPaciente(){
    ////console.log('Entre a agregar Paciente');
    let obraId = this.obraSelected._id;
  }


  public agregarIntervalo(){

    console.log('ENTRE ACA');
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
    console.log(intervalo);
  }


  public trackByIndex(index: number, item) {
    return index;
  }

  private parsearObras(){
    let result = [];
    console.log("Entre a parsear obras");
    console.log(this.turnosPorObra);
    for (let i = 0; i < this.turnosPorObra.length; i++) {
      this.turnosPorObra[i];
      result[i] = {obraSocial: this.turnosPorObra[i].obraSocial, cantDisponible:this.turnosPorObra[i].cantDisponible}
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

      //this.resetearCheckBoxs();
      this.semenaCambiada.next(resultado);

    }).catch(error => {console.log(error)});



    /* Restableciendo variables */
    this.intervalos = [];
    this.turnosPorObra = [];
    this.closeFormConfigSemana.nativeElement.click();

  }
  public cancelar(){
    //Limpiamos variables
    //this.value = {};
    // this.intervalos = [];
    // this.turnosPorObra = [];



    //Cerramos el modal
    // this.obraSelected = null;
    this.closeFormConfigSemana.nativeElement.click();

    // this.agregarIntervalo();
    // this.agregarObra();
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
  public selected(value:any,pos:number):void {
    // console.log('Selected value is: ', value);
    // console.log("Seleccionado",pos);
    this.turnosPorObra[pos].obraSocial = value.id;
    // console.log(this.turnosPorObra[pos]);

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
