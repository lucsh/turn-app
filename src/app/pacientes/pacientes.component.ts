import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {DataFilterPipe} from './pacientes-filter.pipe';
import {PacientesService} from './pacientes.service';
import {Paciente} from './paciente.tipo';

import {default as swal} from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-pacientes',
  providers: [PacientesService],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  public data;
  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'email';
  public sortOrder = 'asc';

  public pacienteSelected = null;

  pacientes: Paciente[];

  constructor(private http: Http, private pacientesService: PacientesService) {
  }

  ngOnInit(): void {
  }

  public toInt(num: string) {
      return +num;
  }

  getAllPacientes(): void{
    this.pacientesService
    .getPacientes()
    .then(pacientes => {
        this.pacientes = pacientes;
        this.data = pacientes;
    });
  }

  getAllPacientesActivados(): void{
    this.pacientesService
    .getPacientesActivos()
    .then(pacientes => {
        this.pacientes = pacientes;
        this.data = pacientes;
    });
  }
  public sortByWordLength = (a: any) => {
      return a.city.length;
  }

  buscarPaciente(id: string){
    this.pacientesService.buscarPaciente(id).then(paciente => {
    });
  }

  editar(paciente){

    this.pacienteSelected = paciente;
    /*
      FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
      alcance a hacerse true.
    */
    setTimeout(() => {
      $('#formEditarPaciente').modal('show');
    },
    200);
  }

  /*
    Abrimos el modal para agregar un nuevo paciente
  */
  formAgregarPaciente(){
    setTimeout(() => {
      $('#formAgregarPaciente').modal('show');
    },
    200);
  }

  onPacienteAgregado(pacienteNuevo){
    if (pacienteNuevo){
      //Actualizamos la vista
      this.pacientes.push(pacienteNuevo);
    }
  }

  onPacienteEditado(pacienteEditado){
    let encontrado = -1;
    this.pacientes.forEach(function(elem, index){
      if (elem._id === pacienteEditado._id){
        encontrado = index;
      }
    });
    if (encontrado >= 0){
      this.pacientes[encontrado] = Object.assign({}, pacienteEditado);
    }

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
      //text: "No seras capaz de revertir esta accion!",
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
      title: '¿Estas seguro que queres habilitar al paciente?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.pacientesService.eliminarPaciente(paciente._id).then(pac => {
        const index = yo.data.indexOf(paciente);
        if (index > -1) {
          yo.data.splice(index, 1);
        }
        paciente.eliminado = true;
      }).catch(err => console.error(err));
    }).catch(swal.noop);
  }

}
