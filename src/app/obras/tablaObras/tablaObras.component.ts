import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { ObrasService } from 'app/shared/services/obras.service';
import { ObrasCompartidasService } from '../../routerService/obras.sistema';
import { Subscription } from 'rxjs/Subscription';
import { Obra } from '../../shared/models/obra.tipo';

@Component({
    selector: 'app-tabla-obras',
    templateUrl: './tablaObras.component.html',
    styleUrls: ['./tablaObras.component.css']
})
export class TablaObrasComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns = ['nombre', 'iniciales'];
    dataSource = new MatTableDataSource<Obra>([]);

    private obrasSubscription: Subscription;
    seleccionado = {
        'id': '',
        '_id': ''
    };

    constructor(private obrasCompartidasService: ObrasCompartidasService) {
        this.observarObras();
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


    public addObras(pacientes) {
        this.dataSource.data = pacientes;
    }

    private observarObras() {
        if (this.obrasCompartidasService.obras$) {
            this.obrasSubscription = this.obrasCompartidasService.obras$.subscribe((obras) => {

                // console.log("Obras subscriptas...", obras);
                if (obras != null) {
                    obras = this.limpiarParticular(obras);
                }
                this.addObras(obras);
                // this.ref.markForCheck();
            }, (err) => {
                console.log('Error en observarObras de tablaObras');
                console.error(err);
            });

            // Obtenemos los pacientes compartidos
            this.obrasCompartidasService.getObras();
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

    editar(obra) {
        this.seleccionado = obra;
    }

    /** Este metodo es creado para quitar la obra Particular (que en realidad fue agregada a este arreglo para crear una sensacion visual, y no es una obra real en el BACKEND) */
    private limpiarParticular(obras) {
        const resultado = [];
        if (obras != null) {
            for (let index = 0; index < obras.length; index++) {
                const element = obras[index];
                if (element.nombre != 'Particular') {
                    resultado.push(element);
                }

            }
        }
        return resultado;
    }
}