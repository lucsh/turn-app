import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';

import { Paciente } from '../paciente.tipo';
import { PacientesService } from '../pacientes.service';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { Subscription } from 'rxjs/Subscription';

import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';

import {default as swal} from 'sweetalert2';

import {IMyDpOptions} from 'mydatepicker';

import { TurnoSocketService } from '../../turnos/turnos-socket.service';
import * as moment from 'moment';

@Component({
  providers: [TurnoSocketService, PacientesService],
  selector: 'editar-paciente',
  templateUrl: './editarPaciente.html',
  styleUrls: ['./editarPaciente.css']
})
export class EditarPacienteComponent implements OnInit, OnChanges{

  @Input() paciente: any;
  @Output() pacienteEditado = new EventEmitter();
  @Output() pacienteEliminado = new EventEmitter();

  @ViewChild('closeFormEditarPaciente') closeFormEditarPaciente: ElementRef;

  private obras: Obra[];
  public obraSelected: Obra = null;

  public modeloPaciente = null;

  public fechaNacimiento: any = null;

  constructor(
    private pacientesService: PacientesService,
    private obrasService: ObrasService,
    private turnosSocketService: TurnoSocketService
  ){
    this.modeloPaciente = new Paciente();
  }

  //Configuraciones del DatePicker
  public myDatePickerOptions: IMyDpOptions = {
      todayBtnTxt: 'Hoy',
      openSelectorOnInputClick: true,
      editableDateField: false,
      dateFormat: 'dd/mm/yyyy',
      dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
      monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' }
  };

  /*
  */
  ngOnInit() {
    //Seteo la fecha de necimiento al datepicker
    const fechaParcial = new Date(this.paciente.fechaNacimiento);
    this.fechaNacimiento = { date: { year: fechaParcial.getFullYear(), month: fechaParcial.getMonth() + 1, day: fechaParcial.getDate() } };

    this.obrasService.getObras().then(
      obras => {
        this.obras = obras;
        console.log(this.obras);
        const particular = {
          _id: 'Particular',
          nombre: 'Sin Obra',
          iniciales: 'Sin Obra'
        };
        this.obras.unshift(particular);

        this.iniciarObraSeleccionada();
        this.modeloPaciente = null;
        this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente
      }
    ).catch(error => {console.log(error); });
  }

  private iniciarObraSeleccionada(){
    
    this.obraSelected = null;
    const yo = this;

    if (this.paciente.obras.length === 2){
      // this.obraSelected = this.paciente.obras[1];
      this.obras.forEach(function(obra, index){
        if (obra._id === yo.paciente.obras[1]._id){
          yo.obraSelected = obra;
        }
      });
    }else {
      this.obraSelected = this.obras[0];
    }

    // OBSOLETO
    // if (yo.paciente.obra != null){
    //   if (this.obras && yo.paciente != null){
    //     this.obras.forEach(function(obra, index){
    //       if (obra._id == yo.paciente.obra._id){
    //         yo.obraSelected = obra;
    //       }
    //     });
    //   }
    // }
    // else{
    //   this.obraSelected = this.devolverParticular();
    // }
  }


