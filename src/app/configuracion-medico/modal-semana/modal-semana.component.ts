import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';

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
  // @ViewChild('selector') selector: ElementRef;

  @ViewChildren('diaLunes') diasLunes: QueryList<ElementRef>;
  @ViewChildren('diaMartes') diasMartes: QueryList<ElementRef>;
  @ViewChildren('diaMiercoles') diasMiercoles: QueryList<ElementRef>;
  @ViewChildren('diaJueves') diasJueves: QueryList<ElementRef>;
  @ViewChildren('diaViernes') diasViernes: QueryList<ElementRef>;
  @ViewChildren('diaSabado') diasSabado: QueryList<ElementRef>;

  @ViewChildren('selector') selectoresObras: QueryList<ElementRef>;

  public intervalos: any[] = [];
  private obras: Obra[];
  private obraSelected: Obra = null;

  public turnosPorObra: any[] = [];


  public obrasSelector: Array<any> = [];
  public actualizado: boolean = false;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  private primeraVez: boolean = true;

  constructor(private obraService: ObrasService, private medicosService: MedicosService, private cd: ChangeDetectorRef) { }

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
    this.reiniciarConfiguracion();

    if(!this.primeraVez){
      this.obrasSelector = [];
      this.turnosPorObra = [];
      this.resetearSelectoresObras();
      this.resetearCheckBoxs();

    }

    if(this.medico != null){
      //this.obras = this.medico.obras;
      this.iniciarTurnosPorObras();
      this.iniciarIntervalos();
      this.obras = this.obrasDispTotales;
      this.actualizarSelector();

    }
  }

  ngAfterViewInit() {
    this.primeraVez = false;
    // this.actualizarCheckBoxs();
  }
  ngAfterViewChecked(){
    this.iniciarSelectoresObras();
    this.actualizarCheckBoxs();



    /*
      Estamos evitando problemas con los cambios de ciclos de los hooks de los componentes. Para entender este fix:
      https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
    */

    this.cd.detectChanges();

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
      if(this.medico.semanaEsquema && this.medico.semanaEsquema.obrasDisponibles){

        this.turnosPorObra = this.medico.semanaEsquema.obrasDisponibles;
      }else{

        this.turnosPorObra = [];
      }
    }
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
            diasArray = this.diasMartes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMartes.nativeElement.checked = true;
          }
          if(diaAux == 3){
            diasArray = this.diasMiercoles.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMiercoles.nativeElement.checked = true;
          }
          if(diaAux == 4){
            diasArray = this.diasJueves.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaJueves.nativeElement.checked = true;
          }
          if(diaAux == 5){
            diasArray = this.diasViernes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaViernes.nativeElement.checked = true;
          }
          if(diaAux == 6){
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

  /*
    Este metodo INICIA CADA selector de obras, con el valor que tenia.
  */
  public iniciarSelectoresObras(){

    let yo = this;
    let selectoresAux :any[] = this.selectoresObras.toArray();
    for (let index = 0; index < this.turnosPorObra.length; index++) {
        let elem = this.turnosPorObra[index];

        for (let i = 0; i < yo.obras.length; i++) {
          if(yo.obras[i]._id.toString() == elem.obraSocial.toString()){

            var aux = yo.obras[i]; //Este es el que tiene el id y el text
            // console.log(selectoresAux[index]);
            // selectoresAux[index].active.push(aux);
            selectoresAux[index].active = [aux];
          }
        }
    }
  }

  public resetearSelectoresObras(){

    let selectoresAux :any[] = this.selectoresObras.toArray();
    selectoresAux.forEach(function(elem,index){
      elem.active = [];
    });
  }

  public iniciarIntervalos(){
    if(this.medico.semanaEsquema){

      if(this.medico.semanaEsquema && this.medico.semanaEsquema.intervalos){

        this.intervalos = this.medico.semanaEsquema.intervalos;

        /*
          HoraInicialReal mantendra la hora + minutos convetidos a minutos.
          HoraInical tendra un string con formato hh:mm para la visual.
        */
        this.intervalos.forEach(function(elem,index){

          if(!elem.horaInicialReal){
            elem.horaInicialReal = elem.horaInicial;

            let horasAux = (Math.floor(elem.horaInicial / 60)).toString();
            let minutosAux = (elem.horaInicial % 60).toString();

            // Le debemos agregar un 0 antes por si es 1 minuto o 1 hora => 01
            if(horasAux.length == 1){
              horasAux = '0' + horasAux;
            }
            if(minutosAux.length == 1){
              minutosAux = '0' + minutosAux;
            }
            // Asignamos el string creado
            elem.horaInicial = horasAux +":"+ minutosAux;
          }

          if(!elem.horaFinReal){
            elem.horaFinReal = elem.horaFin;

            let horasAux = (Math.floor(elem.horaFin / 60)).toString();
            let minutosAux = (elem.horaFin % 60).toString();

            // Le debemos agregar un 0 antes por si es 1 minuto o 1 hora => 01
            if(horasAux.length == 1){
              horasAux = '0' + horasAux;
            }
            if(minutosAux.length == 1){
              minutosAux = '0' + minutosAux;
            }
            // Asignamos el string creado
            elem.horaFin = horasAux +":"+ minutosAux;
          }

        });
        console.log('FIN FOR EACH');
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
        horaFin: "",
        horaInicialReal: ""
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

        // yo.selectoresObras[0].nativeElement;

      });
      if(yo.obrasSelector.length > 0){
        this.actualizado = true;
      }
    }
  }


  public agregarPaciente(){
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
    // console.log(intervalo);
  }

  public eliminarIntervalo(index){
    this.intervalos.splice(index,1);
  }

  public eliminarSelectorObra(index){
    this.turnosPorObra.splice(index,1);
  }

  public trackByIndex(index: number, item) {
    return index;
  }

  private parsearObras(){
    let result = [];
    for (let i = 0; i < this.turnosPorObra.length; i++) {
      this.turnosPorObra[i];
      result[i] = {obraSocial: this.turnosPorObra[i].obraSocial, cantDisponible:this.turnosPorObra[i].cantDisponible}
    }
    return result;
  }

  public guardarIntervalos(){

    this.closeFormConfigSemana.nativeElement.click();
    let yo = this;
    swal({
      title: '¿Estas seguro que queres actualizar el intervalo?',
      //text: 'You will not be able to recover this imaginary file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'Cancelar'
    }).then(function() {

      /*
        HoraInicialReal tenia la hora + minutos convetidos a minutos.
        HoraInical tenia un string con formato hh:mm para la visual.
        Lo mismo sucede con HoraFin y HoraFinReal.

        Ahora, para guardar en la base debemos intercambiar los valores (pues necesitamos guardarlo en minutos)
      */

      yo.intervalos.forEach(function(elem,index){
          elem.horaInicial = elem.horaInicialReal;
          elem.horaFin = elem.horaFinReal;
      });


      let obras = yo.parsearObras();
      let semana = {
        intervalos: yo.intervalos,
        obrasDisponibles: obras
      }
      yo.medicosService.actualizarSemana(yo.medico._id,semana).then(resultado => {
        yo.semenaCambiada.next(resultado);
      }).catch(error => {console.log(error)});
      yo.intervalos = [];
      yo.turnosPorObra = [];
      yo.closeFormConfigSemana.nativeElement.click();

    }, function(dismiss){
      $('#formConfigSemana').modal('show');
    });



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



  // ***************************************************************************

  // Metodos para obtener el horario del timePicker
  public horaInicial(intervalo){

    /*
      OBS: Se debe hacer al estilo de 'JQuery', pues el componente timepicker
      maneja una variable interna que NO actualiza al modelo asociado al input.
      Es decir, al seleccionar un valor con el timepicker,
      el modelo no se esta actualizando por mas de que tenemos [(ngModel)]="intervalos[intervaloIndex].horaInicial
    */

    let indexIntervalo = -1;
    this.intervalos.forEach(function(elem,index){
      if(elem._id == intervalo._id){
        indexIntervalo = index;
      }
    });

    let inputsHoraInicial = $('.claseHoraInicial');


    inputsHoraInicial.clockpicker({
      autoclose: true,
      afterDone: function() {

        /*

          Debemos convertir el string que obtenemos con el timepicker, a minutos
          para manejarlo en la base de datos. Asi, tendremos:

          HoraInicialReal : la hora + minutos convetidos a minutos.
          HoraInical : un string con formato hh:mm para la visual. [desactualizado, pues el timepicker maneja su variable local]

        */

        let nuevoValorString: String = (<any>inputsHoraInicial)[indexIntervalo].value;
        let valores =  nuevoValorString.split(":");

        let horas = parseInt(valores[0]);
        let minutos = 0;
        if(valores.length > 1){
          minutos = parseInt(valores[1]);
        }

        let minutosDeHora = horas * 60;
        let horaInicialMinutos = minutos + minutosDeHora;

        intervalo.horaInicialReal = horaInicialMinutos;

        // FIX : Debemos removerlo para que se reinicie el constructor de clockPicker
        inputsHoraInicial.clockpicker('remove');
      }
    });

    // Obligamos a que la cada vez que se toque se abra
    inputsHoraInicial.clockpicker('show');
  }
  public horaFin(intervalo){

    /*
      OBS: Se debe hacer al estilo de 'JQuery', pues el componente timepicker
      maneja una variable interna que NO actualiza al modelo asociado al input.
      Es decir, al seleccionar un valor con el timepicker,
      el modelo no se esta actualizando por mas de que tenemos [(ngModel)]="intervalos[intervaloIndex].horaInicial
    */

    let indexIntervalo = -1;
    this.intervalos.forEach(function(elem,index){
      if(elem._id == intervalo._id){
        indexIntervalo = index;
      }
    });

    let inputsHoraFin = $('.claseHoraFin');

    inputsHoraFin.clockpicker({
      autoclose: true,
      afterDone: function() {

        /*

          Debemos convertir el string que obtenemos con el timepicker, a minutos
          para manejarlo en la base de datos. Asi, tendremos:

          horaFinReal : la hora + minutos convetidos a minutos.
          horaFin : un string con formato hh:mm para la visual. [desactualizado, pues el timepicker maneja su variable local]

        */

        let nuevoValorString: String = (<any>inputsHoraFin)[indexIntervalo].value;
        let valores =  nuevoValorString.split(":");

        let horas = parseInt(valores[0]);
        let minutos = 0;
        if(valores.length > 1){
          minutos = parseInt(valores[1]);
        }

        let minutosDeHora = horas * 60;
        let horaFinMinutos = minutos + minutosDeHora;


        intervalo.horaFinReal = horaFinMinutos;

        // FIX : Debemos removerlo para que se reinicie el constructor de clockPicker
        inputsHoraFin.clockpicker('remove');
      }
    });

    // Obligamos a que la cada vez que se toque se abra
    inputsHoraFin.clockpicker('show');
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
    this.turnosPorObra[pos].obraSocial = value.id;

  }

  public removed(value:any):void {
  }

  public typed(value:any):void {
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

}
