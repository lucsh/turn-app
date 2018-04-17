import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { PacientesCompartidosService } from '../../routerService/pacientes.sistema';
import { Subscription } from 'rxjs/Subscription';

import { Paciente } from '../paciente.tipo';

@Component({
    selector: 'app-tabla-pacientes',
    styleUrls: ['tablaPacientes.component.css'],
    templateUrl: 'tablaPacientes.component.html',
})
export class TablaPacientesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns = ['dni', 'email', 'nombre', 'apellido', 'telefono'];
    dataSource = new MatTableDataSource<Paciente>([]);

    private subscription: Subscription;
    seleccionado = {
        'id': '',
        '_id': ''
    };

    constructor(private pacientesCompartidosService: PacientesCompartidosService) {
        this.observarPacientes();
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


    public addPacientes(pacientes) {
        this.dataSource.data = pacientes;
    }

    private observarPacientes() {
        /*
          Subscribimos a los pacientes, para que tengan una correspondencia
          con los pacientes del sistema
        */
        if (this.pacientesCompartidosService.pacientes$) {
            this.subscription = this.pacientesCompartidosService.pacientes$.subscribe((pacientes) => {
                this.addPacientes(pacientes);
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
    * Aplicamos un filtro a la tabla.
    */
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    editar(paciente) {
        this.seleccionado = paciente;
    }
}