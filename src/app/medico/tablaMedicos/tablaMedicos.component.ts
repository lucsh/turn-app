import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { MedicosCompartidosService } from '../../routerService/medicos.sistema';
import { Subscription } from 'rxjs/Subscription';
import { ConfiguracionMedicoService } from '../../configuracion-medico/configuracion-medico.service';

import { ObrasCompartidasService } from '../../routerService/obras.sistema';
import { Obra } from '../../shared/models/obra.tipo';

//
import { default as swal } from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-tabla-medicos',
  templateUrl: './tablaMedicos.component.html',
  styleUrls: ['./tablaMedicos.component.css']
})
export class TablaMedicosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['matricula', 'nombre', 'apellido', 'duracion', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);

  private obrasSubscription: Subscription;
  private medicosSubscription: Subscription;
  public obras: Obra[];
  public puedeEditar = false;

  medicoSeleccionado = {
    'id': '',
    '_id': '',
    'obras': []
  };

  constructor(
    private medicosCompartidos: MedicosCompartidosService,
    private obrasCompartidas: ObrasCompartidasService,
    private configuracionMedicoService: ConfiguracionMedicoService
  ) {
    this.observarObras();
    this.observarMedicos();
  }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /**
  * Set the paginator after the view init since this component will
  * be able to query its view for the initialized paginator.
  */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
  * Aplicamos un filtro a la tabla.
  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  private addMedicos(medicos) {
    this.dataSource.data = medicos;
  }

  private observarMedicos() {
    /*
    Subscribimos a los medicos, para que tengan una correspondencia
    con los medicos del sistema
    */
    if (this.medicosCompartidos.medicos$) {
      this.medicosSubscription = this.medicosCompartidos.medicos$.subscribe((medicos) => {

        this.addMedicos(medicos);
        // this.ref.markForCheck();
      }, (err) => {
        console.error(err);
      });
    }

    this.medicosCompartidos.getMedicos();
  }

  private observarObras() {
    /*
      Subscribimos a los obras, para que tengan una correspondencia
      con los obras del sistema
    */
    if (this.obrasCompartidas.obras$) {
      this.obrasSubscription = this.obrasCompartidas.obras$.subscribe((obras) => {
        this.obras = obras.slice();
        // this.ref.markForCheck();
      }, (err) => {
        console.log('Error en observarObras de tablaMedicos');
        console.error(err);
      });

      // Obtenemos los pacientes compartidos
      this.obrasCompartidas.getObras();
    }
  }


  editarMedico(medico) {
    this.medicoSeleccionado = medico;
    this.puedeEditar = true;
  }

  // Metodos de configurar semana
  configurarSemana(medico) {
    this.puedeEditar = false;
    this.medicoSeleccionado = medico;
    let semanaGuardada;
    this.configuracionMedicoService.getSemanaModelo(medico).then(semana => {
      // Abrimos el modal...
      semanaGuardada = semana;

      $('#formConfigSemana').modal('show');

    });
  }

  onIntervalosGuardados(medicoCambiado) {
    // Sacamos la seleccion del medico, para que dsps no haya inconsistencias
    this.medicoSeleccionado = {
      'id': '',
      '_id': '',
      'obras': []
    };
  }

}