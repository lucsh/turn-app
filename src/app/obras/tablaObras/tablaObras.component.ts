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


import { ObrasService } from '../obras.service';
import { Obra } from '../obra.tipo';

//
import {default as swal} from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-tabla-obras',
  templateUrl: './tablaObras.component.html',
  styleUrls: ['./tablaObras.component.css']
})
export class TablaObrasComponent implements OnInit {

  @Output() obraSeleccionada = new EventEmitter();

  displayedColumns = ['nombre', 'iniciales'];
  exampleDatabase : ExampleDatabase;
  dataSource: ExampleDataSource | null;

  selection = new SelectionModel<string>(true, []);

  seleccionado = {
    'id' : ''
  };

  constructor(private obrasService: ObrasService){
    this.exampleDatabase = new ExampleDatabase(obrasService);
  }

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  rowClick(row){
    row.seleccionada = !row.seleccionada;
    this.seleccionado = row;
  }

  siguiente(){
    this.obraSeleccionada.next(this.seleccionado);
  }

  ngOnInit() {


    this.seleccionado = {
      'id' : ''
    };

    // LABEL de items per page de la tabla
    this.paginator._intl.itemsPerPageLabel = 'Obras por página';

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

    onObraAgregada(obra){
      this.exampleDatabase.addObra(obra);
    }

    onObraEditada(obra){
      this.exampleDatabase.editObra(obra);
    }


    editar(obra){

      this.seleccionado = obra;
      /*
      FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
      alcance a hacerse true.
      */
      setTimeout(()=> {
        $('#formEditarObra').modal('show');
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


  onObraEliminada(obra){
    this.exampleDatabase.removeObra(obra);
  }

  }


  //****************************************************************************

  /**
  Base de datos para la tabla.
  */
  export class ExampleDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<Obra[]> = new BehaviorSubject<Obra[]>([]);
    get data(): Obra[] { return this.dataChange.value; }


    constructor(private obrasService: ObrasService) {
      this.obrasService.getObras().then(
        obras =>{
          this.setObras(obras);
        }
      ).catch(err => {console.log(err)})
    }


    /**
    Pasamos nuestros trabajos al observer
    */
    setObras(pacientes: Obra[]) {
      let copiedData = pacientes;
      this.dataChange.next(pacientes);

    }


    addObra(obra) {
      const copiedData = this.data.slice();
      copiedData.push(obra);
      this.dataChange.next(copiedData);
    }

    editObra(obraEditada){
      let encontrado = -1;
      const copiedData = this.data.slice();

      copiedData.forEach(function(elem, index){
        if(elem._id === obraEditada._id){
          encontrado = index;
        }
      });
      if(encontrado >= 0){
        copiedData[encontrado] = Object.assign({}, obraEditada);
        this.dataChange.next(copiedData);
      }
    }

    removeObra(obra){
      const copiedData = this.data.slice();

      let indice = -1;
      copiedData.forEach(function(elem,index){
        if(elem._id == obra._id){
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


    filteredData: Obra[] = [];
    renderedData: Obra[] = [];

    constructor(private _exampleDatabase: ExampleDatabase,  private _sort: MdSort,  private _paginator: MdPaginator) {
      super();
    }

    /**
    Esta funcion es llamada por la tabla para buscar el stream de datos para renderizar.
    */
    connect(): Observable<Obra[]> {
      const displayDataChanges = [
        this._exampleDatabase.dataChange,
        this._filterChange,
        this._sort.mdSortChange,
        this._paginator.page
      ];

      return Observable.merge(...displayDataChanges).map(() => {
        // console.log(displayDataChanges);

        //Preparamos el FILTRO de la tabla
        this.filteredData =   this._exampleDatabase.data.slice().filter((item: Obra) => {

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
          let searchStr = (item.nombre + item.iniciales).toLowerCase();

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
    sortData(data: Obra[]): Obra[] {
      if (!this._sort.active || this._sort.direction == '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'nombre': [propertyA, propertyB] = [a.nombre, b.nombre]; break;
          case 'iniciales': [propertyA, propertyB] = [a.iniciales, b.iniciales]; break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
  }
