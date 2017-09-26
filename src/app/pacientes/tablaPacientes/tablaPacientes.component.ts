import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

//Para el data table
import { ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import {SelectionModel} from '@angular/cdk/collections';

//Para ordenar la tabla
import {MdSort} from '@angular/material';

//Para paginar la tabla
import {MdPaginator} from '@angular/material';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { Subscription } from 'rxjs/Subscription';

import { PacientesService } from '../pacientes.service';
import { Paciente } from '../paciente.tipo';

//
import {default as swal} from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-tabla-pacientes',
  templateUrl: './tablaPacientes.component.html',
  styleUrls: ['./tablaPacientes.component.css']
})
export class TablaPacientesComponent implements OnInit {

  @Output() pacienteSeleccionado = new EventEmitter();

  displayedColumns = ['dni', 'email', 'nombre', 'apellido','telefono'];
  exampleDatabase : ExampleDatabase;
  dataSource: ExampleDataSource | null;

  selection = new SelectionModel<string>(true, []);

  seleccionado = {
    'id' : '',
    '_id' : ''
  };
  private subscription: Subscription;
  constructor(private pacientesService: PacientesService, private pacientesCompartidosService: PacientesCompartidosService){
    this.exampleDatabase = new ExampleDatabase(pacientesService, pacientesCompartidosService);
  }

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  rowClick(row){
    // console.log('Tocaron!!!');
    // console.log(row);
    row.seleccionada = !row.seleccionada;

    this.seleccionado = row;
  }

  siguiente(){
    // console.log(this.seleccionado);
    this.pacienteSeleccionado.next(this.seleccionado);
  }

