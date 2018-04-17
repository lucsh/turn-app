import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { SelectComponent, SelectItem } from 'ng2-select';
//Declaramos esta variable para hacer uso de Jquery con los modals de Boostrap
declare var $: any;

@Component({
  selector: 'asignacion-paciente',
  templateUrl: './asignarPacienteTurno.html',
  styleUrls: ['./asignarPacienteTurno.css']
})
export class AsignarPacienteComponent implements OnChanges{

  @Input() fechaNuevoTurno: any;
  @Input() pacientes: Array<any>;
  @Output() nuevaAsignacion = new EventEmitter();

  @ViewChild('closeFormCrearTurno') closeFormCrearTurno: ElementRef;
  @ViewChild('selector2') selector: ElementRef;
  @ViewChild('selector2') mySelectComponent: SelectComponent;

  public horaNuevoTurno: any;
  public diaNuevoTurno: any;

  public descripcion = '';
  public elijeParticular = false;

  public pacientesSelector: Array<any> = [];

  public actualizado = false;

  private pacienteSelected: any = {};
  private _disabledV = '0';
  private disabled = false;

  /*
  Este metodo es llamado cada vez que se cambia la fecha y/o los pacientes (inputs de este componente).
  Principalmente, se completa la variable 'pacientesSelector', para poder ser utilizados con el componente ng2-select.
  Tambien se preparan las variables de horaNuevoTurno y diaNuevoTurno para la visual del modal.
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

    if (this.pacientes != null && this.fechaNuevoTurno != null) {

      // Asignamos las fechas para el modal
      this.horaNuevoTurno = this.fechaNuevoTurno.format('HH:mm');
      this.diaNuevoTurno = this.fechaNuevoTurno.format('DD [de] MMMM');
      this.elijeParticular = false;

      const yo = this;
      this.pacientes.forEach(function (elem, index) {
        /*
        Dado que estamos usando el componente ng2-select,
        debemos tener un arreglo en el que cada objeto TENGA:
        un atributo 'id'
        un atributo 'text'
        */
        yo.pacientesSelector[index] = elem;
        yo.pacientesSelector[index].id = elem._id;
        yo.pacientesSelector[index].text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
      });


      if (yo.pacientesSelector.length > 0) {
        ////console.log('TRUE');

        this.actualizado = true;
      }

      /* START Orden de lista */

      const ordered = this.pacientesSelector.sort((a, b) => {
        const uno = `${a.apellido} ${a.nombre}`.toLowerCase();
        const dos = `${b.apellido} ${b.nombre}`.toLowerCase();
        return uno > dos ? 1 : -1;
      });
      this.pacientesSelector = ordered;
      // console.table(this.pacientesSelector);
      // Se pega una frenada, deberiamos pasarlo a servidor.

      /* END Orden de lista */

    }

  }

  /*

  */
  public asignarTurno(){

    let pacienteAsignado = null;
    const yo = this;

    const desc = this.descripcion;

    this.pacientesSelector.forEach(function(elem, index){
      if (elem.id == yo.pacienteSelected.id){
        pacienteAsignado = Object.assign({}, elem); //clonamos el elemento
        pacienteAsignado.descripcion = desc;
      }
    });

    if (this.elijeParticular) {
      pacienteAsignado.elijeParticular = true;
    } else {
      pacienteAsignado.elijeParticular = false;
    }

    // Quitamos los atributos agregados para el selector del clone
    // delete pacienteAsignado['id'];
    // delete pacienteAsignado['text'];
    // ////console.log(pacienteAsignado);
    // Cerramos el modal
    this.closeFormCrearTurno.nativeElement.click();

    // Enviamos la eleccion al componente padre
    this.nuevaAsignacion.next(pacienteAsignado);
  }

  /*

  */
  public cancelar(){
    // Limpiamos variables
    // this.pacienteSelected = {};

    // Cerramos el modal
    this.closeFormCrearTurno.nativeElement.click();
  }

  /*
    Este metodo reserva un turno SIN paciente para un medico
  */
  public reservar(){

    const turnoReserva = {
      esReserva: true
    };

    // Cerramos el modal
    this.closeFormCrearTurno.nativeElement.click();

    // Enviamos la eleccion al componente padre
    this.nuevaAsignacion.next(turnoReserva);
  }

  /*

  */
  public agregarPaciente(){
    $('#formAgregarPaciente').modal('show');
  }

  public onPacienteAgregado(pacienteNuevo){

    if (this.pacientesSelector.length > 0){
      this.pacientesSelector = [];
    }


    if (pacienteNuevo != null && pacienteNuevo.aprobado){
      this.pacientes.push(pacienteNuevo); // No se si es necesario hacerlo con pacientes

      // Reiniciamos el selector
      const yo = this;
      this.pacientes.forEach(function(elem, index){
        yo.pacientesSelector[index] = elem;
        yo.pacientesSelector[index].id = elem._id;
        yo.pacientesSelector[index].text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
        // Si es el que agregamos lo dejamos seleccionado
        if (elem._id === pacienteNuevo._id) {
          yo.pacienteSelected.id = elem._id;
          yo.pacienteSelected.text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
          // con esto lo seteamos en visual tambien
          yo.mySelectComponent.active = [{id: elem._id, text: elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni}];
        }
      });

      // refreshValue(value);
    }

    if (this.selector !== undefined) {
      /*
      IMPORTANTE: Workaround para que se actualice segun obrasSelector
      Sacado de:
      https://github.com/valor-software/ng2-select/issues/635#issuecomment-281094377
      */

      //this.turnosPorObra[0].obraSocial = this.obrasSelector[0].id;
      // let algo = {
      //   id:'algo',
      //   text: 'algo'
      // }
      //
      // this.pacientesSelector = [algo];

      (<any>this.selector).open();
    }
  }

  public clickeado() {
    console.log('Clickeado: ', this.elijeParticular);
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
  public selected(value: any): void {
  }

  public removed(value: any): void {
  }

  public typed(value: any): void {
  }

  public refreshValue(value: any): void {
    this.pacienteSelected = value;
    // console.log(this.pacientesSelector);
  }
}
;