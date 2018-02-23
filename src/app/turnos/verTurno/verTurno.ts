import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';


import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';
import { Turno } from '../turno.tipo';
import { EditarPacienteComponent } from '../../pacientes/editarPaciente/editarPaciente';
import { AgePipe } from '../../pacientes/edad.pipe';
import { TurnoSocketService } from '../turnos-socket.service';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';

import {default as swal} from 'sweetalert2';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'ver-turno',
  templateUrl: './verTurno.html'
})
export class VerTurnoComponent implements OnInit, OnChanges{

  @Input() obra: any;
  @Input() turno: any;
  @Output() obraEditado = new EventEmitter();

  @ViewChild('closeformVerTurno') closeformVerTurno: ElementRef;

  public modeloObra = null;
  public horaNuevoTurno: any;
  public diaNuevoTurno: any;
  public pacienteDelTurno: any = null;
  public turnoModificable = true;

  constructor(
    private obrasService: ObrasService, private turnosSocketService : TurnoSocketService, private pacientesCompartidosService: PacientesCompartidosService
  ){

  }

  /*
  */
  ngOnInit() {

  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...

    //Asignamos las fechas para el modal
    if (this.turno != null){
      if (this.turno.paciente.obra == null){
        this.turno.paciente.obra = {
          _id: 'Particular',
          nombre: 'Particular',
          iniciales: 'Particular'
        };
      }
      this.pacienteDelTurno = this.turno.paciente;
      // let fechaNuevoTurno = this.turno.horaInicial;
      const fechaNuevoTurno = moment(this.turno.horaInicial).utc().add(3, 'h');
      const today = moment();

      //Verificamos que la fecha del turno, para conocer si lo podra eliminar o no.
      if (fechaNuevoTurno < today){
        this.turnoModificable = false;
      }
      else{
        this.turnoModificable = true;
      }

      this.horaNuevoTurno = fechaNuevoTurno.format('HH:mm');
      this.diaNuevoTurno = fechaNuevoTurno.format('DD [de] MMMM');
    }


    this.modeloObra = Object.assign({}, this.obra); //clonamos el paciente
  }


  public editarPaciente(){
    $('#formEditarPaciente').modal('show');
  }

  public onEditarPaciente(pacienteEditado){
    if (pacienteEditado != null && pacienteEditado != undefined){
      this.pacienteDelTurno = pacienteEditado;
      this.pacientesCompartidosService.updatePaciente(pacienteEditado);
    }
  }
  /*

  */
  public editarObra(){
    this.obrasService.actualizarObra(this.modeloObra._id, this.modeloObra)
    .then(obraEdit => {
      this.obraEditado.next(obraEdit);


      //Cerramos el modal y limpiamos variables
      //this.modeloPaciente = null;
      // this.obraSelected = null;
      this.closeformVerTurno.nativeElement.click();

    }).catch(err => {console.log(err); });
  }


  public cancelarTurno(){
    $('#formVerTurno').modal('hide');
    const yo = this;
    swal({
      title: '¿Estas seguro que queres eliminar el turno?',
      //text: 'You will not be able to recover this imaginary file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(function() {
      // $('#calendar').fullCalendar('removeEvents', function (event) {
      //   return event == calEvent; //Esto remueve solamente el evento "clickeado" que entra por parametro del evento del calendario 'calEvent'
      // });
      yo.turnosSocketService.eliminarTurno(yo.turno._id);
    }, function(dismiss){
      //Aca entra si se arrepiente de eliminar el turno!!!!
      $('#formVerTurno').modal('show');
    }).catch(swal.noop);
  }


  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    // this.obraSelected = null;
    this.closeformVerTurno.nativeElement.click();
  }

}