  ngOnInit() {



    this.seleccionado = {
      'id' : '',
      '_id' : ''
    };
    // console.log(this.seleccionado);

    // LABEL de items per page de la tabla
    this.paginator._intl.itemsPerPageLabel = 'Pacientes por página';

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort, this.paginator);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      // console.log('Entre aca');
      if (!this.dataSource) {
        // console.log('No tengo dataSource!!');
        return; }
        else{

          let valorFiltro = this.filter.nativeElement.value;

          if(this.dataSource.filter){
            // console.log('Tengo Filtro!')
          }
          this.dataSource.filter = valorFiltro;
        }
      });
    }

    onPacienteAgregado(paciente){
      this.exampleDatabase.addPaciente(paciente);
    }

    onPacienteEditado(paciente){
      this.exampleDatabase.editPaciente(paciente);
    }


    editar(paciente){

      this.seleccionado = paciente;
      /*
      FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
      alcance a hacerse true.
      */
      setTimeout(()=> {
        $('#formEditarPaciente').modal('show');
      },
      200);

      // let yo = this;
      // swal({
      //   title: '¿Estas seguro que queres editar al paciente?',
      //   text: "No seras capaz de revertir esta accion!",
      //   type: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: 'Si, Editar!',
      //   cancelButtonText: 'Cancelar',
      // }).then(function () {
      //   yo.pacientesService.actualizarPaciente(paciente._id,paciente).then(pac => {
      //       // ////console.log("el nuevo paciente quedo..");
      //       // ////console.log(pac);
      //       paciente = pac;
      //     }).catch(err => console.error(err))
      // }).catch(swal.noop);

    }


  onPacienteEliminado(paciente){
    this.exampleDatabase.removePaciente(paciente);
  }

  }


  //****************************************************************************

  /**
  Base de datos para la tabla.
  */
  export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<Paciente[]> = new BehaviorSubject<Paciente[]>([]);
    get data(): Paciente[] { return this.dataChange.value; }
    private subscription: Subscription;

    constructor(private pacientesService: PacientesService, private pacientesCompartidosService: PacientesCompartidosService) {

      this.observarPacientes();
      // this.pacientesService.getPacientesActivos().then(
      //   pacientes =>{
      //     this.setPacientes(pacientes);
      //   }
      // ).catch(err => {console.log(err)})
    }

    observarPacientes(){
      /*
        Subscribimos a los pacientes, para que tengan una correspondencia
        con los pacientes del navigator
      */
      if(this.pacientesCompartidosService.pacientes$){
        this.subscription = this.pacientesCompartidosService.pacientes$.subscribe((pacientes) => {

          this.setPacientes(pacientes);
          // this.ref.markForCheck();
        }, (err) => {
          console.log('Error en observarPacientes de tablaPacientes');
          console.error(err);
        });

        // Obtenemos los pacientes compartidos
        this.pacientesCompartidosService.getPacientes();
      }
    }


    /**
    Pasamos nuestros trabajos al observer
    */
    setPacientes(pacientes: Paciente[]) {
      let copiedData = pacientes;
      this.dataChange.next(pacientes);

    }


    addPaciente(paciente) {
      const copiedData = this.data.slice();

      this.pacientesCompartidosService.addPaciente(paciente);

      // copiedData.push(paciente);
      // this.dataChange.next(copiedData);
    }

    editPaciente(pacienteEditado){
        this.pacientesCompartidosService.updatePaciente(pacienteEditado);
      // let encontrado = -1;
      // const copiedData = this.data.slice();
      //
      // copiedData.forEach(function(elem, index){
      //   if(elem._id === pacienteEditado._id){
      //     encontrado = index;
      //   }
      // });
      // if(encontrado >= 0){
      //   copiedData[encontrado] = Object.assign({}, pacienteEditado);
      //   this.dataChange.next(copiedData);
      // }
    }

    removePaciente(paciente){
      const copiedData = this.data.slice();
      console.log('El paciente a remover es: ');
      console.log(paciente);

      let indice = -1;
      copiedData.forEach(function(elem,index){
        if(elem._id == paciente._id){
          indice = index;
        }
      });
      if (indice > -1) {
        copiedData.splice(indice, 1);
        this.dataChange.next(copiedData);
      }
    }



  }


  //****************************************************************************

  /**
  Esta clase solo se encarga de hacer el renderizado de la tabla,
  basandose en los datos de ExampleDatabase.
  */
  export class ExampleDataSource extends DataSource<any> {
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }


    filteredData: Paciente[] = [];
    renderedData: Paciente[] = [];

    constructor(private _exampleDatabase: ExampleDatabase,  private _sort: MdSort,  private _paginator: MdPaginator) {
      super();
    }

    /**
    Esta funcion es llamada por la tabla para buscar el stream de datos para renderizar.
    */
    connect(): Observable<Paciente[]> {
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._filterChange,
        this._sort.mdSortChange,
        this._paginator.page
      ];

      return Observable.merge(...displayDataChanges).map(() => {
        // console.log(displayDataChanges);

        //Preparamos el FILTRO de la tabla
        this.filteredData =   this._exampleDatabase.data.slice().filter((item: Paciente) => {

          // Filtro de la fecha
          // let dia = item.fechaRealizacion.getDate();
          // let diaString = dia.toString();
          // if(dia < 10){
          //   diaString = '0'+ dia.toString();
          // }
          // let mes = item.fechaRealizacion.getMonth()+1;
          // let mesString = mes.toString();
          // if(mes < 10){
          //   mesString = '0'+ mes.toString();
          // }
          //
          // let filtroFecha = diaString + '/' + mesString +  '/' + item.fechaRealizacion.getFullYear();

          // Concatenamos los filtros para armar el string de busqueda
          let searchStr = (item.dni + item.email + item.nombre + item.apellido + item.telefono).toLowerCase();

          return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        });

        // Ordenamiento de datos
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);


        return this.renderedData;
      });
    }

    disconnect() {}

    /**
    Retorna una copia ordenada de los datos.
    */
    sortData(data: Paciente[]): Paciente[] {
      if (!this._sort.active || this._sort.direction == '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'dni': [propertyA, propertyB] = [a.dni, b.dni]; break;
          case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
          case 'nombre': [propertyA, propertyB] = [a.nombre, b.nombre]; break;
          case 'apellido': [propertyA, propertyB] = [a.apellido, b.apellido]; break;
          case 'telefono': [propertyA, propertyB] = [a.telefono, b.telefono]; break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
  }
