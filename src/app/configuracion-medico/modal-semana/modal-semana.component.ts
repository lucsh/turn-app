import {
  Component, OnInit, AfterViewInit, AfterViewChecked,
  Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild
} from '@angular/core';

import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';

import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';
import { MedicosService } from '../../medico/medicos.service';

import { default as swal } from 'sweetalert2';
import * as moment from 'moment';
import { ParticularesComponent } from 'app/configuracion-medico/modal-semana/particulares/particulares.component';
;
declare var $: any;

@Component({
  selector: 'app-modal-semana',
  templateUrl: './modal-semana.component.html',
  styleUrls: ['./modal-semana.component.css']
})
export class ModalSemanaComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Output() semenaCambiada = new EventEmitter();
  @Input() medico: any;
  @Input() obrasDispTotales: any[];

  @ViewChild('appParticulares') diasParticulares: ParticularesComponent;
  @ViewChild('closeFormConfigSemana') closeFormConfigSemana: ElementRef;
  // @ViewChild('selector') selector: ElementRef;

  @ViewChildren('diaLunes') diasLunes: QueryList<ElementRef>;
  @ViewChildren('diaMartes') diasMartes: QueryList<ElementRef>;
  @ViewChildren('diaMiercoles') diasMiercoles: QueryList<ElementRef>;
  @ViewChildren('diaJueves') diasJueves: QueryList<ElementRef>;
  @ViewChildren('diaViernes') diasViernes: QueryList<ElementRef>;
  @ViewChildren('diaSabado') diasSabado: QueryList<ElementRef>;

  @ViewChildren('selector') selectoresObras: QueryList<ElementRef>;

  @ViewChildren('inputHoraInicial') horariosIniciales: QueryList<ElementRef>;
  @ViewChildren('inputHoraFin') horariosFinales: QueryList<ElementRef>;

  public intervalos: any[] = [];
  private obras: Obra[];
  private obraSelected: Obra = null;

  public turnosPorObra: any[] = [];


  public obrasSelector: Array<any> = [];
  public actualizado = false;
  private value: any = {};
  private _disabledV = '0';
  private disabled = false;

  private primeraVez = true;

  constructor(private obraService: ObrasService, private medicosService: MedicosService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.medico != null) {
      this.reiniciarConfiguracion();

      this.iniciarTurnosPorObras();
      this.iniciarIntervalos();
      this.obras = this.obrasDispTotales;
      this.actualizarSelector();
      console.log('El medico es: ');
      console.log(this.medico)
    }
  }

  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    this.reiniciarConfiguracion();

    if (!this.primeraVez) {
      this.turnosPorObra = [];
      this.resetearSelectoresObras();
      this.resetearCheckBoxs();

    }

    if (this.medico != null) {
      this.iniciarTurnosPorObras();
      this.iniciarIntervalos();
      this.obras = this.obrasDispTotales;
      this.actualizarSelector();

    }

    if (!(this.obrasSelector.length > 0)) {
      // Este if es para que si existia una asignacion de cantidad de turnos por obra social, y
      // se eliminaron todas las obras por las cuales el medico trabaja, tambien se elimienn los intervalos
      // ya que sino queda un selector bugeado con un input numerico colgado del aire.


      // Ver metodo iniciarTurnosPorObras() , que tiene un if que hace esto mismo en algunas situaciones particulares.
      this.turnosPorObra = [];
    }
  }

  ngAfterViewInit() {
    this.primeraVez = false;
    // this.actualizarCheckBoxs();
  }
  ngAfterViewChecked() {
    this.iniciarSelectoresObras();
    this.actualizarCheckBoxs();

    /*
      Estamos evitando problemas con los cambios de ciclos de los hooks de los componentes. Para entender este fix:
      https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
    */

    this.cd.detectChanges();
  }

  public reiniciarConfiguracion() {
    this.intervalos = [];
    // this.obras=[];
    this.obraSelected = null;
    this.turnosPorObra = [];

  }

  public iniciarTurnosPorObras() {
    if (this.medico.semanaEsquema) {
      if (this.medico.semanaEsquema && this.medico.semanaEsquema.obrasDisponibles) {

        this.turnosPorObra = this.medico.semanaEsquema.obrasDisponibles;
        if (this.obrasSelector.length <= 0) {
          /* Metodo auxiliar de comprobacion para no mostrar intervalos de obras socailes q ya no son trabajadas. */
          this.turnosPorObra = [];
        }
      } else {
        this.turnosPorObra = [];
      }
    }
    if (this.turnosPorObra == undefined || this.turnosPorObra == null) {
      this.agregarObra();
    } else {

    }
    // this.actualizarCheckBoxs();
  }

  public actualizarCheckBoxs() {

    const diaAux = -1;
    let diasArray = [];
    if (this.intervalos != null && this.intervalos != undefined) {
      for (let i = 0; i < this.intervalos.length; i++) {
        for (let j = 0; j < this.intervalos[i].dias.length; j++) {

          const diaAux = this.intervalos[i].dias[j];

          if (diaAux == 1) {
            diasArray = this.diasLunes.toArray();
            diasArray[i].nativeElement.checked = true;
          }
          if (diaAux == 2) {
            diasArray = this.diasMartes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMartes.nativeElement.checked = true;
          }
          if (diaAux == 3) {
            diasArray = this.diasMiercoles.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaMiercoles.nativeElement.checked = true;
          }
          if (diaAux == 4) {
            diasArray = this.diasJueves.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaJueves.nativeElement.checked = true;
          }
          if (diaAux == 5) {
            diasArray = this.diasViernes.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaViernes.nativeElement.checked = true;
          }
          if (diaAux == 6) {
            diasArray = this.diasSabado.toArray();
            diasArray[i].nativeElement.checked = true;
            // this.diaSabado.nativeElement.checked = true;
          }
        }
      }
    }
    this.primeraVez = false;
  }

  public resetearCheckBoxs() {


    let diasArray = this.diasLunes.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
    diasArray = this.diasMartes.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
    diasArray = this.diasMiercoles.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
    diasArray = this.diasJueves.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
    diasArray = this.diasViernes.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
    diasArray = this.diasSabado.toArray();
    diasArray.forEach(function (elem, index) {
      elem.nativeElement.checked = false;
    });
  }

  /*
    Este metodo INICIA CADA selector de obras, con el valor que tenia.
  */
  public iniciarSelectoresObras() {

    const yo = this;
    const selectoresAux: any[] = this.selectoresObras.toArray();
    for (let index = 0; index < this.turnosPorObra.length; index++) {
      const elem = this.turnosPorObra[index];

      for (let i = 0; i < yo.obras.length; i++) {
        if (yo.obras[i]._id.toString() == elem.obraSocial.toString()) {

          const aux = yo.obras[i]; // Este es el que tiene el id y el text
          // selectoresAux[index].active.push(aux);
          selectoresAux[index].active = [aux];
        }
      }
    }
  }

  public resetearSelectoresObras() {

    const selectoresAux: any[] = this.selectoresObras.toArray();
    selectoresAux.forEach(function (elem, index) {
      elem.active = [];
    });
  }

  public iniciarIntervalos() {
    if (this.medico.semanaEsquema) {

      if (this.medico.semanaEsquema && this.medico.semanaEsquema.intervalos) {

        this.intervalos = this.medico.semanaEsquema.intervalos;

        /*
          HoraInicialReal mantendra la hora + minutos convetidos a minutos.
          HoraInical tendra un string con formato hh:mm para la visual.
        */
        this.intervalos.forEach(function (elem, index) {

          if (!elem.horaInicialReal && (elem.horaInicialReal != 0)) {
            elem.horaInicialReal = elem.horaInicial;

            let horasAux = (Math.floor(elem.horaInicial / 60)).toString();
            let minutosAux = (elem.horaInicial % 60).toString();

            // Le debemos agregar un 0 antes por si es 1 minuto o 1 hora => 01
            if (horasAux.length == 1) {
              horasAux = '0' + horasAux;
            }
            if (minutosAux.length == 1) {
              minutosAux = '0' + minutosAux;
            }
            // Asignamos el string creado
            elem.horaInicial = horasAux + ':' + minutosAux;
          }

          if (!elem.horaFinReal && (elem.horaFinReal != 0)) {
            elem.horaFinReal = elem.horaFin;

            let horasAux = (Math.floor(elem.horaFin / 60)).toString();
            let minutosAux = (elem.horaFin % 60).toString();

            // Le debemos agregar un 0 antes por si es 1 minuto o 1 hora => 01
            if (horasAux.length == 1) {
              horasAux = '0' + horasAux;
            }
            if (minutosAux.length == 1) {
              minutosAux = '0' + minutosAux;
            }
            // Asignamos el string creado
            elem.horaFin = horasAux + ':' + minutosAux;
          }

        });
      } else {
        this.intervalos = [];
      }
    }

    if (this.intervalos == undefined || this.intervalos == null) {

      const inter = {
        dias: [],
        horaInicial: '',
        horaFin: '',
        horaInicialReal: ''
      };
      this.intervalos.push(inter);
    }
  }

  public actualizarSelector() {
    if (this.obras != null) {
      const yo = this;
      yo.obrasSelector = []; // reseteamos el selector visual

      this.obras.forEach(function (elem, index) {
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
      if (yo.obrasSelector.length > 0) {
        this.actualizado = true;
      }
    }
  }


  public agregarPaciente() {
    const obraId = this.obraSelected._id;
  }


  public agregarIntervalo() {

    const inter = {
      dias: [],
      horaInicial: '',
      horaFin: ''
    };

    this.intervalos.push(inter);
  }

  public agregarObra() {
    const obra = {
      obraSocial: '',
      cantDisponible: 0
    };
    this.turnosPorObra.push(obra);
  }



  public actualizarDiaIntervalo(intervalo, dia) {
    let bandera = false;
    let index = -1;
    for (let i = 0; i < intervalo.dias.length; i++) {
      if (intervalo.dias[i] == dia) {
        index = i;
        bandera = true;
      }
    }
    if (!bandera) {
      intervalo.dias.push(dia);
    } else {
      intervalo.dias.splice(index, 1);
    }
    intervalo.dias.sort(function (a, b) { return a - b; });
  }

  public eliminarIntervalo(index) {
    this.intervalos.splice(index, 1);
  }

  public eliminarSelectorObra(index) {
    this.turnosPorObra.splice(index, 1);
  }

  public trackByIndex(index: number, item) {
    return index;
  }
  
  public actualizarDiaParticular(dia:Number) {

  }

  private parsearObras() {
    const result = [];
    for (let i = 0; i < this.turnosPorObra.length; i++) {
      this.turnosPorObra[i];
      result[i] = { obraSocial: this.turnosPorObra[i].obraSocial, cantDisponible: this.turnosPorObra[i].cantDisponible };
    }
    return result;
  }

  public guardarIntervalos() {

    this.closeFormConfigSemana.nativeElement.click();
    const yo = this;

    let error = false;

    // Actualizamos los horarios iniciales de los intervalos
    const horariosI = this.horariosIniciales.toArray();
    error = this.actualizarHorarios(horariosI, this.intervalos, 'inicial');

    if (!error) {
      // Actualizamos los horarios fin de los intervalos
      const horariosF = this.horariosFinales.toArray();
      error = this.actualizarHorarios(horariosF, this.intervalos, 'fin') && !error;

      if (!error) {
        // Verificamos que ningun horario inicial supere al horario final
        error = !this.intervalosValidos(this.intervalos);
      }
    }

    if (!error) {
      swal({
        title: '¿Estas seguro que queres actualizar el intervalo?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, actualizar!',
        cancelButtonText: 'Cancelar'
      }).then(function () {

        /*
          HoraInicialReal tenia la hora + minutos convetidos a minutos.
          HoraInical tenia un string con formato hh:mm para la visual.
          Lo mismo sucede con HoraFin y HoraFinReal.

          Ahora, para guardar en la base debemos intercambiar los valores (pues necesitamos guardarlo en minutos)
        */

        yo.intervalos.forEach(function (elem, index) {
          elem.horaInicial = elem.horaInicialReal;
          elem.horaFin = elem.horaFinReal;
        });

        const restricciones = yo.diasParticulares.getValues();
        const obras = yo.parsearObras();

        const semana = {
          intervalos: yo.intervalos,
          restricciones: restricciones,
          obrasDisponibles: obras
        };

        // yo.medico.restricciones = restricciones;

        yo.medicosService.actualizarSemana(yo.medico._id, semana).then(resultado => {
          yo.semenaCambiada.next(resultado);
        }).catch(error => { console.log(error); });

        yo.intervalos = [];
        yo.turnosPorObra = [];
        yo.closeFormConfigSemana.nativeElement.click();

      }, function (dismiss) {
        $('#formConfigSemana').modal('show');
      });
    } else {
      swal(
        'Intervalo incorrecto',
        'Revisar los intervalos!',
        'error'
      )
    }
  }

  /**
   * Verifica que un conjunto de intervalos sea valido. 
   * Un intervalo es valido si su horaInicial < horaFin && dias.length > 0.
   * Devuelve si los intervalos son validos o no.
   * @param intervalos 
   */
  private intervalosValidos(intervalos): boolean {
    let valido = true;

    // Verificamos que los intervalos sean validos
    intervalos.forEach( intervalo => {

      if (intervalo.dias <= 0 || intervalo.horaInicialReal > intervalo.horaFinReal) {
        valido = false;
      }
    });

    return valido;
  }

  /**
   * Actualiza los intervalos segun los horarios ingresados. Es parametrizable al tipo.
   * Devuelve si existe o no error.
   * @param horarios
   * @param intervalos
   * @param tipo indica si corresponde horarios "inicial" o "fin"
   */
  private actualizarHorarios(horarios, intervalos, tipo) {

    const yo = this;
    let error = false;
    let horarioConvertido = -1;

    // Actualizamos los horarios d intervalos
    horarios.forEach((elem, index) => {
      horarioConvertido = yo.formatearHorario(elem.nativeElement.value);

      if (horarioConvertido === -1) {
        // Error en la conversion
        error = true;
      } else {
        if (tipo === 'inicial') {
          // Actualizar valor del intervalo real
          intervalos[index].horaInicialReal = horarioConvertido;

        } else {
          if (tipo === 'fin') {
            // Actualizar valor del intervalo real
            intervalos[index].horaFinReal = horarioConvertido;

          } else {
            error = true;
          }
        }

      }
    });
    return error;

  }

  /**
   * Este metodo convierte una hora de formato "12:00" o "12" a su equivalente en minutos.
   * Devuelve el equivalente en minutos o -1 en caso de error.
   */
  private formatearHorario(hora) {

    const valores = hora.split(':');

    const minutosDeHora = parseInt(valores[0]) * 60;
    let horaConvertida = -1;

    // Verificamos que las horas convertidas sean un numerico y mayorIgual a 0
    if (!isNaN(minutosDeHora) && minutosDeHora >= 0) {
      if (valores.length > 1) {
        let minutos = 0;
        minutos = parseInt(valores[1]) * 1;

        // Verificamos que los minutos convertidos sean un numerico y mayorIgual a 0
        if (!isNaN(minutos) && minutos >= 0) {

          horaConvertida = minutos + minutosDeHora;
        } else {
          // No es un valor de minutos validos
          horaConvertida = -1;
        }
      } else {
        // ej: Ingreso 12
        horaConvertida = minutosDeHora;
      }

    } else {
      // No es un valor de hora valido
      horaConvertida = -1;
    }

    return horaConvertida;
  }

  public cancelar() {
    // Cerramos el modal
    // this.obraSelected = null;
    this.closeFormConfigSemana.nativeElement.click();
  }

  public semanaSiguiente() {

    const semanaQueViene = moment().add(1, 'weeks').startOf('isoWeek');
    const finSemanaQueViene = moment(semanaQueViene.toDate(), 'DD-MM-YYYY').add(5, 'days');

    return semanaQueViene.format('DD/MM') + ' al ' + finSemanaQueViene.format('DD/MM');
  }


  // ***************************************************************************
  // Metodos para obtener el horario del timePicker
  // ***************************************************************************


  public horaInicial(intervalo) {

    /*
      OBS: Se debe hacer al estilo de 'JQuery', pues el componente timepicker
      maneja una variable interna que NO actualiza al modelo asociado al input.
      Es decir, al seleccionar un valor con el timepicker,
      el modelo no se esta actualizando por mas de que tenemos [(ngModel)]="intervalos[intervaloIndex].horaInicial
    */

    console.log('El intervalo que me llego es: ', intervalo);


    let indexIntervalo = -1;
    this.intervalos.forEach(function (elem, index) {
      if (elem._id == intervalo._id) {
        indexIntervalo = index;
      }
    });

    const inputsHoraInicial = $('.claseHoraInicial');

    inputsHoraInicial.clockpicker({
      autoclose: true,
      afterDone: function () {
        // FIX : Debemos removerlo para que se reinicie el constructor de clockPicker
        inputsHoraInicial.clockpicker('remove');
      }
    });

    // Obligamos a que la cada vez que se toque se abra
    inputsHoraInicial.clockpicker('show');
  }
  public horaFin(intervalo) {

    /*
      OBS: Se debe hacer al estilo de 'JQuery', pues el componente timepicker
      maneja una variable interna que NO actualiza al modelo asociado al input.
      Es decir, al seleccionar un valor con el timepicker,
      el modelo no se esta actualizando por mas de que tenemos [(ngModel)]="intervalos[intervaloIndex].horaInicial
    */

    let indexIntervalo = -1;
    this.intervalos.forEach(function (elem, index) {
      if (elem._id == intervalo._id) {
        indexIntervalo = index;
      }
    });

    const inputsHoraFin = $('.claseHoraFin');

    inputsHoraFin.clockpicker({
      autoclose: true,
      afterDone: function () {

        // FIX : Debemos removerlo para que se reinicie el constructor de clockPicker
        inputsHoraFin.clockpicker('remove');
      }
    });

    // Obligamos a que la cada vez que se toque se abra
    inputsHoraFin.clockpicker('show');
  }



  // ---------------------------------------------------------------------------
  // Metodos originales del componente

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
  public selected(value: any, pos: number): void {
    this.turnosPorObra[pos].obraSocial = value.id;

  }

  public removed(value: any): void {
  }

  public typed(value: any): void {
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

}
