import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'asignacion-paciente',
  templateUrl: './asignarPacienteTurno.html'
})
export class AsignarPacienteComponent implements OnChanges{

  @Input() fechaNuevoTurno: any;
  @Input() pacientes: Array<any>;
  @Output() nuevaAsignacion = new EventEmitter();

  @ViewChild('closeFormCrearTurno') closeFormCrearTurno: ElementRef;

  public horaNuevoTurno: any;
  public diaNuevoTurno: any;

  public pacientesSelector: Array<any> = [];

  public actualizado: boolean = false;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  /*
    Este metodo es llamado cada vez que se cambia la fecha y/o los pacientes (inputs de este componente).
    Principalmente, se completa la variable 'pacientesSelector', para poder ser utilizados con el componente ng2-select.
    Tambien se preparan las variables de horaNuevoTurno y diaNuevoTurno para la visual del modal.
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

    if(this.pacientes!=null && this.fechaNuevoTurno != null){
      console.log('Entre a Ng on Changes de Asignar PacientesServiceiente a un Turno');

      //Asignamos las fechas para el modal
      this.horaNuevoTurno = this.fechaNuevoTurno.format('HH:mm');
      this.diaNuevoTurno = this.fechaNuevoTurno.format('DD [de] MMMM');

      let yo = this;
      this.pacientes.forEach(function(elem,index){
        /*
          Dado que estamos usando el componente ng2-select,
          debemos tener un arreglo en el que cada objeto TENGA:
            un atributo 'id'
            un atributo 'text'
        */
        yo.pacientesSelector[index] = elem;
        yo.pacientesSelector[index].id = elem.nombre +' ' + elem.apellido + ' - ' + elem.dni;
        yo.pacientesSelector[index].text = elem.nombre +' ' + elem.apellido + ' - ' + elem.dni;
      });
      if(yo.pacientesSelector.length > 1){
        console.log('TRUE');
        this.actualizado = true;
      }
    }

  }

  /*

  */
  public asignarTurno(){

    let pacienteAsignado = null;
    let yo = this;

    this.pacientesSelector.forEach(function(elem,index){
      if(elem.id == yo.value.id){
        console.log('encontre!');
        pacienteAsignado = Object.assign({}, elem); //clonamos el elemento
      }
    });

    //Quitamos los atributos agregados para el selector del clone
    // delete pacienteAsignado['id'];
    // delete pacienteAsignado['text'];
    // console.log(pacienteAsignado);

    //Cerramos el modal
    this.closeFormCrearTurno.nativeElement.click();

    //Enviamos la eleccion al componente padre
    this.nuevaAsignacion.next(pacienteAsignado);
  }

  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.closeFormCrearTurno.nativeElement.click();
  }

  /*

  */
  public agregarPaciente(){

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
    //console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    //console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    //console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }
}