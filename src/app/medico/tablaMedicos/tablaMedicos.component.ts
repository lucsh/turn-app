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

import {ConfiguracionMedicoService} from '../../configuracion-medico/configuracion-medico.service';
import { Obra } from '../../obras/obra.tipo';

import { MedicosCompartidosService } from '../../routerService/medicos.sistema';
import { ObrasCompartidasService } from '../../routerService/obras.sistema';
import { Subscription } from 'rxjs/Subscription';

//
import {default as swal} from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-tabla-medicos',
  templateUrl: './tablaMedicos.component.html',
  styleUrls: ['./tablaMedicos.component.css']
})
export class TablaMedicosComponent implements OnInit {

  @Output() medicoSeleccionadoEvento = new EventEmitter();

  displayedColumns = ['matricula', 'nombre', 'apellido', 'duracion', 'acciones'];
  exampleDatabase : ExampleDatabase;
  dataSource: ExampleDataSource | null;

  selection = new SelectionModel<string>(true, []);

  public obras: Obra[];
  private obrasSubscription: Subscription;

  medicoSeleccionado = {
    'id' : '',
    '_id' : '',
    'obras':[]
  };

  constructor(
    private medicosCompartidos: MedicosCompartidosService,
    private obrasCompartidas: ObrasCompartidasService,
    private configuracionMedicoService: ConfiguracionMedicoService
  ){
    this.exampleDatabase = new ExampleDatabase(medicosCompartidos);
  }

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  rowClick(row){
    row.seleccionada = !row.seleccionada;
    this.medicoSeleccionado = row;
  }

  siguiente(){
    this.medicoSeleccionadoEvento.next(this.medicoSeleccionado);
  }

  ngOnInit() {


    this.observarObras();

    this.medicoSeleccionado = {
      'id' : '',
      '_id' : '',
      'obras':[]

    };

    // LABEL de items per page de la tabla
    this.paginator._intl.itemsPerPageLabel = 'Médicos por página';

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort, this.paginator);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) {
        return; }
        else{

          let valorFiltro = this.filter.nativeElement.value;
          this.dataSource.filter = valorFiltro;
        }
      });
    }

    observarObras(){
      /*
        Subscribimos a los obras, para que tengan una correspondencia
        con los obras del navigator
      */
      if(this.obrasCompartidas.obras$){
        this.obrasSubscription = this.obrasCompartidas.obras$.subscribe((obras) => {

            this.obras = obras;
          // this.ref.markForCheck();
        }, (err) => {
          console.log('Error en observarObras de tablaMedicos');
          console.error(err);
        });

        // Obtenemos los pacientes compartidos
        this.obrasCompartidas.getObras();
      }
    }

    onMedicoAgregado(medico){
      this.exampleDatabase.addMedico(medico);
    }

    onMedicoEditado(medico){
      this.exampleDatabase.editMedico(medico);
    }


    editarMedico(medico){

      this. medicoSeleccionado = medico;
      /*
      FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
      alcance a hacerse true.
      */
      setTimeout(()=> {
        $('#formEditarMedico').modal('show');
      },
      200);
    }


    onMedicoEliminados(medico){
      this.exampleDatabase.removeMedico(medico);
    }

    // Metodos de configurar semana
    configurarSemana(medico){

      this.medicoSeleccionado = medico;
      let semanaGuardada;
      this.configuracionMedicoService.getSemanaModelo(medico).then(semana =>{
        //Abrimos el modal...
        semanaGuardada = semana;

        $('#formConfigSemana').modal('show');

      });
    }

    onIntervalosGuardados(medicoCambiado){

      /*
        OBS: el medico viene SIN los datos de usuario.
        Es decir, no tenemos el nombre, apellido, etc.
        Solo debemos actualizar los datos de la semanaEsquema del medico
      */


      //Actualizamos el medico modificado
      this.exampleDatabase.actualizarSemana(medicoCambiado);

      //Sacamos la seleccion del medico, para que dsps no haya inconsistencias
      this.medicoSeleccionado = {
        'id' : '',
        '_id' : '',
        'obras':[]
      };
    }

  }


  //****************************************************************************

  /**
  Base de datos para la tabla.
  */
  export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    get data(): any[] { return this.dataChange.value; }
    private medicosSubscription: Subscription;

    constructor(private medicosCompartidos: MedicosCompartidosService) {
      this.observarMedicos();
    }

    observarMedicos(){
      /*
      Subscribimos a los medicos, para que tengan una correspondencia
      con los medicos del navigator
      */
      if(this.medicosCompartidos.medicos$){
        this.medicosSubscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {

          this.setMedicos(medicos);
          // this.ref.markForCheck();
        }, (err) => {
          console.error(err);
        });
      }

      this.medicosCompartidos.getMedicos();
    }


    /**
    Pasamos nuestros medicos al observer
    */
    setMedicos(medicos: any[]) {
      let copiedData = medicos;
      this.dataChange.next(medicos);
    }


    addMedico(medico) {
      this.medicosCompartidos.addMedico(medico);
    }

    editMedico(medicoEditado){
      this.medicosCompartidos.updateMedico(medicoEditado);
    }

    removeMedico(medico){
      this.medicosCompartidos.deleteMedico(medico);
    }

    actualizarSemana(medicoCambiado){
      this.medicosCompartidos.actualizarSemana(medicoCambiado);
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


    filteredData: any[] = [];
    renderedData: any[] = [];

    constructor(private _exampleDatabase: ExampleDatabase,  private _sort: MdSort,  private _paginator: MdPaginator) {
      super();
    }

    /**
    Esta funcion es llamada por la tabla para buscar el stream de datos para renderizar.
    */
    connect(): Observable<any[]> {
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._filterChange,
        this._sort.mdSortChange,
        this._paginator.page
      ];

      return Observable.merge(...displayDataChanges).map(() => {

        //Preparamos el FILTRO de la tabla
        this.filteredData =   this._exampleDatabase.data.slice().filter((item: any) => {

          // Concatenamos los filtros para armar el string de busqueda
          let searchStr = (item.matricula + item.nombre + item.apellido + item.duracion + item.acciones).toLowerCase();

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
    sortData(data: any[]): any[] {
      if (!this._sort.active || this._sort.direction == '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'matricula': [propertyA, propertyB] = [a.matricula, b.matricula]; break;
          case 'nombre': [propertyA, propertyB] = [a.nombre, b.nombre]; break;
          case 'apellido': [propertyA, propertyB] = [a.apellido, b.apellido]; break;
          case 'duracion': [propertyA, propertyB] = [a.duracion, b.duracion]; break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
  }