  private devolverParticular(){
    let obraRes: Obra;
    if (this.obras){
      this.obras.forEach(function(obra, index){
        if (obra.nombre == 'Particular' ){
          obraRes = obra;
        }
      });
    }

    return obraRes;
  }
  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    console.log(this.obras);
    if(this.obras !== undefined){
      this.iniciarObraSeleccionada();
    }
    this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente
  }

  /*

  */
  public editarPaciente(){

    //Actualizamos la obra seleccionada
    console.log('Entre a editar paciente y tengo de id... ', this.obraSelected._id);
    if (this.obraSelected && this.obraSelected.nombre == 'Particular'){
      this.modeloPaciente.obra = null;
      console.log('Entre al if de Particular');
    }
    else{
      if (this.obraSelected){
        this.modeloPaciente.obra = this.obraSelected._id;
        console.log('Entre al else, y tengo... ', this.modeloPaciente.obra);
      }
    }

    this.modeloPaciente.fechaNacimiento = this.fechaNacimiento.jsdate;

    this.modeloPaciente.email = this.modeloPaciente.email.toLowerCase();
    this.pacientesService.actualizarPaciente(this.modeloPaciente._id, this.modeloPaciente)
    .then(pacienteEdit => {

      this.pacienteEditado.next(pacienteEdit);

      //Cerramos el modal y limpiamos variables
      //this.modeloPaciente = null;
      this.obraSelected = null;
      this.closeFormEditarPaciente.nativeElement.click();

    }).catch(err => {console.log(err); });
  }

  sancionar(paciente){

    const yo = this;
    swal({
      title: '¿Estas seguro que queres sancionar al paciente?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Sancionar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.sancionarPaciente(paciente._id).then(pac => {
        paciente.sancion = true;
      }).catch(err => console.error(err));
    }).catch(swal.noop);
  }

  habilitar(paciente){
    const yo = this;
    swal({
      title: '¿Estas seguro que queres habilitar al paciente?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Habilitar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.habilitarPaciente(paciente._id).then(pac => {
        paciente.sancion = false;
      }).catch(err => console.error(err));
    }).catch(swal.noop);
  }

  eliminar(paciente){
    const yo = this;
    swal({
      title: '¿Estas seguro que queres eliminar al paciente?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.eliminarPaciente(paciente._id).then(pac => {
        yo.pacienteEliminado.next(pac);
        yo.obraSelected = null;
        yo.closeFormEditarPaciente.nativeElement.click();
      }).catch(err => console.error(err));
    }).catch(swal.noop);
  }

  generarPass(paciente){
    const yo = this;
    yo.modeloPaciente.password = yo.modeloPaciente.nombre.charAt(0).toLowerCase() + yo.modeloPaciente.apellido.charAt(0).toLowerCase() + yo.modeloPaciente.dni;
    swal.queue([{
      title: 'Desea reinciar la contraseña?',
      confirmButtonText: 'Reiniciar',
      text:
        'A continuación se le mostrará la nueva contraseña. (Primera letra nombre) + (Primera letra apellido) + dni',
      showLoaderOnConfirm: true,
      preConfirm: function () {
        return new Promise(function (resolve) {

            yo.pacientesService.actualizarPaciente(yo.modeloPaciente._id, yo.modeloPaciente)
            .then(pacienteEdit => {
                swal.insertQueueStep(yo.modeloPaciente.password);
                resolve();
            }).catch(err => {console.log(err); });

        });
      }
    }]);

  }

  verTurnosActivos(paciente){
    let turnos;
    this.turnosSocketService.obtenerTurnosActivosPaciente(paciente._id).then((turnos) => {
      let mensaje = '';
      console.log(turnos.length);
      if (turnos.length != 0){

        mensaje += 'El paciente tiene los siguientes turnos activos:';
        turnos.forEach(function(elem, index){
          console.log(elem);
          //CAMBIAR HORA
          const horaInicial = moment(elem.horaInicial).add(3, 'h');
          mensaje += '<hr>' + horaInicial.format('dddd D') + ' de ' + horaInicial.format('MMMM') + ' a las ' + horaInicial.format('HH:mm') + ' con Doc: <strong>' + elem.medico.apellido + '</strong>';
        });
      }else{
        mensaje += 'El paciente no posee turnos activos';
      }
      swal({
        title: 'Turnos Activos',
        //type: 'info',
        html:

          mensaje,
        showCloseButton: true,
        showCancelButton: false,

        confirmButtonText:
          'Cerrar!',
        //confirmButtonAriaLabel: 'Cerrar!',

      });

    });




  }

  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormEditarPaciente.nativeElement.click();
  }

}
