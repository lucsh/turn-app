import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';


import { Obra } from '../../obras/obra.tipo';
import { ObrasService } from '../../obras/obras.service';
import { Turno } from '../turno.tipo';
import { EditarPacienteComponent } from '../../pacientes/editarPaciente/editarPaciente';
import { AgePipe } from '../../pacientes/edad.pipe';
import { TurnoSocketService } from '../turnos-socket.service';

import {default as swal} from 'sweetalert2';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'ver-turno',
  // providers:[TurnoSocketService],
  templateUrl: './verTurno.html'
})
export class VerTurnoComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() obra: any;
  @Input() turno: any;
  @Output() obraEditado = new EventEmitter();

  @ViewChild('closeformVerTurno') closeformVerTurno: ElementRef;

  // private obras: Obra[];
  // private obraSelected: Obra = null;

  public modeloObra = null;


  public horaNuevoTurno: any;
  public diaNuevoTurno: any;

  public pacienteDelTurno: any = null;

  public turnoModificable: boolean = true;


  constructor(
    private obrasService: ObrasService,private turnosSocketService : TurnoSocketService
  ){

  }

  /*
  */
  ngOnInit() {
    // this.obrasService.getObras().then(
    //   obras =>{
    //     console.log('Tengo las obras!!');
    //     this.obras = obras;
    //     this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente
    //
    //     console.log(this.paciente);
    //   }
    // ).catch(error=>{console.log(error)})
    // console.log("Entre al modal");
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    // console.log("Entre al modal22222");
    // console.log(this.turno);

    //Asignamos las fechas para el modal
    if(this.turno != null){
      if(this.turno.paciente.obra == null){
        // console.log('La obra es nullllll');
        this.turno.paciente.obra = {
          _id: 'Particular',
          nombre: 'Particular',
          iniciales: 'Particular'
        };
      }
      this.pacienteDelTurno = this.turno.paciente;
      // let fechaNuevoTurno = this.turno.horaInicial;
      let fechaNuevoTurno = moment(this.turno.horaInicial).utc();
      var today = moment().utc();

      //Verificamos que la fecha del turno, para conocer si lo podra eliminar o no.
      if(fechaNuevoTurno < today){
        this.turnoModificable = false;
      }
      else{
        this.turnoModificable = true;
      }

      // console.log(fechaNuevoTurno);
      this.horaNuevoTurno = fechaNuevoTurno.format('HH:mm');
      this.diaNuevoTurno = fechaNuevoTurno.format('DD [de] MMMM');
    }


    this.modeloObra = Object.assign({}, this.obra); //clonamos el paciente
  }


  public editarPaciente(){
    $('#formEditarPaciente').modal('show');
  }

  public onEditarPaciente(pacienteEditado){
    if(pacienteEditado != null && pacienteEditado != undefined){
      this.pacienteDelTurno = pacienteEditado;
    }
  }
  /*

  */
  public editarObra(){
    ////console.log('Entre a agregar Paciente');
    //  let obraId = this.obraSelected._id;

    // console.log('this.modeloObra');
    // console.log(this.modeloObra);

    this.obrasService.actualizarObra(this.modeloObra._id, this.modeloObra)
    .then(obraEdit => {
      this.obraEditado.next(obraEdit);


      //Cerramos el modal y limpiamos variables
      //this.modeloPaciente = null;
      // this.obraSelected = null;
      this.closeformVerTurno.nativeElement.click();

    }).catch(err => {console.log(err);})
  }


  public cancelarTurno(){
    $('#formVerTurno').modal('hide');
    let yo = this;
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
      console.log("Entre al THEN de la funcion de SWAL y mi tuno id es el de: ", yo.turno._id);
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
