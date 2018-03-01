import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

//Para el data table
import { ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { SelectionModel } from '@angular/cdk/collections';

// Para ordenar la tabla
import { MdSort } from '@angular/material';

// Para paginar la tabla
import { MdPaginator } from '@angular/material';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { Subscription } from 'rxjs/Subscription';

import { Paciente } from '../paciente.tipo';

//
import { default as swal } from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-tabla-pacientes',
  templateUrl: './tablaPacientes.component.html',
  styleUrls: ['./tablaPacientes.component.css']
})
export class TablaPacientesComponent implements OnInit {

  @Output() pacienteSeleccionado = new EventEmitter();

  displayedColumns = ['dni', 'email', 'nombre', 'apellido', 'telefono'];
  exampleDatabase: ExampleDatabase;
  dataSource: ExampleDataSource | null;

  selection = new SelectionModel<string>(true, []);

  seleccionado = {
    'id': '',
    '_id': ''
  };
  private subscription: Subscription;
  constructor(private pacientesCompartidosService: PacientesCompartidosService) {
    this.exampleDatabase = new ExampleDatabase(pacientesCompartidosService);
  }

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  rowClick(row) {
    row.seleccionada = !row.seleccionada;
    this.seleccionado = row;
  }

  siguiente() {
    this.pacienteSeleccionado.next(this.seleccionado);
  }

  ngOnInit() {

    this.seleccionado = {
      'id': '',
      '_id': ''
    };
    // LABEL de items per page de la tabla
    this.paginator._intl.itemsPerPageLabel = 'Pacientes por página';

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort, this.paginator);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        else {

          const valorFiltro = this.filter.nativeElement.value;

          if (this.dataSource.filter) {
          }
          this.dataSource.filter = valorFiltro;
        }
      });
  }

  onPacienteAgregado(paciente) { }

  onPacienteEditado(paciente) { }


  editar(paciente) {

    this.seleccionado = paciente;
    /*
    FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
    alcance a hacerse true.
    */
    setTimeout(() => {
      $('#formEditarPaciente').modal('show');
    },
      200);
  }


  onPacienteEliminado(paciente) { }

}


// ****************************************************************************

/**
Base de datos para la tabla.
*/
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Paciente[]> = new BehaviorSubject<Paciente[]>([]);
  get data(): Paciente[] { return this.dataChange.value; }
  private subscription: Subscription;

  constructor(private pacientesCompartidosService: PacientesCompartidosService) {
    this.observarPacientes();
  }

  observarPacientes() {
    /*
      Subscribimos a los pacientes, para que tengan una correspondencia
      con los pacientes del navigator
    */
    if (this.pacientesCompartidosService.pacientes$) {
      this.subscription = this.pacientesCompartidosService.pacientes$.subscribe((pacientes) => {
        console.log(pacientes);
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
    const copiedData = pacientes;
    this.dataChange.next(pacientes);

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

  constructor(private _exampleDatabase: ExampleDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
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
      this.filteredData = this._exampleDatabase.data.slice().filter((item: Paciente) => {

        // Concatenamos los filtros para armar el string de busqueda
        const searchStr = (item.dni + item.email + item.nombre + item.apellido + item.telefono).toLowerCase();

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

  disconnect() { }

  /**
  Retorna una copia ordenada de los datos.
  */
  sortData(data: Paciente[]): Paciente[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'dni': [propertyA, propertyB] = [a.dni, b.dni]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'nombre': [propertyA, propertyB] = [a.nombre, b.nombre]; break;
        case 'apellido': [propertyA, propertyB] = [a.apellido, b.apellido]; break;
        case 'telefono': [propertyA, propertyB] = [a.telefono, b.telefono]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
